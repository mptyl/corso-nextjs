import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.search import search_documents

app = FastAPI(title="RistoranteAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data")


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

