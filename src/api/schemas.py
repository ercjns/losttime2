# Define python classes used when passing data to/from the db

from typing import List, Optional
from pydantic import BaseModel

class EventBase(BaseModel):
    name: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True