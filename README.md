
# Crypto Viz — Detailed README

Crypto Viz is a small data pipeline and dashboard for cryptocurrency market data. It collects market data, streams it through Kafka, optionally transforms and persists it, and visualizes results in a Next.js frontend. The entire stack is intended to run via Docker Compose for easy development.

Quick start (recommended)

- From repository root:

```bash
docker-compose -f compose.dev.yml up --build -d
```

- Stop and remove:

```bash
docker-compose -f compose.dev.yml down
```

Project purpose

- Collect price and market metrics (example: CoinMarketCap).
- Decouple producers and consumers with Kafka.
- Clean/transform messages and store results in Postgres.
- Provide a realtime frontend and basic monitoring.

High-level architecture

1. scraper/ — periodic fetcher that publishes raw JSON messages to Kafka.
2. Kafka (broker) — message bus and buffer.
3. Ingestion:
   - Preferred: Kafka Connect (kafkaConnect/) to sink messages to Postgres.
   - Fallback: connecteur/ — small Python bridge Kafka ↔ Postgres when Kafka Connect fails.
4. builder/ — cleaner/enricher that normalizes CoinMarketCap payloads.
5. backend/ — consumes processed data, persists if needed, and exposes realtime updates to frontend via sockets.
6. frontend/ — Next.js dashboard showing charts, tables and live updates.
7. prometheus/ — monitoring configuration to scrape service exporters.

Why the custom "connecteur"

- Kafka Connect is standard but can fail due to plugin/classpath/network issues.
- connecteur/ is a lightweight, controllable Python alternative used when official connectors are not viable.

Repository layout (important folders)

- frontend/ — Next.js TypeScript UI.
- scraper/ — Python scraper.
- kafkaConnect/ — Dockerfile and connector JSONs for official Kafka Connect.
- connecteur/ — Python fallback bridge.
- builder/ — cleaning and ingestion worker.
- backend/ — Kafka <> DB <> socket gateway.
- prometheus/ — Prometheus config.
- compose.dev.yml — development docker-compose stack (root).

What to edit for your environment

- Connector JSONs (kafkaConnect/) — set Kafka and Postgres hosts, credentials and topic names.
- Environment variables in compose.dev.yml or service Docker environment blocks.
- Frontend uses NEXT_PUBLIC_* env vars for values exposed to the browser.

Minimal env variables (examples)

- KAFKA_BOOTSTRAP_SERVERS — "kafka:9092"
- KAFKA_TOPIC / TopicName — topic used for scraper messages
- POSTGRES_DSN or POSTGRES_HOST/POSTGRES_DB/POSTGRES_USER/POSTGRES_PASSWORD
- RandomWaitMin / RandomWaitMax — scraper random wait range
- NEXT_PUBLIC_API_URL — frontend API/socket endpoint (if needed)

Notes and tips

- All service hostnames in configs assume the docker-compose network (service names). Adjust when running services externally.
- The scraper runs an infinite loop; stop with Ctrl+C when running locally.
- Use docker-compose logs -f `<service>` to inspect service output.
- If Kafka Connect fails to register connectors, try the connecteur fallback or inspect connector classpath/plugins.
- For visualization, connect Grafana to Prometheus if deeper dashboards are needed.
