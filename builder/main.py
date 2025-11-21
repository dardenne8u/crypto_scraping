import unicodedata
from kafka import KafkaConsumer, KafkaProducer, KafkaAdminClient
from kafka.admin import NewTopic
from Cleaner import CoinMarketCapConsumer
import os
import json
import pandas as pd

# Load json variables servers
servers = os.getenv("SERVERS")
if servers == None:
    raise Exception("Environment variable SERVERS is empty")
servers = json.loads(servers)


CLEANERS = {
    "CoinMarketCap": CoinMarketCapConsumer
}

def ensure_topic_exists(admin_client, topic_name):
    topics = admin_client.list_topics()
    if topic_name in topics:
        print(f"Topic '{topic_name}' exists.")
    else:
        print(f"Topic '{topic_name}' does not exist. Creating it...")
        topic = NewTopic(name=topic_name, num_partitions=1, replication_factor=3)
        admin_client.create_topics([topic])
        print(f"Topic '{topic_name}' created successfully.")
    

def convert(row):
    tmp = CoinMarketCapConsumer()
    tmp.set_from_array(row)
    return tmp

producer = KafkaProducer(bootstrap_servers=servers)
admin = KafkaAdminClient(bootstrap_servers=servers)
ensure_topic_exists(admin, "clean_data")
consumer = KafkaConsumer('data_scraper', bootstrap_servers=servers)
for message in consumer:
    cleaner = CoinMarketCapConsumer()
    datas = json.loads(message.value)
    df = cleaner.clean_datas(datas)
    datas = df.apply(convert, axis=1)
    for data in datas:
        val = data.dumps()
        if val is None:
            continue
        print(val)
        producer.send("clean_data", val)
