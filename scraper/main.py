import random
import time
import os
from fetch_data import fetch_coinmarketcap_data
from export_data import send_message_to_kafka

BrokerKafka = [os.getenv("KAFKA_BROKER_1"), os.getenv("KAFKA_BROKER_2"), os.getenv("KAFKA_BROKER_3")]

def main():
    max_iterations = 3
    for _ in range(max_iterations):
        wait_seconds = random.randint(1, 5)
        print(f"Waiting for {wait_seconds} seconds...")
        time.sleep(wait_seconds)

        # Pour récupérer les données depuis CoinMarketCap 
        # result = fetch_coinmarketcap_data()
        
        # Message de test
        result = "Message TEST"
        print(f"Sending message: {result}")

        send_message_to_kafka(topic_name='data_scraper', message=result, bootstrap_servers=BrokerKafka)

    print("Script ended after fixed iterations. Consider implementing a graceful shutdown.")


if __name__ == "__main__":
    main()
