from sqlmodel import SQLModel, create_engine, Session, Field
from typing import Annotated
import os

_username = os.getenv("DB_USER")
_password = os.getenv("DB_PWD")
_url = os.getenv("DB_URL")
_db = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+psycopg2://{_username}:{_password}@{_url}/{_db}"
engine = create_engine(
    DATABASE_URL,
    echo=True,  # pour voir les requêtes SQL dans la console
    future=True
)
def create_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)

class Crypto(SQLModel, table=True):
    __tablename__ = "clean_data"
    name: str = Field(primary_key=True)
    price: float
    hourly_variance: float
    daily_variance: float
    weekly_variance: float
    date: int = Field(primary_key=True)
