# Lezione 6 — Deploy: il build di produzione

**Tempo:** 30 minuti
**Obiettivo:** Compilare il frontend Next.js per la produzione e servirlo dal backend FastAPI, unendo tutto su un unico server.

---

## 1. Cos'è il build di produzione

Finora abbiamo usato il **server di sviluppo** di Next.js:

```bash
npm run dev
```

Questo server compila i file al volo ogni volta che li apri nel browser. È comodo durante lo sviluppo perché basta salvare un file e vedere le modifiche subito, ma è **lento** e non è adatto per gli utenti finali.

Un'analogia: è come un ristorante dove lo chef **cucina su ordinazione** — ogni cliente aspetta che il piatto venga preparato da zero. Funziona, ma è lento.

Il **build di produzione** fa qualcosa di diverso: compila **tutto in anticipo** e crea file statici ottimizzati, pronti per essere serviti immediatamente. Come un ristorante che **prepara i piatti in anticipo** e li ha già pronti quando il cliente ordina.

| Sviluppo (`npm run dev`) | Produzione (`npm run build`) |
|---|---|
| Compila al volo, su richiesta | Compila tutto in anticipo |
| Lento, ottimizzato per il programmatore | Veloce, ottimizzato per l'utente |
| Mostra errori dettagliati | Mostra pagine di errore pulite |
| Due server (frontend:3000 + backend:8000) | Un solo server (backend:8000) |

L'ultimo punto è quello che ci interessa di più: in produzione, **FastAPI serve tutto** — le API e il frontend — su una sola porta.

---

## 2. Configurare Next.js per l'export statico

Prima di compilare, dobbiamo dire a Next.js di produrre **file HTML statici** invece di un'applicazione lato server.

Apri il file `frontend/next.config.js` (o `next.config.mjs` — dipende dalla versione) e modificalo così:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
}

module.exports = nextConfig
```

La riga `output: 'export'` dice a Next.js: *"Non creare un server Node.js. Genera solo file HTML, CSS e JavaScript statici che qualsiasi server può servire."*

Questo significa che Next.js non userà più `npm run dev` per servire le pagine. Invece, creerà una cartella `out/` con tutti i file pronti.

### Attenzione alle funzionalità non compatibili

Con l'export statico, alcune funzionalità di Next.js **non funzionano**:

| Funzionalità | Funziona? |
|---|---|
| Pagine statiche (`page.tsx` senza `"use client"` complesso) | Sì |
| Chiamate `fetch` dal client al backend | Sì |
| API Routes (`app/api/`) | No |
| Server Actions | No |
| Middleware | No |

Per il nostro progetto RistoranteAI non è un problema: tutte le chiamate al backend le facciamo dal client con `fetch`.

---

## 3. Compilare il frontend

Ora lanciamo il build:

```bash
cd ~/progetti/RistoranteAI/frontend
npm run build
```

Vedrai un output simile a questo:

```
   ▲ Next.js 15.x.x

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Collecting page data
 ✓ Generating static pages (3/3)
 ✓ Finalizing page optimization

Route (pages)              Size     First Load JS
┌ ○ /                      5.2 kB   89.4 kB
└ ○ /api/health            0 B      84.1 kB

 ✓ Static export succeeded into 'out' directory
```

### Cosa è successo

Next.js ha:

1. **Compilato il TypeScript** in JavaScript — il browser non capisce TypeScript, quindi tutto viene tradotto
2. **Ottimizzato il CSS** — Tailwind CSS rimuove le classi non utilizzate, riducendo le dimensioni del file
3. **Creato file HTML statici** — ogni pagina diventa un file `.html` che il browser può aprire direttamente
4. **Generato i bundle JavaScript** — il codice React viene impacchettato in file `.js` ottimizzati

Controlla cosa è stato creato:

```bash
ls frontend/out/
```

Vedrai qualcosa del genere:

```
_index.html          ← la home page
404.html             ← pagina di errore
_next/               ← file CSS e JavaScript ottimizzati
```

La cartella `out/` contiene **tutto il frontend** — è il nostro ristorante con i piatti già pronti.

---

## 4. Servire il frontend da FastAPI

Ora modifichiamo il backend per servire i file della cartella `out/`. In questo modo, FastAPI gestirà sia le API sia il frontend su **un'unica porta**.

Apri `backend/app/main.py` e modificalo così:

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="RistoranteAI")

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "out")


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Backend funzionante"}


@app.get("/")
async def serve_frontend():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


app.mount("/_next", StaticFiles(directory=os.path.join(FRONTEND_DIR, "_next")), name="nextjs_static")
```

Analizziamo le novità riga per riga:

