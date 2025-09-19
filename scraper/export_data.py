from kafka import KafkaProducer, KafkaAdminClient
from kafka.admin import NewTopic
import time
import json


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
    exist = False
    try:
        for server in bootstrap_servers:
            if server is None:
                raise ValueError("One or more Kafka broker addresses are not set in environment variables.")
            else:
                print(f"Kafka broker '{server}' is available.")

                if not exist:
                    try:
                        admin_client = KafkaAdminClient(bootstrap_servers=server)
                        ensure_topic_exists(admin_client, topic_name)
                        exist = True
                    except Exception as e:
                        print(f"Failed to ensure topic exists on Kafka broker '{server}': {e}")

                try:
                    producer = KafkaProducer(bootstrap_servers=server, api_version=(2, 8, 0))
                    message_bytes = json.dumps(message).encode('utf-8')
                    future = producer.send(topic_name, message_bytes)
                    future.get(timeout=10)  # Block until a single message is sent (or timeout)

                except Exception as e:
                    print(f"Failed to send message to Kafka broker '{server}': {e}")
                    continue

                producer.flush()
                time.sleep(2)

                break

    except Exception as e:
        print(f"Error sending message to Kafka: {e}")

    finally:
        if producer:
            producer.close()
