# Define python classes used when passing data to/from the db

from typing import Optional
from pydantic import BaseModel
from datetime import date, datetime

### EVENT ###

class EventBase(BaseModel):
    name: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True

### EVENTCLASS ###

class EventClassBase(BaseModel):
    event_id: int
    name: str
    event_scoring: str

class EventClassCreate(EventClassBase):
    pass

class EventClass(EventClassBase):
    id: int

    class Config:
        orm_mode = True

### RACE ###

class RaceBase(BaseModel):
    name: str
    date: date
    venue: str

class RaceCreate(RaceBase):
    pass

class Race(RaceBase):
    id: int

    class Config:
        orm_mode = True

### RACECLASS ###

class RaceClassBase(BaseModel):
    race_id: int
    name: str
    name_short: str

class RaceClassCreate(RaceClassBase):
    pass

class RaceClass(RaceClassBase):
    id:int
    
    class Config:
        orm_mode = True

### RACEENTRY ###

class RaceEntryBase(BaseModel):
    person: str
    club: Optional[str]
    bib: Optional[str]
    epunch: Optional[str]
    raceclass_id: int
    competitive: bool

class RaceEntryCreate(RaceEntryBase):
    pass

class RaceEntry(RaceEntryBase):
    id: int

    class Config:
        orm_mode = True


### RACERESULT ###

class RaceResultBase(BaseModel):
    entry_id: int
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    course_completed: str
    finish_status: str

class RaceResultCreate(RaceResultBase):
    pass

class RaceResult(RaceResultBase):
    id: int

    class Config:
        orm_mode = True