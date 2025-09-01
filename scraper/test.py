from kafka import KafkaConsumer

consumer = KafkaConsumer('data_scraper', bootstrap_server=['kafka-1:19092'])

for message in consumer:
    print(message)