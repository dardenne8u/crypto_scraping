#!/bin/bash
set -e

# Lancer Kafka Connect en arrière-plan
/etc/confluent/docker/run &

# Attendre que Kafka Connect REST API soit up
echo "⏳ Attente du démarrage de Kafka Connect REST API..."
until curl -s http://localhost:8083/connectors > /dev/null; do
  sleep 3
done

# Charger ton connecteur automatiquement s’il n’existe pas
if ! curl -s http://localhost:8083/connectors | grep -q "clean_data_history"; then
  echo "🚀 Création du connecteur clean_data_history..."
  curl -X POST -H "Content-Type: application/json" \
    --data @/etc/kafka-connect/connectors/postgres.json \
    http://localhost:8083/connectors
else
  echo "⚠️ Le connecteur clean_data_history existe déjà, skip."
fi

# Garder le process actif
wait
