# Lezione 4 — RAG: cercare nei documenti

**Tempo:** 60 minuti
**Obiettivo:** Costruire la parte "intelligente" dell'app — una funzione di ricerca nei file del ristorante, un endpoint per interrogarla e un componente frontend per fare domande.

---

## 1. Cos'è RAG

**RAG** sta per **Retrieval-Augmented Generation**, ovvero "generazione potenziata dal recupero". In pratica:

1. **Retrieval** — il sistema cerca nei tuoi documenti il testo rilevante
2. **Generation** — un modello di intelligenza artificiale usa quel testo per generare una risposta

L'analogia: immagina di dover rispondere alla domanda "Come si fa la carbonara?". Puoi rispondere a memoria, oppure **aprire il libro di ricette**, trovare la pagina giusta e leggere gli ingredienti. RAG fa esattamente questo: cerca prima nei documenti, poi risponde.

```
Domanda: "Come si fa la pizza margherita?"
         │
         ▼
┌─────────────────────┐
│  RETRIEVAL           │  ← Cerca nei documenti
│  data/menu.md        │
│  data/ricette.md     │
│  data/allergeni.md   │
│         │            │
│         ▼            │
│  Trova il paragrafo  │
│  sulla pizza         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  GENERATION          │  ← Costruisce la risposta
│  (modello AI / LLM)  │     usando il testo trovato
└─────────────────────┘
          │
          ▼
Risposta: "La pizza margherita si prepara con..."
```

### La nostra versione semplificata

Nel nostro progetto **saltiamo la fase Generation** (non usiamo un modello AI). Facciamo solo il **Retrieval**: cerchiamo la parola nei file e restituiamo i paragrafi che la contengono.

Perché? Perché il concetto importante è il **recupero delle informazioni dai documenti**. La parte AI è un "plus" che si aggiunge sopra. Nella realtà (per esempio in AthenaAI), il retrieval usa tecniche più avanzate — ma l'idea di base è la stessa.

| AthenaAI (produzione) | RistoranteAI (noi) |
|---|---|
| Cerca con vettori (embeddings) | Cerca con testo semplice |
| Database vettoriale (Weaviate) | File `.md` su disco |
| Risposta generata da un LLM | Paragrafi trovati nel testo |
| Ricerca semantica ("intendi questo?") | Ricerca esatta ("contiene questa parola?") |

---

## 2. Creare la funzione di ricerca nel backend

Creiamo un file separato per la logica di ricerca. È buona norma separare il codice in moduli: il file `main.py` gestisce le rotte HTTP, il file `search.py` gestisce la ricerca.

Crea la cartella `backend/app/services/` e il file `search.py`:

```bash
mkdir -p backend/app/services
```

Crea il file `backend/app/services/__init__.py` (vuoto, serve per far riconoscere la cartella come modulo Python):

```bash
touch backend/app/services/__init__.py
```

Ora crea `backend/app/services/search.py`:

```python
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data")


def search_documents(query: str) -> list[dict]:
    results = []
    query_lower = query.lower()

    for filename in sorted(os.listdir(DATA_DIR)):
        if not filename.endswith(".md"):
            continue

        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath) as f:
            content = f.read()

        paragraphs = content.split("\n\n")
        for paragraph in paragraphs:
            if query_lower in paragraph.lower():
                results.append({
                    "file": filename,
                    "text": paragraph.strip(),
                })

    return results
```

Analizziamo riga per riga:

| Riga | Cosa fa |
|---|---|
| `DATA_DIR = os.path.join(...)` | Calcola il percorso della cartella `data/` rispetto al file corrente |
| `query_lower = query.lower()` | Converte la query in minuscolo (per cercare senza distinguere maiuscole/minuscole) |
| `sorted(os.listdir(DATA_DIR))` | Elenca i file in ordine alfabetico |
| `if not filename.endswith(".md")` | Salta i file che non sono Markdown |
| `content.split("\n\n")` | Divide il testo in paragrafi (separati da righe vuote) |
| `if query_lower in paragraph.lower()` | Controlla se la query appare nel paragrafo (ignorando maiuscole/minuscole) |
| `results.append({...})` | Aggiunge il risultato con il nome del file e il testo del paragrafo |

### Perché cerchiamo nei paragrafi e non nel file intero?

Se cerchi "margherita" e il file `menu.md` è lungo 50 righe, restituire tutto il file non è utile. Meglio restituire solo il paragrafo che contiene la parola cercata — come un motore di ricerca che ti mostra lo snippet rilevante, non l'intera pagina web.

---

## 3. Aggiungere l'endpoint di ricerca

Ora colleghiamo la funzione di ricerca a un endpoint HTTP, così il frontend può chiamarlo.

Apri `backend/app/main.py` e aggiungi l'import e il nuovo endpoint. Il file completo sarà così:

```python
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
```

Le novità:

