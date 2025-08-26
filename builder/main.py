from kafka import KafkaConsumer

consumer = KafkaConsumer('', 
                         bootstrap_server=['localhost:9092']
)

for message in consumer:
    print(message)
