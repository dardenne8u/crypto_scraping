from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect 
from .socket_manager import ConnectionManager
from .db import create_db, get_session
from kafka import get_consumer 

manager = ConnectionManager()
app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db()

@app.get("/")
def test():
    return {"Hello": "World"}


@app.websocket("/connect")
async def connect(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        consumer = get_consumer()
        for message in consumer:
            manager.send_broadcast("{data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/history")
def history():
    db = get_session()
    return res