| Riga | Cosa fa |
|---|---|
| `from fastapi.staticfiles import StaticFiles` | Importa il supporto per servire file statici (CSS, JS, immagini) |
| `from fastapi.responses import FileResponse` | Importa la classe per restituire un file come risposta |
| `FRONTEND_DIR = os.path.join(...)` | Calcola il percorso della cartella `frontend/out/` |
| `@app.get("/")` | Quando qualcuno chiede la home page... |
| `return FileResponse(...)` | ...restituisci il file `index.html` compilato da Next.js |
| `app.mount("/_next", ...)` | Servi tutti i file CSS e JS dalla cartella `_next/` all'URL `/_next/` |

### Perché serve `app.mount`

Le pagine Next.js caricano file CSS e JavaScript dalla cartella `_next/`. Senza `app.mount`, FastAPI non saprebbe come servire questi file. `app.mount("/_next", ...)` dice: *"Tutte le richieste che iniziano con `/_next/` vanno cercate nella cartella `_next/` del frontend."*

---

## 5. Avviare il server di produzione

Ora avviamo il backend — che serve anche il frontend:

```bash
cd ~/progetti/RistoranteAI/backend
fastapi dev app/main.py
```

Apri il browser su:

```
http://localhost:8000
```

Vedrai la tua applicazione Next.js — ma questa volta è FastAPI a servirla, non il server di sviluppo di Next.js.

Le API funzionano ancora allo stesso modo:

```
http://localhost:8000/api/health
```

Restituisce:

```json
{"status": "ok", "message": "Backend funzionante"}
```

### Un solo server

Il risultato finale è questo:

```
PRIMA (sviluppo):

  Browser
    ├── http://localhost:3000  →  Next.js dev server (frontend)
    └── http://localhost:8000  →  FastAPI (backend + API)


DOPO (produzione):

  Browser
    └── http://localhost:8000  →  FastAPI (backend + API + frontend)
```

Un solo URL, un solo server, tutto su una porta.

---

## 6. Il parallelo con AthenaAI

Questo è esattamente quello che fa AthenaAI in produzione. La struttura è la stessa:

| AthenaAI | RistoranteAI |
|---|---|
| `npm run assemble` esporta il frontend nella cartella statica | `npm run build` esporta il frontend in `out/` |
| I file statici finiscono in `elysia/api/static/` | I file statici finiscono in `frontend/out/` |
| FastAPI serve tutto sulla stessa porta | FastAPI serve tutto sulla stessa porta |
| Un solo URL per API e interfaccia | Un solo URL per API e interfaccia |

In AthenaAI, il comando `npm run assemble` compila il frontend Next.js e copia i file nella cartella dove FastAPI può trovarli. Poi un unico server FastAPI gestisce sia le richieste API sia le pagine dell'interfaccia.

È un pattern molto comune nelle applicazioni web: il frontend viene "montato" dentro il backend, così in produzione c'è un solo processo da gestire.

---

## 7. Il flusso completo di produzione

Ecco cosa succede quando deployiamo RistoranteAI:

```
1. Compiliamo il frontend
   npm run build
       │
       ▼
   frontend/out/     ← file HTML, CSS, JS ottimizzati
       │
       │
2. Avviamo il backend (che ora serve anche il frontend)
   fastapi dev app/main.py
       │
       ▼
   FastAPI su porta 8000
       │
       ├── GET /            → index.html (frontend)
       ├── GET /_next/*     → CSS e JS (frontend)
       ├── GET /api/health  → JSON (API)
       └── GET /api/search  → risultati (API)
```

---

## Riepilogo

In questa lezione abbiamo imparato:

| Concetto | Cosa abbiamo fatto |
|---|---|
| **Build di produzione** | Compilato il frontend in file statici ottimizzati con `npm run build` |
| **Export statico** | Configurato `output: 'export'` in `next.config.js` |
| **File statici** | Capito che la cartella `out/` contiene HTML, CSS e JS pronti |
| **FileResponse** | Usato FastAPI per servire `index.html` all'URL `/` |
| **StaticFiles** | Montato la cartella `_next/` per CSS e JavaScript |
| **Server unico** | FastAPI serve tutto — API e frontend — su una sola porta |

### Comandi usati

```bash
# Compilare il frontend
cd ~/progetti/RistoranteAI/frontend
npm run build

# Avviare il server (backend + frontend)
cd ~/progetti/RistoranteAI/backend
fastapi dev app/main.py

# Verificare nel browser
# http://localhost:8000        → interfaccia
# http://localhost:8000/api/health  → API
```

### Struttura del progetto dopo il build

```
RistoranteAI/
├── frontend/
│   ├── out/                    ← NUOVO: file di produzione
│   │   ├── index.html
│   │   ├── 404.html
│   │   └── _next/              ← CSS e JS ottimizzati
│   ├── app/
│   ├── next.config.js          ← MODIFICATO: aggiunto output: 'export'
│   └── package.json
├── backend/
│   └── app/
│       └── main.py             ← MODIFICATO: serve file statici
└── data/
    ├── menu.md
    ├── ricette.md
    └── allergeni.md
```

---

*Il corso è finito! Avete costruito un'applicazione web completa con frontend Next.js e backend FastAPI, e l'avete portata in produzione con un unico server.*
