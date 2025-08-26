FROM selenium/standalone-chrome:latest

# Switch to root to install Python
USER root

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy your requirements and install them
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy your scraper code
COPY . /app
WORKDIR /app

# Switch back to seluser
USER seluser

CMD ["python", "main.py"]
