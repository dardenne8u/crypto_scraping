from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from tabulate import tabulate
import time

def fetch_coinmarketcap_data():

    # Set up Chrome options for the web driver
    options = Options()
    options.headless = False  # Run browser in visible mode (set to True for headless mode)
    options.add_argument("--window-size=1920,1200")  # Set browser window size

    # Initialize Chrome driver with specified options
    driver = webdriver.Chrome(options=options)

    # Open the CoinMarketCap website
    driver.get("https://coinmarketcap.com/fr/") 

    # Scroll down the page 17 times to load more content
    for i in range(30):  
        driver.execute_script("window.scrollBy(0, 300);") 
        time.sleep(0.5)  

    # Wait for the page to load
    time.sleep(1)

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
        cleaned_text = text.replace("\xa0", "")
        header_data.append(cleaned_text)


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

    # Format and return the data as a table using tabulate
    return tabulate(table_row, headers=header_data, tablefmt="grid")
