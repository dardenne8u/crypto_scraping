from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect 
from .socket_manager import ConnectionManager
from .db import create_db
from kafka import get_data_from_kafka 

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
    await manager.send_personal_message("Eh coucou", websocket)

    try:
        while True:
            data = get_data_from_kafka()
            print(data) 
            await manager.broadcast(f"{data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)