import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from api.messages import router as messages_router

app = FastAPI(title="WhatsApp Priority Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(messages_router)

build_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(build_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(build_dir, "static")), name="static")

@app.get("/")
def serve_react():
    idx = os.path.join(build_dir, "index.html")
    return FileResponse(idx) if os.path.exists(idx) else {"message": "Backend running. Build frontend."}

@app.get("/{path:path}")
def catch_all(path: str):
    fp = os.path.join(build_dir, path)
    if os.path.exists(fp) and os.path.isfile(fp):
        return FileResponse(fp)
    idx = os.path.join(build_dir, "index.html")
    return FileResponse(idx) if os.path.exists(idx) else {"message": "Backend running. Build frontend."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)