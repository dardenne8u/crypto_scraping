from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import os

def fetch_coinmarketcap_data():

    scraping_url = os.getenv('ScrapingURL', 'https://coinmarketcap.com/')
    maxScrolls = int(os.getenv('MaxScrolls', 30))
    scrollPauseTime = int(os.getenv('ScrollPauseTime', 0.5))
    scrollLocationMin = int(os.getenv('ScrollLocationMin', 0))
    scrollLocationMax = int(os.getenv('ScrollLocationMax', 300))
    loadingTime = int(os.getenv('LoadingTime', 1))

    # Set up Chrome options for the web driver
    options = Options()
    options.headless = False  # Run browser in visible mode (set to True for headless mode)
    options.add_argument("--window-size=1920,1200")  # Set browser window size

    # Initialize Chrome driver with specified options
    driver = webdriver.Chrome(options=options)

    # Open the CoinMarketCap website
    driver.get(scraping_url) 

    # Scroll down the page 30 times to load more content
    for i in range(maxScrolls):  
        driver.execute_script(f"window.scrollBy({scrollLocationMin}, {scrollLocationMax});") 
        time.sleep(scrollPauseTime)  

    # Wait for the page to load
    time.sleep(loadingTime)

    # Get the page's HTML content
    html = driver.page_source

    # Close the browser window
    driver.quit()

    # Parse the page's HTML using BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')


    #------- Extract Header Data -------#
    # Find all <th> elements in the <thead>
    th_elements = soup.find_all('th')

    header_data = []
    # Loop through each <th> element and extract its text
    for th in th_elements:
        text = th.get_text(strip=True)
        header_data.append(text)


    #------- Extract Table Data -------#
    # Find all <tr> elements, which represent rows in the table
    tr_elements = soup.find_all('tr')

    table_row = []
    # Loop through each row (<tr>)
    for tr in tr_elements:
        td_elements = tr.find_all('td')
        table_data = []
        
        # Loop through each <td> in the row
        for td in td_elements:
            text = td.get_text(strip=True)
            cleaned_text = text.replace("\xa0", "").replace("\u202f", "")
            table_data.append(cleaned_text)
        
        # Only append rows with valid data (non-empty cells)
        if table_data:
            table_row.append(table_data)

    return [header_data, table_row]


