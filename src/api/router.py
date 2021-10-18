from fastapi import Depends, FastAPI, Response, Header, status, File, UploadFile
from sqlalchemy.orm import Session
from database import *
from IofXmlReader.ResultsReader import ResultListReader, ClassResultReader, PersonResultReader
import schemas
import databaseActions as dba


Base.metadata.create_all(bind=engine)

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

    eventname = raceresults.race_name

    # create event
    e = dba.create_event(db, schemas.EventCreate(name=eventname))

    # create race classes
    # create event classes
    # map race class and event class
    # create race courses
    # create race results
    # return event info and key for further editing?
    
    
    return {"filename": file.filename, "event": e}
    # takes an xml file and maybe some properties
    # creates structures in db to house everything
    # returns the new *event* with key, for further editing as needed.