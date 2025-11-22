
# Prometheus — Overview and quick start

This folder contains a Prometheus configuration (`prometheus.yml`) used to collect metrics from several exporters. This README explains what Prometheus is, what the provided configuration does, and how to run Prometheus locally.

## What is Prometheus?

Prometheus is an open-source monitoring and alerting system designed for time-series data. Key points:

- Pull-based metrics collection over HTTP (scraping exporters or instrumented apps).
- Built-in time-series database.
- Powerful query language: PromQL.
- Integrates with Grafana for dashboards.
- Works with Alertmanager for alerting.

## Configuration summary (`prometheus.yml`)

- `global.scrape_interval: 15s` — Prometheus scrapes targets every 15 seconds by default.
- Jobs configured in this file:
  - `prometheus` — self-scrape at `prometheus:9090`.
  - `node-exporter` — system metrics at `node-exporter:9100`.
  - `kafka` — Kafka exporter at `kafka-exporter:9308`.
  - `postgres` — PostgreSQL exporter at `postgres-exporter:9187`.

Note: hostnames like `prometheus`, `node-exporter`, etc. typically map to Docker Compose service names or Kubernetes service DNS. Ensure Prometheus can resolve and reach those addresses.

## Run Prometheus quickly (Docker)

From this folder (where `prometheus.yml` is located):

Simple Docker run:

```bash
docker run --rm -p 9090:9090 \
  -v "$(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml:ro" \
  -v "$(pwd)/data:/prometheus" \
  prom/prometheus
```

Minimal docker-compose example:

```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./data:/prometheus
    restart: unless-stopped
```

Open the Prometheus UI: http://localhost:9090

## Useful PromQL examples

- List all up targets:
  up
- Check specific job:
  up{job="node-exporter"}
- CPU usage rate (example; depends on exporter metric names):
  rate(node_cpu_seconds_total[5m])
- Available memory (metric name may vary):
  node_memory_MemAvailable_bytes

Adjust queries to the actual metric names exposed by your exporters.

## Notes and best practices

- Ensure targets are reachable from the Prometheus container (same network / DNS).
- For production: configure retention, persistent storage, and Alertmanager.
- Use Grafana for visualization (add Prometheus as a data source).
- Exporters must expose metrics on the configured ports and paths (usually `/metrics`).

## Resources

- Official docs: https://prometheus.io/docs/
- PromQL basics: https://prometheus.io/docs/prometheus/latest/querying/basics/
