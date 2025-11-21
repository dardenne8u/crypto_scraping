from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import os
import tempfile
import shutil # Importation nécessaire pour supprimer le répertoire temporaire

def fetch_coinmarketcap_data():
    """
    Récupère les données du tableau de CoinMarketCap en utilisant Selenium pour
    gérer le chargement dynamique du contenu.
    """

    # --- Configuration des variables d'environnement ---
    scraping_url = os.getenv('ScrapingURL', 'https://coinmarketcap.com/')
    maxScrolls = int(os.getenv('MaxScrolls', 30))
    scrollPauseTime = float(os.getenv('ScrollPauseTime', 0.5))
    scrollLocationMin = int(os.getenv('ScrollLocationMin', 0))
    scrollLocationMax = int(os.getenv('ScrollLocationMax', 300))
    loadingTime = int(os.getenv('LoadingTime', 1))

    # --- Initialisation des ressources ---
    user_data_dir = tempfile.mkdtemp()
    driver = None
    html = ""
    
    try:
        # Set up Chrome options for the web driver
        options = Options()
        # Exécuter en mode headless (sans interface graphique)
        options.add_argument("--headless")  
        # Utiliser le répertoire temporaire pour le profil utilisateur (cache, etc.)
        options.add_argument(f"--user-data-dir={user_data_dir}")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--lang=es")

        # Initialize Chrome driver with specified options
        driver = webdriver.Chrome(options=options)

        # Open the CoinMarketCap website
        driver.get(scraping_url) 

        # Scroll down the page 'maxScrolls' times to load more content
        for i in range(maxScrolls):  
            driver.execute_script(f"window.scrollBy({scrollLocationMin}, {scrollLocationMax});") 
            time.sleep(scrollPauseTime)  

        # Wait for the page to finish loading after scrolling
        time.sleep(loadingTime)

        # Get the page's HTML content
        html = driver.page_source

    except Exception as e:
        print(f"Une erreur est survenue pendant le scraping : {e}")
        # Renvoyer des données vides en cas d'échec
        return [[], []] 

    finally:
        # --- NETTOYAGE OBLIGATOIRE ---
        # Cette section s'exécute toujours, même en cas d'exception.
        
        # 1. Fermer le navigateur
        if driver:
            driver.quit()
        
        # 2. Supprimer le répertoire temporaire pour éviter l'augmentation de la taille du Docker
        try:
            shutil.rmtree(user_data_dir)
            print(f"Répertoire temporaire supprimé : {user_data_dir}")
        except Exception as e:
            # Afficher un avertissement si le nettoyage échoue, mais ne pas bloquer le script
            print(f"Attention : Échec de la suppression du répertoire temporaire {user_data_dir}: {e}")


    # --- Parsing et Extraction des Données ---
    
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
            table_data.append(text)
        
        # Only append rows with valid data (non-empty cells)
        if table_data:
            table_row.append(table_data)

    return [header_data, table_row]

