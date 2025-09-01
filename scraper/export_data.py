from kafka import KafkaProducer, KafkaAdminClient
from kafka.errors import TopicAlreadyExistsError
import time

def send_message_to_kafka(topic_name, message, bootstrap_servers):
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)
        topics = admin_client.list_topics()
        # Check if the topic exists
        if topic_name in topics:
            print(f"Topic '{topic_name}' exists.")
        else:
            print(f"Topic '{topic_name}' does not exist.")
            #Create topic if it does not exist
            # raise Exception(f"Topic '{topic_name}' does not exist. Please create it manually.")

        # Initialize KafkaProducer
        producer = KafkaProducer(bootstrap_servers=bootstrap_servers)
        
        # Send message to the specified topic
        producer.send(topic_name, message.encode('utf-8'))
        print(f"Sent: {message}")
        
        # Wait to ensure the message is sent before closing
        time.sleep(2)
        
        # Ensure the producer sends all messages
        producer.flush()

    except Exception as e:
        print(f"Error: {e}")

    finally:
        # Close the producer connection
        producer.close()















