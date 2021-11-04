from sqlalchemy.orm import Session
import uuid

import models, schemas

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(name=event.name, api_key=uuid.uuid4().hex)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session, skip: int = 0, limit: int = 100):
    events = db.query(models.Event).offset(skip).limit(limit).all()
    return [e.without_key() for e in events]

def get_event(db: Session, id: int):
    return db.query(models.Event).get(id).without_key()

def get_event_secure(db: Session, id: int):
    return db.query(models.Event).get(id)

def update_event(db: Session, id: int, update: schemas.Event):
    db_event = db.query(models.Event).get(id)
    if db_event.id != id:
        raise KeyError
    db_event.name = update.name
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event.without_key()

def create_race(db: Session, race=schemas.RaceCreate):
    db_race = models.Race(name=race.name, date=race.date, venue=race.venue)
    db.add(db_race)
    db.commit()
    db.refresh(db_race)
    return db_race

def create_event_class(db: Session, eventclass: schemas.EventClassCreate):
    db_eventclass = models.EventClass(
        event_id = eventclass.event_id,
        name= eventclass.name, 
        event_scoring = eventclass.event_scoring
        )
    db.add(db_eventclass)
    db.commit()
    db.refresh(db_eventclass)
    return db_eventclass

def create_race_class(db: Session, raceclass: schemas.RaceClassCreate):
    db_raceclass = models.RaceClass(
        race_id = raceclass.race_id,
        name= raceclass.name, 
        )
    db.add(db_raceclass)
    db.commit()
    db.refresh(db_raceclass)
    return db_raceclass

def assign_raceclass_to_eventclass(
        db: Session, 
        raceclass_id: int,
        eventclass_id: int,
        race_scoring: str
    ):
    db_EventClassRaceClass = models.EventClassRaceClass(
        eventclass_id = eventclass_id,
        raceclass_id = raceclass_id,
        race_scoring = race_scoring
    )
    db.add(db_EventClassRaceClass)
    db.commit()
    return

def get_event_classes(
        db: Session,
        eventid: int):
    items = db.query(models.EventClass,
        models.EventClassRaceClass).\
        join(models.EventClassRaceClass).\
        filter(models.EventClass.event_id==eventid).\
        all()
    return(items)
    
def create_race_entry(db: Session, entry: schemas.RaceEntryCreate):
    db_raceentry = models.RaceEntry(
        person = entry.person,
        bib = entry.bib,
        epunch = entry.epunch,
        raceclass_id = entry.raceclass_id,
        competitive = entry.competitive
    )
    db.add(db_raceentry)
    db.commit()
    db.refresh(db_raceentry)
    return db_raceentry

def create_race_result(db: Session, result: schemas.RaceResultCreate):
    db_raceresult = models.RaceResult(
        raceentry_id = result.entry_id,
        start_time = result.start_time,
        end_time = result.end_time,
        course_completed = result.course_completed,
        finish_status = result.finish_status
    )
    db.add(db_raceresult)
    db.commit()
    db.refresh(db_raceresult)
    return db_raceresult

def get_raceclass_results(db: Session, raceclass_id: int):
    return db.query(models.RaceResult).\
        join(models.RaceEntry).\
        filter(models.RaceEntry.raceclass_id==raceclass_id).\
        all()