# Backend — API / Kafka bridge / socket gateway

Small backend service that connects Kafka, Postgres and the frontend (via sockets). It consumes/produces Kafka messages, exposes DB helpers and provides a socket manager for pushing realtime updates to clients.

Files

- `main.py` — service entrypoint / worker orchestration.
- `kafka_utils.py` — helpers to produce/consume Kafka messages.
- `db.py` — Postgres connection and DB helpers.
- `socket_manager.py` — WebSocket / socket gateway used by the frontend.
- `requirements.txt` — Python dependencies.
- `Dockerfile` — container image definition.

Purpose

- Consume messages from Kafka topics produced by the scraper/builder.
- Optionally persist or query data in Postgres.
- Push realtime updates to connected frontend clients via sockets.

Environment variables (common; confirm exact names in source)

- KAFKA_BOOTSTRAP_SERVERS — bootstrap list, e.g. "kafka:9092"
- KAFKA_TOPIC — topic to consume/produce
- POSTGRES_DSN or POSTGRES_HOST/POSTGRES_DB/POSTGRES_USER/POSTGRES_PASSWORD — DB connection
- SOCKET_HOST — host to bind sockets (default 0.0.0.0)
- SOCKET_PORT — port for sockets (e.g. 8000)
- LOG_LEVEL — optional (INFO/DEBUG)

Run locally

1. Create venv and install deps:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Export required env vars and run:

```bash
export KAFKA_BOOTSTRAP_SERVERS=localhost:9092
export POSTGRES_DSN="postgresql://user:pass@localhost:5432/db"
python3 main.py
```

Run with Docker
Build:

```bash
docker build -t crypto-backend:local .
```

Run:

```bash
docker run --rm -p 8000:8000 \
  -e KAFKA_BOOTSTRAP_SERVERS="kafka:9092" \
  -e POSTGRES_DSN="postgresql://user:pass@postgres:5432/db" \
  crypto-backend:local
```

Or start with the repository root compose file:

```bash
docker-compose -f compose.dev.yml up --build -d backend
```

Testing sockets

- Use `wscat` or a browser client to connect to the socket host/port defined by `SOCKET_HOST`/`SOCKET_PORT`.
- Check logs for consumer/producer activity.

Notes

- Inspect `main.py`, `kafka_utils.py` and `db.py` to confirm exact env var names, topics and table names before running.
- For production, add metrics (Prometheus), retries/backoff, proper schema migration and secure connections for Kafka/Postgres and sockets.

License

- MIT (update as needed).

```//

```
