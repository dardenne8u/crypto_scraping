
# Kafka Connect — Short overview and usage

Kafka Connect moves data between Kafka and external systems (databases, files, object stores...) using connectors. Connectors can be source (push data into Kafka) or sink (consume from Kafka). Kafka Connect exposes a REST API to manage connectors.

Files in this folder:

- Dockerfile — image definition for the Connect worker.
- entrypoint.sh — container entry script.
- connectorPostgres.json, postgres.json — example connector configurations to register via the Connect REST API.

Start the Kafka Connect service (run from the repository root):

```bash
docker-compose -f compose.dev.yml up --build -d kafka-connect
```

Notes:

- Edit the JSON files to match your Kafka and Postgres hosts/credentials.
- Ensure Kafka (and Zookeeper if used) are reachable on the compose network.
- Use the Connect REST API (port 8083) to list/manage connectors.
