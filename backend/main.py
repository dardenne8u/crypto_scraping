from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect 
from socket_manager import ConnectionManager
from db import create_db, get_session
from kafka_utils import get_consumer
import asyncio
import threading


manager = ConnectionManager()
app = FastAPI()

@app.on_event("startup")
async def on_startup():
    create_db() 
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

@app.get("/history")
def history():
    db = get_session()
    return res

def kafka_listener(loop):
    consumer = get_consumer()
    for message in consumer:
        print("Message en cours d'envoi", flush=True)
        data = message.value.decode("utf-8")
        asyncio.run_coroutine_threadsafe(manager.broadcast(f"{data}"), loop)
        print("Message envoye", flush=True)
        

