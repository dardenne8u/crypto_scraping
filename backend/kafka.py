from kafka import KafkaConsumer, KafkaProducer, KafkaAdminClient
import os
import json

servers = os.getenv("SERVERS")
if servers == None:
    raise Exception("Environment variable SERVERS is empty")
servers = json.loads(servers)

def ensure_topic_exists(admin_client, topic_name):
    topics = admin_client.list_topics()
    if topic_name in topics:
        print(f"Topic '{topic_name}' exists.")
    else:
        print(f"Topic '{topic_name}' does not exist")


def get_consumer():
    # producer = KafkaProducer(bootstrap_servers=servers)
    admin = KafkaAdminClient(bootstrap_servers=servers)
    ensure_topic_exists(admin, "clean_data")
    consumer = KafkaConsumer('clean_data', bootstrap_servers=servers)
    return consumer 
