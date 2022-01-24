# Establish a database
# Create a `Base` class that db models inherit from.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import urllib

try:
    params = urllib.parse.quote_plus(os.environ['AZURESQL_CONNECTIONSTRING'])
    SQLALCHEMY_DATABASE_URL = "mssql+pyodbc:///?odbc_connect=%s" % params
except:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()