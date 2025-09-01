import random
import time
from fetch_data import fetch_coinmarketcap_data
from export_data import send_message_to_kafka

#TODO: remove condition to break infinite loop and think about a better way to stop the script
def main():
    i=0
    while True:  # /!\ 
        waitNumber = random.randint(1, 5)
        print(waitNumber)
        time.sleep(waitNumber)
        result = "Message TEST"
        # result = fetch_coinmarketcap_data()
        # print(result)

        send_message_to_kafka('data_scraper', result,'kafka-1:19092')


        if i < 3:
            i += 1
        else:
            break

if __name__ == "__main__":
    main()
    



