# Lezione 3 — Collegare Frontend e Backend

**Tempo:** 60 minuti
**Obiettivo:** Far comunicare il frontend Next.js con il backend FastAPI usando `fetch`, risolvere il problema CORS e mostrare dati reali a schermo.

---

## 1. Il concetto: Frontend e Backend parlano tra loro

Immagina un ristorante:

- Tu sei seduto al **tavolo** (il frontend) e guardi il menu
- Il **cameriere** prende la tua ordinazione e la porta in **cucina** (il backend)
- La cucina prepara il piatto e il cameriere te lo riporta

Nel nostro caso:

| Ristorante | Web |
|---|---|
| Tavolo | Frontend (Next.js, porta 3000) |
| Cameriere | HTTP request (`fetch`) |
| Cucina | Backend (FastAPI, porta 8000) |
| Piatto | Dati in formato JSON |

Il frontend invia una **richiesta HTTP** al backend, il backend calcola la risposta e la rimanda come **JSON** — un formato testo semplice per strutturare i dati, tipo così:

```json
{
  "status": "ok",
  "message": "Backend funzionante"
}
```

---

## 2. Il problema CORS

Quando il frontend (su `http://localhost:3000`) cerca di chiamare il backend (su `http://localhost:8000`), il **browser blocca la richiesta** per motivi di sicurezza.

Si chiama **CORS** (Cross-Origin Resource Sharing). Il browser dice: *"Aspetta, questo sito sta cercando di parlare con un altro server. È sicuro?"*

La soluzione è dire al backend: *"Tranquillo, accetta richieste da questo indirizzo"*.

### Aggiungere CORS al backend

Apri `backend/app/main.py` e aggiungi queste righe, dopo la creazione di `app`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Il file `main.py` completo ora sarà così:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RistoranteAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Backend funzionante"}
```

Riavvia il backend:

```bash
cd backend
fastapi dev app/main.py
```

---

## 3. Nozioni fondamentali: fetch, async/await, useState, useEffect

Prima di scrivere codice, ecco i concetti che useremo. Non serve memorizzarli — leggi e poi torna qui quando li incontri nel codice.

### fetch

`fetch()` è una funzione del browser per fare richieste HTTP. Gli passi un URL e lei ti restituisce la risposta:

```typescript
const risposta = await fetch("http://localhost:8000/api/health");
const dati = await risposta.json();
```

### async / await

Alcune operazioni (come scaricare dati da internet) richiedono tempo. Invece di bloccare tutto il programma ad aspettare, JavaScript usa `async` e `await`:

```typescript
async function prendiDati() {
  // await = "aspetta che questa operazione finisca, poi vai avanti"
  const risposta = await fetch("http://localhost:8000/api/health");
  const dati = await risposta.json();
  return dati;
}
```

Pensa a `await` come a: *"metti in pausa questa funzione finché il risultato non è pronto"*.

### useState

In React, i componenti possono avere dei **dati interni** che cambiano nel tempo (si chiamano "stato"). `useState` crea una variabile che, quando la modifichi, aggiorna automaticamente lo schermo:

```tsx
const [documenti, setDocumenti] = useState([]);
//  ^^^^^^^^^^  ^^^^^^^^^^^^^^^
//  valore       funzione per cambiarlo
```

### useEffect

`useEffect` esegue del codice **una volta sola** quando il componente appare a schermo. È il posto giusto per fare una chiamata `fetch`:

```tsx
useEffect(() => {
  // Questo codice gira una volta quando la pagina si carica
  fetchDati();
}, []);
// ^^ array vuoto = gira una volta sola
```

---

## 4. Chiamare l'endpoint health dal frontend

Ora facciamo fare al frontend una richiesta al backend e mostriamo il risultato a schermo.

Crea il file `frontend/app/components/HealthStatus.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface HealthData {
  status: string;
  message: string;
}

