from kafka_utils import get_consumer
from db import get_session, create_db, Crypto
from sqlmodel import select
import json

create_db()


def handle_record(record_value):
    record_value = json.loads(record_value.decode("utf-8"))
    
    payload = record_value["payload"]
    crypto = Crypto(**payload)

    with get_session() as session:
        session.add(crypto)
        session.commit()

def main():
    consumer = get_consumer()
    print("Kafka consumer started...")

    for msg in consumer:
        try:
            handle_record(msg.value)
        except Exception as e:
            print("Erreur insert:", e)


if __name__ == "__main__":
    main()
