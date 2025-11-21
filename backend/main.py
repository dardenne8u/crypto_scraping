from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends 
from socket_manager import ConnectionManager
from db import create_db, get_session, crypto, SessionDep
from kafka_utils import get_consumer
from sqlmodel import select
import asyncio
import threading


manager = ConnectionManager()
app = FastAPI()

@app.on_event("startup")
async def on_startup():
    # create_db() 
    loop = asyncio.get_event_loop()
    threading.Thread(target=kafka_listener, args=(loop,), daemon=True).start()

@app.websocket("/connect")
async def connect(websocket: WebSocket):
    print("Socket try to connect")
    await manager.connect(websocket)
    print("Socket connecte")
    try:
        await asyncio.Future()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("socket deconnecte")

@app.get("/")
def hello():
    return "Hello World"

@app.get("/history/{crypto_name}")
def history(session: SessionDep, crypto_name: str):
    query = select(crypto.price, crypto.date).where(crypto.name == crypto_name)
    results = session.exec(query).all()
    return [
        {"price": row[0], "date": row[1]}
        for row in results
    ]

@app.get("/lastdata")
def lastdata(session: SessionDep):
    query = select(crypto).where(crypto.date.in_(
        select(crypto.date).distinct().order_by(crypto.date.desc()).limit(1)))
    results = session.exec(query).all()
    return results

def kafka_listener(loop):
    consumer = get_consumer()
    for message in consumer:
        print("Message en cours d'envoi", flush=True)
        data = message.value.decode("utf-8")
        asyncio.run_coroutine_threadsafe(manager.broadcast(f"{data}"), loop)
        print("Message envoye", flush=True)
        

