import random
import time
import os
from fetch_data import fetch_coinmarketcap_data
from export_data import send_message_to_kafka

BrokerKafka = [os.getenv("KAFKA_BROKER_1", "localhost:9092"), os.getenv("KAFKA_BROKER_2", "localhost:9093"), os.getenv("KAFKA_BROKER_3", "localhost:9094")]

def main():
    # Load environment variables with default values
    min_wait = int(os.getenv('RandomWaitMin', 5))
    max_wait = int(os.getenv('RandomWaitMax', 10)) 
    topic_name = os.getenv('TopicName', 'data_scraper')


    if min_wait is None or max_wait is None:
        raise ValueError("Environment variables 'RandomWaitMin' and 'RandomWaitMax' must be set.")

    min_wait = int(min_wait)
    max_wait = int(max_wait)

    while True:
        # Random wait for detection avoidance
        wait_seconds = random.randint(min_wait, max_wait)
        print(f"Waiting for {wait_seconds} seconds...")
        time.sleep(wait_seconds)

        # Fetch data from CoinMarketCap
        result = fetch_coinmarketcap_data()
        # Format the result for sending
                
        formatted_result = {
            "dataHeader": result[0],
            "dataBody": result[1]
        }
        print(f"Fetched data: {formatted_result}")
        send_message_to_kafka(topic_name=topic_name, message=formatted_result, bootstrap_servers=BrokerKafka)



if __name__ == "__main__":
    main()
