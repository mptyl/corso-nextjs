# Lezione 1 — Il backend: FastAPI e le prime API

**Obiettivo:** Creare un backend FastAPI con due endpoint funzionanti

**Tempo stimato:** 60 minuti

---

## 1.1 Cos'è un backend?

Immagina un ristorante. Tu sei seduto nella **sala da pranzo** (il frontend) e leggi il **menu** (le API). Quando ordini, la richiesta arriva in **cucina** (il backend), dove lo chef prepara il piatto e te lo serve.

In un'applicazione web:

| Ristorante | Web |
|---|---|
| Sala da pranzo | Frontend (quello che vedi sullo schermo) |
| Cucina | Backend (il codice che elabora i dati) |
| Menu | API (cosa puoi chiedere al backend) |
| Cameriere | HTTP (il protocollo che trasporta la richiesta) |

**FastAPI** è un framework Python per costruire backend. Ti permette di creare "piatti del menu" (endpoint) che il frontend può ordinare (chiamare).

Perché FastAPI e non Django o Flask?

- È **veloce** — uno dei framework Python più performanti
- È **semplice** — poco codice per ottenere risultati
- Ha la **documentazione automatica** — genera una pagina web con tutti i tuoi endpoint
- Usa **Python** — la lingua che Simone e Leonardo conoscono già

---

## 1.2 Creare la struttura del progetto

Nella Lezione 0 avete creato la cartella `~/progetti/RistoranteAI`. Ora aggiungiamo il backend.

```bash
cd ~/progetti/RistoranteAI
mkdir -p backend/app
mkdir -p data
```

La struttura sarà:

```
RistoranteAI/
├── backend/
│   ├── app/
│   │   └── main.py      ← il cuore del backend
│   └── requirements.txt  ← le dipendenze Python
└── data/                 ← i file di testo del ristorante
```

---

## 1.3 Il file delle dipendenze

In Antigravity: crea il file `backend/requirements.txt` (tasto destro nel Explorer → New File) e inserisci il seguente contenuto:

```text
fastapi
uvicorn
```

`requirements.txt` elenca i pacchetti Python necessari. È come una lista della spesa:

- **fastapi** — il framework per creare le API
- **uvicorn** — il server web che fa girare FastAPI (torna alla metafora: è il cameriere che porta le ordinazioni)

---

## 1.4 Il primo endpoint: main.py

In Antigravity: crea il file `backend/app/main.py` e inserisci il seguente contenuto:

```python
from fastapi import FastAPI

app = FastAPI(title="RistoranteAI")


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "RistoranteAI is running"}
```

Analizziamo riga per riga:

| Riga | Cosa fa |
|---|---|
| `from fastapi import FastAPI` | Importa il framework FastAPI |
| `app = FastAPI(title="RistoranteAI")` | Crea l'applicazione, come aprire il ristorante |
| `@app.get("/api/health")` | Registra un endpoint: quando qualcuno chiede `/api/health`, esegui questa funzione |
| `async def health():` | La funzione che risponde alla richiesta |
| `return {"status": "ok", ...}` | Restituisce un oggetto JSON — è il "piatto" servito |

L'endpoint `/api/health` è come il "controllo sanitario" del ristorante: un modo rapido per verificare che tutto funzioni.

---

## 1.5 Creare l'ambiente virtuale e installare le dipendenze

Ora prepariamo l'ambiente Python. È buona pratica isolare i pacchetti di ogni progetto in un **ambiente virtuale** — una copia separata di Python che non interferisce con il resto del sistema.

```bash
cd ~/progetti/RistoranteAI/backend
python3 -m venv .venv
```

`python3 -m venv .venv` crea una cartella `.venv` con una copia isolata di Python. I pacchetti installati qui non influenzano altri progetti.

Attiva l'ambiente virtuale:

```bash
source .venv/bin/activate
```

Vedrai apparire `(.venv)` all'inizio del prompt — significa che l'ambiente è attivo.

Installa le dipendenze:

```bash
pip install -r requirements.txt
```

`pip` legge `requirements.txt` e scarica FastAPI, Uvicorn e tutte le loro dipendenze.

---

## 1.6 Avviare il server

```bash
uvicorn app.main:app --reload --port 8000
```

Analizziamo il comando:

| Parte | Significato |
|---|---|
| `uvicorn` | Il server web |
| `app.main:app` | Cerca la variabile `app` nel file `app/main.py` |
| `--reload` | Riavvia automaticamente quando modifichi il codice |
| `--port 8000` | Usa la porta 8000 |

L'output sarà qualcosa del genere:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Il server è in esecuzione. Finché non lo fermi, rimane attivo e aspetta le richieste.

