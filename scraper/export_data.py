from kafka import KafkaProducer, KafkaAdminClient
from kafka.admin import NewTopic
import time

def send_message_to_kafka(topic_name, message, bootstrap_servers):
    producer = None
    try:
        admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)
        topics = admin_client.list_topics()
        
        # Vérifier si le topic existe, sinon le créer
        if topic_name in topics:
            print(f"Topic '{topic_name}' exists.")
        else:
            print(f"Topic '{topic_name}' does not exist.")
            topic = NewTopic(name=topic_name, num_partitions=1, replication_factor=1)
            admin_client.create_topics([topic])
            print(f"Topic '{topic_name}' created successfully.")
        
        # Initialiser KafkaProducer avec version API explicite
        producer = KafkaProducer(bootstrap_servers=bootstrap_servers, api_version=(2, 8, 0))
        
        # Envoyer le message
        producer.send(topic_name, message.encode('utf-8'))
        print(f"Sent: {message}")
        
        # Assurer l'envoi avant la fermeture
        producer.flush()
        time.sleep(2)

    except Exception as e:
        print(f"Error: {e}")

    finally:
        if producer is not None:
            producer.close()

if __name__ == "__main__":
    send_message_to_kafka('data_scraper', 'Votre message ici', 'kafka-1:19092')
