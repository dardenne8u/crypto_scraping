import random
import time
from fetch_data import fetch_coinmarketcap_data

#TODO: remove condition to break infinite loop and think about a better way to stop the script
def main():
    i=0
    while True:  # /!\ 
        waitNumber = random.randint(1, 5)
        print(waitNumber)
        time.sleep(waitNumber)
        # result = fetch_coinmarketcap_data()
        # print(result)

        if i < 3:
            i += 1
        else:
            break

if __name__ == "__main__":
    main()
    



