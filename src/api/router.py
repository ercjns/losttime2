from fastapi import Depends, FastAPI, Response, Header, status, File, UploadFile
from sqlalchemy.orm import Session
from database import *
from IofXmlReader.ResultsReader import ResultListReader, ClassResultReader, PersonResultReader
import schemas
import databaseActions as dba
from datetime import datetime


Base.metadata.create_all(bind=engine)

WORLDCUP_SCORE_CLASSES = ['W1F', 'W1M', 'W2F', 'W2M', 'W3F', 'W3M', 'W4F', 'W5M','W5FIC', 'W5MIC', 'W6F', 'W6M', 'W8F', 'W8M', '8F', '8M']
WIOL_MS_CLASSES = ['W2F', 'W2M']
WIOL_TEAMSCORE_CLASSES = ['W3F', 'W3M', 'W4F', 'W5M','W5FIC', 'W5MIC', 'W6F', 'W6M', 'W8F', 'W8M']

api = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@api.on_event("startup")
async def startup():
    await Base.connect()

@api.on_event("shutdown")
async def shutdown():
    await Base.disconnect()

@api.get("/")
def hello_world():
    return {"message": "Hello world from the losttime2 API!"}

@api.post("/events")
def create_event(
        event: schemas.EventCreate, 
        db: Session = Depends(get_db)):
    return dba.create_event(db, event)

@api.get("/events")
async def get_events(db: Session = Depends(get_db)):
    return dba.get_events(db)

@api.get("/events/{eventid}/classes", status_code=status.HTTP_200_OK)
async def get_event_classes(
        eventid: int,
        response: Response,
        db: Session = Depends(get_db)):
    # This is simplified to only suport single-race events right now. This will have to change, possibly including the url, when that changes.
    items = dba.get_event_classes(db, eventid)
    if (items is None):
        response.status_code = status.HTTP_404_NOT_FOUND
        return {}
    res = []
    for eventclass, link, raceclass in items:
        a = {}
        a['eventclass_id'] = link.eventclass_id
        a['raceclass_id'] = link.raceclass_id
        a['name'] = eventclass.name
        a['name_short'] = raceclass.name_short
        a['race_scoring'] = link.race_scoring
        a['event_scoring'] = eventclass.event_scoring
        a['raceresults'] = dba.get_raceclass_results(db, link.raceclass_id)
        res.append(a)
    return res

@api.get("/events/{eventid}", status_code=status.HTTP_200_OK)
def get_event_details(
        eventid: int,
        response: Response, 
        db: Session = Depends(get_db)):
    e = dba.get_event(db, eventid)
    if (e is None):
        response.status_code = status.HTTP_404_NOT_FOUND
    return e

@api.put("/events/{eventid}")
def update_event(
        eventid: int,
        event: schemas.Event,
        response: Response,
        authroization: str = Header(None),
        db: Session = Depends(get_db)):
    
    e = dba.get_event_secure(db, eventid)

    if (e is None):
        response.status_code = status.HTTP_404_NOT_FOUND
        return

    if (e.api_key != authroization or e.id != event.id):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return e

    return dba.update_event(db, eventid, event)

@api.post("/race")
async def create_single_race_event(
        file: UploadFile = File(...),
        db: Session = Depends(get_db)):

    # parse xml file
    raceresults = ResultListReader(file.file)

    # create event (a bucket for 1+ races)
    eventname = raceresults.race_name
    e = dba.create_event(db, schemas.EventCreate(name=eventname))

    # create race
    r = dba.create_race(db, schemas.RaceCreate(name=eventname, date=datetime.today(), venue=""))

    # create event classes and race classes
    # link event classes and race classes
    for rc in raceresults.class_results:
        classresults = ClassResultReader(rc)
        db_eventclass = dba.create_event_class(db,
            schemas.EventClassCreate(
                event_id = e.id,
                name = classresults.class_name,
                event_scoring = 'RaceScoring'
            )
        )
        db_raceclass = dba.create_race_class(db,
            schemas.RaceClassCreate(
                race_id = r.id,
                name = classresults.class_name,
                name_short = classresults.class_name_short
            )
        )
        dba.assign_raceclass_to_eventclass(db,
            raceclass_id = db_raceclass.id,
            eventclass_id = db_eventclass.id,
            race_scoring = 'WorldCup' if classresults.class_name_short in WORLDCUP_SCORE_CLASSES else 'Time'
        )

        if classresults.class_name_short in WIOL_MS_CLASSES:
            wt2 = dba.get_WT2_class(db, e.id)
            if not wt2:
                wt2 = dba.create_event_class(db,
                    schemas.EventClassCreate(
                        event_id = e.id,
                        name = 'Middle School Teams',
                        event_scoring = 'WIOLTeams'
                    )
                )
            dba.assign_raceclass_to_eventclass(db,
                raceclass_id = db_raceclass.id,
                eventclass_id = wt2.id,
                race_scoring = 'WorldCup'
            )
        elif classresults.class_name_short in WIOL_TEAMSCORE_CLASSES:
            db_eventteamclass = dba.create_event_class(db,
                schemas.EventClassCreate(
                    event_id = e.id,
                    name = classresults.class_name + ' Teams',
                    event_scoring = 'WIOLTeams'
                )
            )
            dba.assign_raceclass_to_eventclass(db,
                raceclass_id = db_raceclass.id,
                eventclass_id = db_eventteamclass.id,
                race_scoring = 'WorldCup'
            )


        for rcr in classresults.result_nodes:

            raceresult = PersonResultReader(rcr)

            person_temp = "{} {}".format(raceresult.first_name, raceresult.last_name)

            db_raceentry = dba.create_race_entry(db,
                schemas.RaceEntryCreate(
                    person = person_temp,
                    club = raceresult.club_name_short,
                    bib = raceresult.bib,
                    epunch = raceresult.control_card,
                    raceclass_id = db_raceclass.id,
                    competitive = False if raceresult.status == 'NotCompeting' else True
                )
            )
            db_raceresult = dba.create_race_result(db,
                schemas.RaceResultCreate(
                    entry_id = db_raceentry.id,
                    start_time = raceresult.start_time,
                    end_time = raceresult.finish_time,
                    course_completed = raceresult.status,
                    finish_status = raceresult.status
                )
            )
            

    
    # create race courses

    # return event info and key for further editing? 
    
    return {"filename": file.filename, "event": e.toJSON(key=True)}
    # takes an xml file and maybe some properties
    # creates structures in db to house everything
    # returns the new *event* with key, for further editing as needed.