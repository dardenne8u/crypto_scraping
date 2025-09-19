from typing import List, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
def test():
    return {"Hello": "World"}

@app.websocket("/connect")
async def connect(websocket: WebSocket):
    await manager.connect(websocket)
    await manager.send_personal_message("Eh coucou", websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)