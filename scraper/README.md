# CoinMarketCap Data Scraper with Kafka Integration

## 1. Project Description

This project is a web scraper designed to collect cryptocurrency market data from [CoinMarketCap](https://coinmarketcap.com/) in real time. The scraper extracts both the table headers and all data rows, formats them, and sends them to a Kafka topic for downstream processing or storage.

Key functionalities include:

* **Dynamic page scraping** : Scrolls through the page multiple times to load all content.
* **Randomized waiting** : Introduces random delays between scrapes to reduce the chance of detection.
* **Data formatting** : Structures scraped data into headers and rows for easier consumption.
* **Kafka messaging** : Sends the data reliably to a Kafka topic and ensures the topic exists before sending.

---

## 2. Technology Stack

The project leverages the following technologies:

| Technology                       | Purpose                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| **Python**                 | Main programming language for scraping, processing, and sending data.                         |
| **Selenium WebDriver**     | Automates browser interactions to dynamically load content from CoinMarketCap.                |
| **BeautifulSoup**          | Parses HTML content to extract table headers and rows efficiently.                            |
| **Apache Kafka**           | Serves as a message broker to transmit scraped data to other systems in real time.            |
| **Chrome (headless mode)** | Runs browser automation without opening a visible window, making scraping faster and lighter. |
| **Kafka-Python**           | Python client to produce messages to Kafka topics and manage topic creation.                  |

---

## 3. Why These Technologies Were Chosen

* **Python** : Offers simplicity, readability, and a rich ecosystem of libraries for web scraping and data processing.
* **Selenium** : Allows interaction with dynamic websites that rely on JavaScript, which standard HTTP requests cannot handle.
* **BeautifulSoup** : Efficiently parses HTML content and extracts structured data, making it ideal for table scraping.
* **Kafka** : Provides high-throughput, fault-tolerant messaging for streaming data pipelines, ensuring real-time data availability for downstream applications.
* **Headless Chrome** : Reduces system resource usage while still supporting full browser functionality, making scraping faster and suitable for server environments.

These technologies together create a robust, reliable, and scalable pipeline for continuously scraping and delivering cryptocurrency data.

---


## 4. Environment Variables

| Variable              | Default                        | Description                                        |
| --------------------- | ------------------------------ | -------------------------------------------------- |
| `KAFKA_BROKER_1`    | `localhost:9092`             | First Kafka broker address                         |
| `KAFKA_BROKER_2`    | `localhost:9093`             | Second Kafka broker address                        |
| `KAFKA_BROKER_3`    | `localhost:9094`             | Third Kafka broker address                         |
| `RandomWaitMin`     | `5`                          | Minimum random wait time between scrapes (seconds) |
| `RandomWaitMax`     | `10`                         | Maximum random wait time between scrapes (seconds) |
| `TopicName`         | `data_scraper`               | Kafka topic to send messages                       |
| `ScrapingURL`       | `https://coinmarketcap.com/` | URL to scrape                                      |
| `MaxScrolls`        | `30`                         | Number of scrolls to perform to load more content  |
| `ScrollPauseTime`   | `0.5`                        | Pause time between scrolls (seconds)               |
| `ScrollLocationMin` | `0`                          | Minimum scroll offset                              |
| `ScrollLocationMax` | `300`                        | Maximum scroll offset                              |
| `LoadingTime`       | `1`                          | Time to wait after scrolling (seconds)             |

---