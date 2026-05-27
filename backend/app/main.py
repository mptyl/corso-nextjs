import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.services.search import search_documents

app = FastAPI(title="RistoranteAI")

# Configurazione CORS per lo sviluppo (frontend su porta 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data")
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "out")


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Backend funzionante"}


@app.get("/api/documents")
async def list_documents():
    files = os.listdir(DATA_DIR)
    documents = [
        {"name": f, "path": os.path.join(DATA_DIR, f)}
        for f in sorted(files)
        if f.endswith(".md")
    ]
    return {"documents": documents}


@app.get("/api/query")
async def search(q: str):
    results = search_documents(q)
    return {"query": q, "results": results}


# Servire la home page del frontend statico
@app.get("/")
async def serve_frontend():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


# Mount dei file statici di Next.js (_next contiene CSS e JS compilati)
app.mount("/_next", StaticFiles(directory=os.path.join(FRONTEND_DIR, "_next")), name="nextjs_static")


