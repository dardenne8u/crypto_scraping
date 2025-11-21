from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends 
from fastapi.middleware.cors import CORSMiddleware
from socket_manager import ConnectionManager
from db import create_db, get_session, crypto, SessionDep
from kafka_utils import get_consumer
from sqlmodel import select
import asyncio
import threading


manager = ConnectionManager()
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
def history(session: SessionDep, crypto_name: str, date_debut:int|None = None, date_fin:int|None = None):
    query = select(crypto.price, crypto.date).where(crypto.name == crypto_name)
    if (date_debut is not None):
        query = query.where(crypto.date >= date_debut)

    if (date_fin is not None):
        query = query.where(crypto.date <= date_fin)
    
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
        future = asyncio.run_coroutine_threadsafe(manager.broadcast(f"{data}"), loop)
        try:
            future.result(timeout=5) 
            print("Message envoyé au WebSocket", flush=True)
        except Exception as e:
            print(f"ERREUR FATALE BROADCAST: {e}", flush=True)
        

