from kafka import KafkaProducer
import time

producer = KafkaProducer(bootstrap_servers='kafka-1:19092')

message = f"Message TEST 2"
#for producer send it must to be created
#Variable environment for docker
producer.send('data_scraper', message.encode('utf-8'))
print(f"Sent: {message}")
time.sleep(2)

producer.flush()
producer.close()