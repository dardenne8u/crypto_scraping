# Connecteur — lightweight Kafka ↔ Postgres bridge

This folder provides a small Python service that acts as a replacement/alternative to Kafka Connect when connector deployment fails.
It reads/writes messages between Kafka and a database (Postgres) using project-specific logic implemented in the modules below.

Why this exists

- Used because of issues with the official Kafka Connect setup in this repo.
- Provides a simpler, controllable bridge that can be run locally or in Docker.

What’s in this folder

- Dockerfile — image for running the service in a container.
- requirements.txt — Python dependencies.
- main.py — service entrypoint / worker loop.
- kafka_utils.py — helper code for Kafka produce/consume.
- db.py — database access helpers (Postgres).
- __init__.py — package marker.

Expected environment variables

- KAFKA_BOOTSTRAP_SERVERS — Kafka bootstrap list (e.g. "localhost:9092").
- KAFKA_TOPIC — Kafka topic to consume/produce.
- POSTGRES_DSN or a set: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD — DB connection.
- LOG_LEVEL — optional, e.g. INFO, DEBUG.

(Inspect main.py, kafka_utils.py and db.py to confirm and adjust variable names if different.)

Run locally (development)

1. Create a Python venv and install deps:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Export required env vars:
   ```bash
   export KAFKA_BOOTSTRAP_SERVERS=localhost:9092
   export KAFKA_TOPIC=data_scraper
   export POSTGRES_DSN="postgresql://user:pass@postgres:5432/dbname"
   ```
3. Start the service:
   ```bash
   python3 main.py
   ```

Run with Docker

```bash
docker-compose -f compose.dev.yml up --build -d connecteur
```

Basic checks

- Check logs (local): see stdout from `python3 main.py`.
- Check container logs:
  ```bash
  docker logs <container-id>
  ```
- Verify data landed in Postgres by querying the target table.

Notes and next steps

- This service is intentionally minimal; extend/inspect kafka_utils.py and db.py to adapt serialization, table schema, batching, retries, or error handling.
- For production, add proper logging, metrics (Prometheus), retry/backoff logic and run under supervisor or as a managed container.
- If you change env var names inside the code, update this README and your compose files.
