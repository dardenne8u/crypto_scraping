FROM confluentinc/cp-kafka-connect:7.6.1

# Installer JDBC Sink Connector
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:latest

# Ajouter driver PostgreSQL
RUN wget https://jdbc.postgresql.org/download/postgresql-42.7.4.jar \
    -P /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib/

# Copier fichiers
COPY postgres.json /etc/kafka-connect/connectors/
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Passer root juste pour chmod
USER root
RUN chmod +x /usr/local/bin/entrypoint.sh
USER appuser

# Utiliser notre script comme entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
