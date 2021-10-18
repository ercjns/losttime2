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