import asyncio
import time
import nest_asyncio
import uvicorn
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pyngrok import ngrok
from music_engine import engine

app = FastAPI()

os.makedirs("static", exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"status": "online", "message": "Multi-Agent Backend is Active"}

class MusicReq(BaseModel):
    prompt: str
    duration: int = 60

@app.post("/generate")
async def api_gen(req: MusicReq):
    try:
        result = engine.generate_all(req.prompt, req.duration)
        # validate fields
        if not result.get("audio_url") or not result.get("image_url"):
            raise HTTPException(status_code=500, detail="Missing audio or image URL")
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

nest_asyncio.apply()

async def run_server():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

loop = asyncio.get_event_loop()
loop.create_task(run_server())

print("Waiting for server to bind to port 8000...")
time.sleep(5)

NGROK_TOKEN = "1s9cBzoPkhSLNAn6G7exrHBQYxW_7hJpJvmXfhqoQxdY6DBCn"
ngrok.set_auth_token(NGROK_TOKEN)

try:
    ngrok.kill()
    time.sleep(2)
    public_url = ngrok.connect(8000).public_url
    print("\n" + "="*50)
    print(f"🚀 MULTI-AGENT API LIVE AT: {public_url}")
    print(f"Documentation: {public_url}/docs")
    print("="*50 + "\n")
except Exception as e:
    print(f"Tunnel Error: {e}")