> **Importante:** Apri un **secondo terminale** in Antigravity (`` Ctrl+` `` → nuovo terminale) per i comandi successivi. Ricorda di attivare anche lì l'ambiente virtuale:
>
> ```bash
> cd ~/progetti/RistoranteAI/backend
> source .venv/bin/activate
> ```

---

## 1.7 Testare l'endpoint con curl

Con il server in esecuzione nel primo terminale, nel secondo terminale digita:

```bash
curl http://localhost:8000/api/health
```

Risposta:

```json
{"status":"ok","message":"RistoranteAI is running"}
```

Funziona! Hai appena chiamato la tua prima API. Il backend ha ricevuto la richiesta, eseguito la funzione `health()` e restituito un JSON.

### La documentazione automatica

FastAPI genera una pagina web interattiva con tutti i tuoi endpoint. Apri il browser su:

```
http://localhost:8000/docs
```

Vedrai l'interfaccia **Swagger UI** — una pagina dove puoi vedere, testare e sperimentare con le tue API direttamente dal browser. Clicca su `/api/health` → **Try it out** → **Execute** per vedere la risposta.

Questa documentazione si aggiorna automaticamente ogni volta che aggiungi o modifichi un endpoint.

---

## 1.8 Aggiungere i dati del ristorante

Ora creiamo i file di testo che il backend leggerà. In Antigravity: crea il file `data/menu.md`:

```markdown
# Menu del Giorno

## Primi
- Pasta Carbonara
- Risotto ai Funghi

## Secondi
- Cotoletta alla Milanese
- Pesce Spada alla Griglia

## Dolci
- Tiramisù
- Panna Cotta
```

E il file `data/allergeni.md`:

```markdown
# Allergeni

## Pasta Carbonara
Uova, Glutine, Lattosio

## Tiramisù
Uova, Glutine, Lattosio

## Panna Cotta
Lattosio
```

---

## 1.9 Il secondo endpoint: leggere i documenti

Ora aggiungiamo un endpoint che elenca i file nella cartella `data/`. Modifica `backend/app/main.py`:

```python
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
```

Le novità:

| Codice | Cosa fa |
|---|---|
| `import os` | Importa il modulo per interagire con il filesystem |
| `DATA_DIR = os.path.join(...)` | Calcola il percorso della cartella `data/` |
| `os.listdir(DATA_DIR)` | Elenca tutti i file nella cartella |
| `[f for f in files if f.endswith(".md")]` | Filtra solo i file `.md` (list comprehension) |

Grazie al flag `--reload`, Uvicorn rileva la modifica e riavvia il server automaticamente. Non devi fermare e riavviare manualmente.

Testa il nuovo endpoint:

```bash
curl http://localhost:8000/api/documents
```

Risposta:

```json
{"documents":["allergeni.md","menu.md"]}
```

Il backend legge dal filesystem e restituisce la lista dei documenti disponibili.

---

## 1.10 Concetti chiave

### Route (rotta)

Una rotta è l'indirizzo di un endpoint. `/api/health` e `/api/documents` sono due rotte diverse. È come il numero del piatto nel menu: ogni numero corrisponde a un piatto diverso.

### Metodi HTTP

Il metodo HTTP dice **cosa vuoi fare** con quella rotta:

| Metodo | Significato | Esempio |
|---|---|---|
| `GET` | Leggere dati | "Quali documenti hai?" |
| `POST` | Creare dati | "Aggiungi questo documento" |
| `PUT` | Modificare dati | "Aggiorna questo documento" |
| `DELETE` | Cancellare dati | "Rimuovi questo documento" |

In questa lezione usiamo solo `GET` — leggiamo dati, non li modifichiamo. Il decoratore `@app.get` registra una rotta che risponde al metodo GET.

### async

La parola chiave `async` rende la funzione **asincrona**: Python può gestire altre richieste mentre aspetta (per esempio, che il filesystem risponda). Per ora, puoi ignorarla — ti basta sapere che è la modalità raccomandata da FastAPI.

### JSON

JSON è il formato con cui il backend comunica. È un modo semplice per rappresentare dati come testo:

```json
{"status": "ok", "documents": ["menu.md", "allergeni.md"]}
```

In Python, un dizionario `{"chiave": "valore"}` diventa automaticamente un oggetto JSON nella risposta.

### Uvicorn

FastAPI da solo non può ricevere richieste HTTP. Ha bisogno di un **server web** che stia in ascolto e gli passi le richieste. Uvicorn fa esattamente questo — è il "cameriere" che prende le ordinazioni e le porta in cucina.

---

## 1.11 Fermare il server

Per fermare il server, torna nel terminale dove Uvicorn è in esecuzione e premi:

```
Ctrl + C
```

Uvicorn si ferma immediatamente. Per riavviarlo:

```bash
uvicorn app.main:app --reload --port 8000
```

Ricorda: ogni volta che apri un nuovo terminale, devi attivare l'ambiente virtuale:

```bash
cd ~/progetti/RistoranteAI/backend
source .venv/bin/activate
```

> **Suggerimento:** Per uscire dall'ambiente virtuale senza chiudere il terminale, digita `deactivate`.

---

## Riepilogo comandi

| Comando | Cosa fa |
|---|---|
| `mkdir -p backend/app` | Crea la struttura del backend |
| `python3 -m venv .venv` | Crea l'ambiente virtuale |
| `source .venv/bin/activate` | Attiva l'ambiente virtuale |
| `pip install -r requirements.txt` | Installa le dipendenze |
| `uvicorn app.main:app --reload --port 8000` | Avvia il server |
| `curl http://localhost:8000/api/health` | Testa l'endpoint health |
| `curl http://localhost:8000/api/documents` | Testa l'endpoint documents |
| `Ctrl + C` | Ferma il server |
| `deactivate` | Disattiva l'ambiente virtuale |

---

## Riepilogo concetti

| Concetto | Spiegazione |
|---|---|
| Backend | Il codice che gira sul server e gestisce i dati |
| API | L'interfaccia attraverso cui frontend e backend comunicano |
| Endpoint | Una rotta specifica (es. `/api/health`) che risponde a una richiesta |
| GET | Metodo HTTP per leggere dati |
| JSON | Formato testo strutturato per scambiare dati |
| FastAPI | Framework Python per creare API |
| Uvicorn | Server web che esegue FastAPI |
| Ambiente virtuale | Copia isolata di Python per non sporcare il sistema |

---

*Prossima lezione: Creiamo il frontend con Next.js, React e Tailwind.*