| Codice | Cosa fa |
|---|---|
| `from app.services.search import search_documents` | Importa la funzione di ricerca dal modulo che abbiamo creato |
| `@app.get("/api/query")` | Registra l'endpoint `/api/query` |
| `async def search(q: str)` | La funzione riceve il parametro `q` dalla URL (la query di ricerca) |
| `search_documents(q)` | Chiama la nostra funzione di ricerca |
| `{"query": q, "results": results}` | Restituisce sia la query originale sia i risultati trovati |

Il parametro `q: str` è un **query parameter** — FastAPI lo legge dall'URL. Quando chiami `/api/query?q=margherita`, la variabile `q` vale `"margherita"`.

### La struttura del backend ora

```
backend/
├── app/
│   ├── main.py              ← rotte HTTP (health, documents, query)
│   └── services/
│       ├── __init__.py
│       └── search.py        ← logica di ricerca nei documenti
└── requirements.txt
```

---

## 4. Testare l'endpoint con curl

Riavvia il backend (se non si è riavviato da solo con `--reload`):

```bash
cd ~/progetti/RistoranteAI/backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

In un altro terminale, prova queste ricerche:

### Cercare "margherita"

```bash
curl "http://localhost:8000/api/query?q=margherita"
```

Risposta:

```json
{
  "query": "margherita",
  "results": [
    {
      "file": "allergeni.md",
      "text": "### Pizza Margherita\n- Glutine (impasto)\n- Lattosio (mozzarella)"
    },
    {
      "file": "menu.md",
      "text": "- **Margherita** — €7\n  Pomodoro, mozzarella, basilico"
    },
    {
      "file": "ricette.md",
      "text": "## Pizza Margherita\n\n**Tempo:** 90 minuti (inclusa lievitazione) | **Porzioni:** 1\n\n..."
    }
  ]
}
```

### Cercare "lattosio"

```bash
curl "http://localhost:8000/api/query?q=lattosio"
```

Restituisce tutti i paragrafi che contengono "lattosio" — dai menu agli allergeni.

### Cercare una parola inesistente

```bash
curl "http://localhost:8000/api/query?q=sushi"
```

```json
{"query": "sushi", "results": []}
```

Nessun risultato — il campo `results` è vuoto. È il comportamento corretto: nel nostro ristorante non c'è il sushi.

### Testare dalla documentazione Swagger

Apri il browser su `http://localhost:8000/docs`. Vedrai il nuovo endpoint `/api/query`. Clicca su di esso → **Try it out** → inserisci una query → **Execute**. Potrai vedere la risposta formattata direttamente nel browser.

---

## 5. Creare il componente di ricerca nel frontend

Ora creiamo l'interfaccia per fare domande. L'utente digita una parola, clicca un pulsante e vede i risultati.

Crea il file `frontend/app/components/SearchBar.tsx`:

```tsx
"use client";

import { useState } from "react";

interface SearchResult {
  file: string;
  text: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`http://localhost:8000/api/query?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    setResults(json.results);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cerca nel menu, nelle ricette..."
          className="flex-1 rounded border border-gray-300 px-4 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Cerca"}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {results.map((r, i) => (
          <div key={i} className="rounded border p-4">
            <p className="mb-1 text-sm font-semibold text-blue-600">{r.file}</p>
            <p className="whitespace-pre-line text-gray-700">{r.text}</p>
          </div>
        ))}
        {results.length === 0 && query && !loading && (
          <p className="text-gray-500">Nessun risultato per &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  );
}
```

Analizziamo il componente:

| Parte | Cosa fa |
|---|---|
| `useState("")` | Memorizza il testo digitato dall'utente |
| `useState<SearchResult[]>([])` | Memorizza i risultati della ricerca |
| `useState(false)` | Memorizza lo stato di caricamento |
| `handleSearch()` | Fa la richiesta al backend e aggiorna i risultati |
| `encodeURIComponent(query)` | Codifica la query per l'URL (gestisce spazi e caratteri speciali) |
| `handleKeyDown` | Permette di cercare premendo Invio |
| `{results.map(...)}` | Mostra ogni risultato in una card |
| `disabled={loading}` | Disabilita il pulsante durante il caricamento |

Notiamo un pattern nuovo rispetto alla Lezione 3: qui **non usiamo `useEffect`**. Perché? Perché la ricerca non avviene quando la pagina si carica, ma **quando l'utente clicca il pulsante**. Chiamiamo `fetch` dentro una funzione normale (`handleSearch`), non dentro `useEffect`.

### Aggiungere il componente alla pagina

Aggiorna `frontend/app/page.tsx`:

```tsx
import HealthStatus from "./components/HealthStatus";
import DocumentList from "./components/DocumentList";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
      <HealthStatus />
      <DocumentList />
      <hr className="my-8" />
      <h2 className="mb-4 text-2xl font-semibold">Cerca nei documenti</h2>
      <SearchBar />
    </main>
  );
}
```

Verifica: apri `http://localhost:3000` nel browser. Dovresti vedere il campo di ricerca sotto la lista dei documenti. Prova a cercare "carbonara", "lattosio", "pizza".

