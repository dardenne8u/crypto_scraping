from kafka import KafkaConsumer


try:
    consumer = KafkaConsumer('data_scaper', bootstrap_server=['localhost:9092'])
    for message in consumer:
        print(message)
except:
    print("erreur connect")

