import random
import time
import os
from fetch_data import fetch_coinmarketcap_data
from export_data import send_message_to_kafka

BrokerKafka = [os.getenv("KAFKA_BROKER_1"), os.getenv("KAFKA_BROKER_2"), os.getenv("KAFKA_BROKER_3")]

def main():
    # Load environment variables
    min_wait = int(os.environ['RandomWaitMin'])
    max_wait = int(os.environ['RandomWaitMax'])
    scraping_url = os.environ['ScrapingURL']
    maxScrolls = int(os.environ['MaxScrolls'])
    scrollPauseTime = int(os.environ['ScrollPauseTime'])
    scrollLocationMin = int(os.environ['ScrollLocationMin'])
    scrollLocationMax = int(os.environ['ScrollLocationMax'])
    loadingTime = int(os.environ['LoadingTime'])
    topic_name = os.environ['TopicName']
    bootstrap_servers = os.environ['BootstrapServers']
    
    while True:
        # Random wait for detection avoidance
        wait_seconds = random.randint(min_wait, max_wait)
        print(f"Waiting for {wait_seconds} seconds...")
        time.sleep(wait_seconds)

        # Fetch data from CoinMarketCap
        result = fetch_coinmarketcap_data(scraping_url, maxScrolls, scrollPauseTime, scrollLocationMin, scrollLocationMax, loadingTime)
        # Format the result for sending
                
        for row in result[1]:
            formatted_result = {
                "dataHeader": result[0],
                "dataBody": row
            }
            send_message_to_kafka(topic_name=topic_name, message=formatted_result, bootstrap_servers=bootstrap_servers)


if __name__ == "__main__":
    main()