---

## 6. Ricerca testuale vs ricerca semantica: il confronto con AthenaAI

Il nostro sistema cerca la parola esatta nel testo. È una **ricerca testuale** (o "keyword-based"). Funziona, ma ha limiti:

| Query | Cosa trova | Cosa NON trova |
|---|---|---|
| "margherita" | Pizza Margherita, allergeni della Margherita | — |
| "formaggio" | Quattro Formaggi | "mozzarella", "parmigiano" (sono formaggi ma la parola non c'è) |
| "senza glutine" | Niente (nessun piatto è descritto così) | Piatti che *potrebbero* essere senza glutine |
| "primo piatto con le uova" | Niente | Carbonara (è un primo con le uova, ma la frase non è nel testo) |

In **AthenaAI**, questi problemi si risolvono con la **ricerca semantica**:

| Concetto | RistoranteAI (noi) | AthenaAI |
|---|---|---|
| Come cerca | Parole esatte nel testo | Significato delle parole (embeddings/vettori) |
| Database | File `.md` su disco | Weaviate (database vettoriale) |
| "formaggio" trova "mozzarella"? | No | Sì — perché i vettori sono vicini nel significato |
| "primo con le uova" trova "carbonara"? | No | Sì — perché il significato coincide |
| Complessità | Bassa (poche righe di Python) | Alta (embeddings, database vettoriale, LLM) |

L'idea di fondo è **la stessa**: l'utente fa una domanda, il sistema cerca nei documenti, restituisce i risultati pertinenti. Quello che cambia è **come** si cerca. La nostra versione usa il metodo più semplice possibile — ed è un ottimo punto di partenza per capire il concetto.

```
RistoranteAI                          AthenaAI
───────────                           ─────────
Domanda: "formaggio"                  Domanda: "formaggio"
         │                                      │
         ▼                                      ▼
Cerca la parola                       Converte in vettore
esatta nel testo                      (embedding numerico)
         │                                      │
         ▼                                      ▼
"formaggio" ∈ testo?                  Cerca vettori simili
         │                             nel database Weaviate
         ▼                                      │
Solo se la parola                              ▼
"formaggio" è presente              Trova mozzarella, parmigiano,
nel testo                           gorgonzola, fontina...
(perché i loro vettori
sono vicini a "formaggio")
```

---

## 7. Riepilogo

In questa lezione abbiamo imparato:

| Concetto | Cosa fa |
|---|---|
| **RAG** | Retrieval-Augmented Generation: cercare nei documenti prima di rispondere |
| **Retrieval** | La fase di ricerca nei documenti (quella che abbiamo implementato) |
| **Ricerca testuale** | Cercare una parola esatta nel testo — semplice ma limitata |
| **Ricerca semantica** | Cercare per significato — più potente, serve intelligenza artificiale |
| `split("\n\n")` | Divide il testo in paragrafi |
| `query.lower()` | Converte in minuscolo per cercare senza distinguere maiuscole/minuscole |
| `encodeURIComponent()` | Codifica il testo per l'URL (gestisce spazi, accenti, ecc.) |
| Moduli Python | Separare il codice in file diversi (`main.py` per le rotte, `search.py` per la logica) |

Il flusso completo della ricerca:

```
Utente digita "carbonara" nel campo di ricerca
  │
  ▼
Frontend invia: GET /api/query?q=carbonara
  │
  ▼
Backend riceve la richiesta
  │
  ▼
search_documents("carbonara") legge i file .md
  │
  ▼
Per ogni file:
  → divide in paragrafi
  → cerca "carbonara" in ogni paragrafo (minuscolo)
  → se trova, aggiunge ai risultati
  │
  ▼
Backend risponde: {"query": "carbonara", "results": [...]}
  │
  ▼
Frontend mostra i risultati in card
```

### Struttura del progetto ora

```
RistoranteAI/
├── frontend/
│   └── app/
│       ├── components/
│       │   ├── HealthStatus.tsx      ← Lezione 3
│       │   ├── DocumentList.tsx      ← Lezione 3
│       │   └── SearchBar.tsx         ← NUOVO: campo di ricerca
│       └── page.tsx                  ← Aggiornato con SearchBar
├── backend/
│   └── app/
│       ├── main.py                   ← Aggiornato con endpoint /api/query
│       └── services/
│           └── search.py             ← NUOVO: funzione di ricerca
└── data/
    ├── menu.md
    ├── ricette.md
    └── allergeni.md
```

---

## Prossima lezione

Nella Lezione 5 aggiungeremo la visualizzazione dei singoli documenti: cliccando su un risultato, l'utente potrà leggere il documento completo con formattazione Markdown.
