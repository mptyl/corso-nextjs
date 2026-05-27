import os
from typing import List, Dict

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data")

def search_documents(query: str) -> List[Dict[str, str]]:
    results = []
    query_lower = query.lower()
    
    if not os.path.exists(DATA_DIR):
        return results

    for filename in sorted(os.listdir(DATA_DIR)):
        if not filename.endswith(".md"):
            continue

        filepath = os.path.join(DATA_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            continue

        paragraphs = content.split("\n\n")
        for paragraph in paragraphs:
            if query_lower in paragraph.lower():
                results.append({
                    "file": filename,
                    "text": paragraph.strip(),
                })

    return results

