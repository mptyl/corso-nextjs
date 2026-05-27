import os
from fastapi import FastAPI

app = FastAPI(title="RistoranteAI")

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "RistoranteAI is running"}


@app.get("/api/documents")
async def list_documents():
    files = os.listdir(DATA_DIR)
    documents = [f for f in files if f.endswith(".md")]
    return {"documents": documents}