export default function HealthStatus() {
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      const res = await fetch("http://localhost:8000/api/health");
      const json = await res.json();
      setData(json);
    }
    fetchHealth();
  }, []);

  if (!data) return <p>Caricamento...</p>;

  return (
    <div className="rounded border p-4">
      <p><strong>Stato:</strong> {data.status}</p>
      <p><strong>Messaggio:</strong> {data.message}</p>
    </div>
  );
}
```

Cosa fa questo componente, riga per riga:

1. `"use client"` — dice a Next.js che questo componente gira nel browser (serve per `useState` e `useEffect`)
2. `useState<HealthData | null>(null)` — crea lo stato, inizialmente `null` (nessun dato)
3. `useEffect(() => { ... }, [])` — quando il componente appare, esegue il codice dentro
4. `fetchHealth()` — fa la richiesta al backend e salva i dati nello stato
5. `if (!data) return ...` — se non abbiamo ancora i dati, mostra "Caricamento..."
6. Il `return` finale mostra i dati a schermo

### Usare il componente nella pagina

Apri `frontend/app/page.tsx` e modificalo così:

```tsx
import HealthStatus from "./components/HealthStatus";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
      <HealthStatus />
    </main>
  );
}
```

Verifica che funzioni: apri `http://localhost:3000` nel browser. Dovresti vedere "Stato: ok" e "Messaggio: Backend funzionante".

---

## 5. Nuovo endpoint: lista dei documenti

Ora creiamo un endpoint nel backend che legge i file dalla cartella `data/` e restituisce i loro nomi.

Aggiungi questo a `backend/app/main.py`:

```python
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data")


@app.get("/api/documents")
async def list_documents():
    files = os.listdir(DATA_DIR)
    documents = [
        {"name": f, "path": os.path.join(DATA_DIR, f)}
        for f in sorted(files)
        if f.endswith(".md")
    ]
    return {"documents": documents}
```

Riavvia il backend e prova l'endpoint nel browser: `http://localhost:8000/api/documents`

Dovresti vedere qualcosa del genere:

```json
{
  "documents": [
    {"name": "allergeni.md", "path": "/percorso/assoluto/data/allergeni.md"},
    {"name": "menu.md", "path": "/percorso/assoluto/data/menu.md"},
    {"name": "ricette.md", "path": "/percorso/assoluto/data/ricette.md"}
  ]
}
```

---

## 6. Componente per mostrare la lista documenti

Crea il file `frontend/app/components/DocumentList.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface Document {
  name: string;
  path: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      const res = await fetch("http://localhost:8000/api/documents");
      const json = await res.json();
      setDocuments(json.documents);
    }
    fetchDocuments();
  }, []);

  if (documents.length === 0) return <p>Nessun documento trovato.</p>;

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">Documenti disponibili</h2>
      <ul className="list-inside list-disc space-y-1">
        {documents.map((doc) => (
          <li key={doc.name} className="text-gray-700">{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Nota la riga `{documents.map((doc) => (...))}` — prende ogni elemento dell'array e crea un `<li>` per ciascuno. In React si usa spesso `.map()` per trasformare dati in elementi HTML.

### Aggiungere il componente alla pagina

Aggiorna `frontend/app/page.tsx`:

```tsx
import HealthStatus from "./components/HealthStatus";
import DocumentList from "./components/DocumentList";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
      <HealthStatus />
      <DocumentList />
    </main>
  );
}
```

---

## 7. Riepilogo

In questa lezione abbiamo imparato:

| Concetto | Cosa fa |
|---|---|
| `fetch()` | Invia una richiesta HTTP a un server |
| `await` | Aspetta che un'operazione asincrona finisca |
| `JSON` | Formato leggero per scambiare dati tra frontend e backend |
| `useState` | Crea dati reattivi in un componente React |
| `useEffect` | Esegue codice quando il componente appare a schermo |
| CORS | Meccanismo di sicurezza del browser, va configurato nel backend |

Il flusso completo è:

```
Pagina si carica
  → useEffect esegue fetch()
    → Backend riceve la richiesta
      → Backend restituisce JSON
        → Frontend riceve i dati
          → useState aggiorna lo stato
            → React aggiorna lo schermo
```

---

## Prossima lezione

Nella [Lezione 4](lezione-04.md) costruiremo la parte RAG: il backend leggerà i file Markdown e cercherà testo al loro interno, il frontend avrà un campo per fare domande.
