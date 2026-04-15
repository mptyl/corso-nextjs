# Lezione 2 — Frontend: Next.js, React e Tailwind

**Obiettivo:** Creare il frontend del progetto RistoranteAI | **Tempo stimato:** 60 minuti

## Ripasso rapido

Nella Lezione 1 abbiamo costruito il **backend** con FastAPI: il "cucina" del nostro ristorante che prepara i dati (menu, ricette, allergeni). Ma un ristorante ha bisogno anche di una sala dove i clienti si siedono, leggono il menu e fanno le ordinazioni. Quella sala è il **frontend**.

```
RistoranteAI
┌──────────────────────────────────────────────────┐
│                                                  │
│   Frontend (Next.js)     Backend (FastAPI)       │
│   ┌──────────────┐      ┌──────────────┐        │
│   │  Sala del     │      │  Cucina      │        │
│   │  ristorante   │─────►│              │        │
│   │              ◄──────│              │        │
│   └──────────────┘      └──────────────┘        │
│   Porta 3000             Porta 8000              │
└──────────────────────────────────────────────────┘
```

Oggi costruiamo la sala.

---

## Indice

1. [Cos'è Next.js](#1-cosè-nextjs)
2. [Creare il progetto Next.js](#2-creare-il-progetto-nextjs)
3. [Struttura del progetto](#3-struttura-del-progetto)
4. [La nostra prima pagina](#4-la-nostra-prima-pagina)
5. [Avviare il server di sviluppo](#5-avviare-il-server-di-sviluppo)
6. [Concetti chiave](#6-concetti-chiave)
7. [Creare un componente](#7-creare-un-componente)

---

## 1. Cos'è Next.js

**Next.js** è un framework per costruire interfacce web. Si basa su **React**, una libreria JavaScript creata da Facebook per costruire pagine web interattive.

Proviamo con un'analogia:

| Concetto | Analogia al ristorante |
|---|---|
| **HTML** | I muri e i pavimenti della sala — la struttura |
| **CSS** | La pittura, i tavoli, le decorazioni — l'aspetto |
| **JavaScript** | I camerieri che si muovono — l'interattività |
| **React** | Un sistema per organizzare i camerieri in modo efficiente |
| **Next.js** | Il gestore del ristorante che organizza tutto — routing, ottimizzazione, struttura |
| **Tailwind CSS** | Un catalogo di arredamento pronto all'uso — classi CSS già pronte |

In pratica: **Next.js ci permette di scrivere pagine web usando React, senza dover configurare tutto da zero.**

---

## 2. Creare il progetto Next.js

Apri il terminale e lancia questo comando:

```bash
cd ~/progetti/RistoranteAI
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src=no --import-alias="@/*" --no-turbopack
```

> **Nota:** `npx` è come `pip` ma per JavaScript: scarica ed esegue un pacchetto senza installarlo globalmente.

Il comando crea una cartella `frontend/` con tutto il necessario. Ci vorrà circa un minuto.

Quando ha finito, entra nella cartella:

```bash
cd frontend
```

---

## 3. Struttura del progetto

Ecco cosa è stato creato dentro `frontend/`:

```
frontend/
├── app/
│   ├── layout.tsx      ←  Il "guscio" di ogni pagina (la cornice del quadro)
│   ├── page.tsx        ←  La pagina principale (il quadro)
│   └── globals.css     ←  Stili globali (colori, font)
├── public/             ←  File statici (immagini, icone)
├── tailwind.config.ts  ←  Configurazione di Tailwind CSS
├── package.json        ←  Dipendenze del progetto (come requirements.txt)
└── tsconfig.json       ←  Configurazione di TypeScript
```

I tre file più importanti da capire:

| File | A cosa serve | Analogia |
|---|---|---|
| `app/layout.tsx` | Avvolge tutte le pagine. Contiene tag `<html>` e `<body>`. | La cornice del quadro — uguale per ogni pagina |
| `app/page.tsx` | È la home page del sito. | Il quadro vero e proprio |
| `app/globals.css` | Stili CSS applicati a tutto il sito. | Il colore delle pareti della sala |

### I file `.tsx`

L'estensione `.tsx` significa **TypeScript + JSX**. È come un file TypeScript che può contenere anche codice HTML. Ne parleremo tra poco.

---

## 4. La nostra prima pagina

Apri `app/page.tsx` e sostituisci **tutto** il contenuto con questo:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-900">
        RistoranteAI
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Il tuo assistente per il menu del ristorante
      </p>
    </main>
  )
}
```

Analizziamolo riga per riga:

| Riga | Spiegazione |
|---|---|
| `export default function Home()` | Dichiara una funzione chiamata `Home`. `export default` la rende la pagina principale. |
| `return (` | La funzione "restituisce" l'interfaccia visiva. |
| `<main>` | Tag HTML come quello che conosci. Ma con una particolarità... |
| `className="..."` | È l'equivalente di `class="..."` in HTML. In JSX si usa `className`. |
| `flex`, `items-center`, ecc. | Sono classi Tailwind CSS — dettagliamo sotto. |
| `<h1>`, `<p>` | Tag HTML normali. Niente di nuovo. |

### Le classi Tailwind CSS

Tailwind è un modo per stilizzare senza scrivere CSS a mano. Ogni classe fa una cosa precisa:

| Classe | Effetto |
|---|---|
| `min-h-screen` | Altezza minima = schermo intero |
| `flex flex-col` | Dispone gli elementi in colonna |
| `items-center` | Centra orizzontalmente |
| `justify-center` | Centra verticalmente |
| `bg-white` | Sfondo bianco |
| `text-4xl` | Testo molto grande |
| `font-bold` | Testo grassetto |
| `text-gray-900` | Colore del testo: grigio scuro |
| `mt-4` | Margine sopra (margin-top) |
| `text-lg` | Testo grande |
| `text-gray-600` | Colore del testo: grigio medio |

> **Il trucco:** Con Tailwind, costruisci l'aspetto visivo direttamente nell'HTML, senza file CSS separati. È come avere un Lego dove ogni pezzo ha una funzione precisa.

---

## 5. Avviare il server di sviluppo

Lancia questo comando dentro la cartella `frontend/`:

```bash
npm run dev
```

Questo avvia un server locale sulla porta **3000**. Apri il browser e vai a:

```
http://localhost:3000
```

Dovresti vedere la pagina con "RistoranteAI" e il sottotitolo.

> **Nota:** Il server si aggiorna da solo quando salvi un file. Non devi riavviarlo ogni volta. Prova a cambiare il testo in `page.tsx` e salva: il browser si aggiorna automaticamente.

Per fermare il server: premi `Ctrl + C` nel terminale.

---

## 6. Concetti chiave

### JSX — HTML con poteri speciali

In Next.js non scriviamo HTML separato da JavaScript. Scriviamo **JSX**: HTML dentro il JavaScript.

```tsx
// Questo NON è HTML puro. È JSX.
<h1 className="text-4xl">Ciao</h1>
```

Le differenze principali con l'HTML:

| HTML | JSX |
|---|---|
| `class="..."` | `className="..."` |
| `<img src="...">` (self-closing opzionale) | `<img src="..." />` (self-closing obbligatorio) |
| Attributi in minuscolo | Alcuni cambiano: `onclick` → `onClick` |
| Valori statici | Puoi inserire variabili JavaScript con `{}` |

Ecco un esempio di "poteri speciali" — usare variabili dentro l'HTML:

```tsx
export default function Home() {
  const nome = "Simone"

  return (
    <main>
      <h1>Ciao, {nome}!</h1>
    </main>
  )
}
```

Le parentesi graffe `{}` dicono a React: "qui dentro c'è codice JavaScript, non testo".

### Componenti — Mattoni riutilizzabili

Un **componente** è una funzione che restituisce JSX. Niente di più.

```tsx
function Saluto() {
  return <p>Ciao!</p>
}
```

Puoi usare un componente dentro un altro, come se fosse un tag HTML:

```tsx
export default function Home() {
  return (
    <main>
      <Saluto />
      <h1>RistoranteAI</h1>
    </main>
  )
}
```

La regola: **il nome del componente inizia con la maiuscola**. Se inizia con la minuscola, React lo interpreta come un tag HTML normale.

### Props — Dati passati a un componente

Le **props** sono come gli argomenti di una funzione Python:

```python
# In Python
def saluta(nome):
    print(f"Ciao, {nome}!")
```

```tsx
// In React
function Saluto({ nome }: { nome: string }) {
  return <p>Ciao, {nome}!</p>
}

// Si usa così:
<Saluto nome="Simone" />
```

Le parentesi graffe nella definizione `{ nome }` sono un **destrutturazione** — equivalente a dire "dall'oggetto props, estrai la proprietà nome". Non preoccuparti troppo della sintassi `{ nome: string }`: è TypeScript che dice "nome è una stringa".

### App Router — Come funziona il routing

Next.js usa il file system come router. In pratica:

| File | URL |
|---|---|
| `app/page.tsx` | `/` (home page) |
| `app/menu/page.tsx` | `/menu` |
| `app/contatti/page.tsx` | `/contatti` |

Ogni cartella dentro `app/` diventa un percorso nell'URL. Il file `page.tsx` dentro quella cartella è la pagina mostrata. Non devi configurare nulla: basta creare la cartella e il file.

---

## 7. Creare un componente

Ora creiamo un componente per mostrare le informazioni del ristorante. Crea la cartella `components` dentro `app/` e poi il file:

```bash
mkdir app/components
```

Crea il file `app/components/RistoranteCard.tsx`:

```tsx
export default function RistoranteCard({
  titolo,
  descrizione,
}: {
  titolo: string
  descrizione: string
}) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{titolo}</h2>
      <p className="mt-2 text-gray-600">{descrizione}</p>
    </div>
  )
}
```

Analisi del componente:

- **`titolo`** e **`descrizione`** sono props — dati che passiamo da fuori
- `<div className="max-w-sm ...">` crea un contenitore con: larghezza massima, bordi arrotondati, bordo sottile, padding interno e ombra leggera
- `{titolo}` e `{descrizione}` inseriscono le props nel JSX

Ora modifichiamo `app/page.tsx` per usare questo componente:

```tsx
import RistoranteCard from "./components/RistoranteCard"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">RistoranteAI</h1>
      <p className="mt-4 text-lg text-gray-600">
        Il tuo assistente per il menu del ristorante
      </p>
      <div className="mt-8 flex gap-6">
        <RistoranteCard
          titolo="Menu"
          descrizione="Scopri i piatti del nostro ristorante"
        />
        <RistoranteCard
          titolo="Ricette"
          descrizione="Le ricette dei nostri piatti tipici"
        />
        <RistoranteCard
          titolo="Allergeni"
          descrizione="Informazioni su allergeni e intolleranze"
        />
      </div>
    </main>
  )
}
```

Salva e controlla il browser. Dovresti vedere tre card affiancate sotto il titolo.

> **Nota:** Se il server `npm run dev` è ancora in esecuzione, la pagina si aggiorna da sola. Altrimenti rilancialo.

### Come funziona `import`

```tsx
import RistoranteCard from "./components/RistoranteCard"
```

È come `from ... import ...` in Python, ma con un percorso relativo al file:

| Python | TypeScript/JSX |
|---|---|
| `from app.models import User` | `import User from "./app/models"` |
| `import requests` | `import axios from "axios"` |

Il punto in `"./components/..."` significa "a partire dalla cartella dove si trova questo file".

---

## Riepilogo

In questa lezione hai imparato:

| Concetto | Cosa hai fatto |
|---|---|
| **Next.js** | Creato un progetto con `create-next-app` |
| **JSX** | Scritto HTML dentro TypeScript — "HTML con poteri speciali" |
| **Tailwind CSS** | Stilizzato con classi come `flex`, `text-xl`, `bg-white` |
| **Componenti** | Creato `RistoranteCard` — una funzione che restituisce JSX |
| **Props** | Passato dati a un componente (`titolo`, `descrizione`) |
| **App Router** | Capito che ogni cartella in `app/` diventa un percorso URL |

### Struttura del progetto ora

```
frontend/
├── app/
│   ├── components/
│   │   └── RistoranteCard.tsx   ←  Il nostro primo componente
│   ├── layout.tsx
│   ├── page.tsx                 ←  Home page con tre card
│   └── globals.css
├── tailwind.config.ts
└── package.json
```

---

> **Prossima lezione:** Collegare il frontend al backend — faremo in modo che le card mostrino dati veri provenienti da FastAPI.
