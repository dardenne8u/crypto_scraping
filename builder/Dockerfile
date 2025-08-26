FROM python:3.13.7-alpine3.21
WORKDIR app
COPY . /app
RUN pip install -r /app/requirements.txt
RUN python /app/main.py
