import random
import time
from scraper import fetch_coinmarketcap_data

def main():
    # while True:  # /!\ 
        waitNumber = random.randint(1, 25)
        print(waitNumber)
        time.sleep(waitNumber)
        result = fetch_coinmarketcap_data()
        print(result)

if __name__ == "__main__":
    main()