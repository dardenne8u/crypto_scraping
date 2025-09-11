from kafka import KafkaConsumer


consumer = KafkaConsumer('data_scraper', bootstrap_servers=['kafka-1:19092'])
print("me")
for message in consumer:
    print(message)


