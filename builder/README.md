# Builder — data cleaning & ingestion worker

Small Python service that consumes raw crypto data, cleans/transforms it and forwards or persists the results. This project is used when the Kafka Connect approach is not suitable or fails.

What’s here

- Dockerfile, requirements.txt — container and deps.
- main.py — service entrypoint / consumer loop.
- Cleaner/ — cleaning modules:
  - coinmarketcap.py — cleaning/parsing logic for CoinMarketCap data.
  - consumer.py — Kafka consumer helper or consumer-side logic.

Purpose

- Read messages (typically from Kafka), apply domain-specific cleaning/normalization, then either publish cleaned messages back to Kafka, store to a database, or write files — depending on project wiring.

Quick start — local (dev)

1. Create virtualenv and install:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Export required environment variables (check main.py for exact names). Common vars used in similar services:

- KAFKA_BOOTSTRAP_SERVERS — Kafka bootstrap list (e.g. "localhost:9092")
- KAFKA_TOPIC / TOPIC_NAME — topic to consume
- OUTPUT_DSN / POSTGRES_DSN — DB connection if persisting
- CMC_API_KEY — if an API key is required by cleaners

3. Run:

```bash
python3 main.py
```

Run with Docker

```bash
docker-compose -f compose.dev.yml up --build -d
```
