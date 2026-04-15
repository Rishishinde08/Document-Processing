from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.database import Base, engine
import redis
import json

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(router)

# 🔥 Redis connection
r = redis.Redis(host="localhost", port=6379, db=0)

# 🔥 WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    pubsub = r.pubsub()
    pubsub.subscribe("progress")

    while True:
        message = pubsub.get_message(ignore_subscribe_messages=True)

        if message:
            data = message["data"].decode()
            await websocket.send_text(data)