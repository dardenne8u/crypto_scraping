from kafka import KafkaProducer, KafkaAdminClient
from kafka.admin import NewTopic
import time


def ensure_topic_exists(admin_client, topic_name):
    topics = admin_client.list_topics()
    if topic_name in topics:
        print(f"Topic '{topic_name}' exists.")
    else:
        print(f"Topic '{topic_name}' does not exist. Creating it...")
        topic = NewTopic(name=topic_name, num_partitions=1, replication_factor=3)
        admin_client.create_topics([topic])
        print(f"Topic '{topic_name}' created successfully.")


def send_message_to_kafka(topic_name, message, bootstrap_servers):
    producer = None
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)
        ensure_topic_exists(admin_client, topic_name)

        producer = KafkaProducer(bootstrap_servers=bootstrap_servers, api_version=(2, 8, 0))
        producer.send(topic_name, message.encode('utf-8'))
        print(f"Sent: {message}")

        producer.flush()
        time.sleep(2)

    except Exception as e:
        print(f"Error sending message to Kafka: {e}")

    finally:
        if producer:
            producer.close()


if __name__ == "__main__":
    send_message_to_kafka('data_scraper', 'Votre message ici', 'kafka-1:19092')
