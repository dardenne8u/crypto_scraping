from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql+psycopg2://tech:tech@localhost:9000/kafka"
engine = create_engine(
    DATABASE_URL,
    echo=True,  # pour voir les requêtes SQL dans la console
    future=True
)
def create_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

class crypto(SQLModel, Table=True):
    name: str
    price: float
    hourly_variance: float
    daily_variance: float
    weekly_variance: float
    date: int