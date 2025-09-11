import unicodedata
from kafka import KafkaConsumer
from Cleaner import CoinMarketCapConsumer
import os
import json

# Load json variables servers
servers = os.getenv("SERVERS")
if servers == None:
    raise Exception("Environment variable SERVERS is empty")
servers = json.loads(servers)


CLEANERS = {
    "CoinMarketCap": CoinMarketCapConsumer
}
    
with open("./builder/data.json") as file:
    content = file.read()
    datas = json.loads(content)
    print(datas[0])
    for data in datas[1]:
        print(data)


# consumer = KafkaConsumer('data_scraper', bootstrap_servers=servers)
# for message in consumer:
#     print(message)


