# Define python classes used when passing data to/from the db

from typing import Optional
from pydantic import BaseModel
from datetime import date

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

class RaceClassCreate(RaceClassBase):
    pass

class RaceClass(RaceClassBase):
    id:int
    
    class Config:
        orm_mode = True
