# Define database tables and relationships

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DECIMAL, Date, DateTime

from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, unique=True, index=True)
    name = Column(String)

    def without_key(self):
        self.api_key = ""
        return self

class EventClass(Base):
    __tablename__ = "eventclasses"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey(Event.id), index=True)
    name = Column(String)
    event_scoring = Column(String)

class Race(Base):
    __tablename__ = "races"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date = Column(Date)
    venue = Column(String)

class RaceClass(Base):
    __tablename__ = "raceclasses"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey(Race.id), index=True)
    name = Column(String)

class RaceCourse(Base):
    __tablename__ = "racecources"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey(Race.id), index=True)
    name = Column(String)
    controls = Column(Integer)
    distance = Column(DECIMAL)
    climb = Column(DECIMAL)

class RaceResult(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey(Race.id), index=True)
    course_id = Column(Integer, ForeignKey(RaceCourse.id), index=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    course_completed = Column(String)
    finish_status = Column(String)

class EventClassRaceClass(Base):
    __tablename__ = "eventclass_raceclass_link"

    eventclass_id = Column(Integer, ForeignKey(EventClass.id), primary_key=True, index=True)
    raceclass_id = Column(Integer, ForeignKey(RaceClass.id), primary_key=True, index=True)
    race_scoring = Column(String)



    
