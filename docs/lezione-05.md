# Lezione 5 — Interfaccia Chat

**Tempo:** 60 minuti
**Obiettivo:** Costruire un'interfaccia chat dove l'utente scrive una domanda, il frontend la invia al backend e la risposta appare a schermo. Come WhatsApp, ma con il nostro backend RAG.

---

## 1. Il pattern della chat

Pensa a come funziona WhatsApp:

```
Tu scrivi: "Che primi avete?"
        │
        ▼
WhatsApp invia il messaggio al server
        │
        ▼
Il server elabora e risponde: "Carbonara, Amatriciana, Risotto..."
        │
        ▼
Vedi la risposta sullo schermo
```

La nostra chat fa esattamente la stessa cosa:

| Passo | Cosa succede | Codice |
|---|---|---|
| 1 | L'utente digita un messaggio | `<input>` |
| 2 | Il frontend invia al backend | `fetch("/api/query")` |
| 3 | Il backend cerca nei documenti | Lezione 4 — ricerca nei file `.md` |
| 4 | Il frontend mostra la risposta | Aggiunge il messaggio alla lista |

La differenza con una chat normale è che qui il backend **non è una persona** — è il nostro motore RAG che cerca nei file del ristorante e restituisce i risultati.

---

## 2. Il tipo Message

Ogni messaggio nella chat ha due informazioni: **chi l'ha scritto** (l'utente o il backend) e **il contenuto**. Definiamo un tipo TypeScript:

```typescript
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

- `role: "user"` — messaggio scritto dall'utente (allineato a destra)
- `role: "assistant"` — risposta del backend (allineata a sinistra)

La conversazione è un array di messaggi:

```typescript
const conversazione: Message[] = [
  { role: "user", content: "Che primi avete?" },
  { role: "assistant", content: "Abbiamo: Carbonara, Amatriciana, Risotto ai funghi, Lasagne." },
  { role: "user", content: "E la carbonara ha le uova?" },
  { role: "assistant", content: "Sì, la Carbonara contiene uova, guanciale e pecorino." },
];
```

---

## 3. ChatContext: gestire lo stato della chat

In React, quando più componenti devono condividere gli stessi dati, si usa un **Context** — un "contenitore" di dati accessibile da qualsiasi componente figlio.

È come una lavagna in una stanza: chiunque nella stanza può leggere e scrivere sulla lavagna.

Crea la cartella `frontend/app/contexts/` e il file `ChatContext.tsx`:

```bash
mkdir -p app/contexts
```

`frontend/app/contexts/ChatContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Message = { role: "user" | "assistant"; content: string };

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  loading: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/query?q=" + encodeURIComponent(text));
      const data = await res.json();
      const botMsg: Message = { role: "assistant", content: data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = { role: "assistant", content: "Errore: impossibile contattare il backend." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage, loading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat deve essere usato dentro ChatProvider");
  return ctx;
}
```

Analizziamo riga per riga:

| Riga | Cosa fa |
|---|---|
| `createContext(...)` | Crea il "contenitore" per i dati condivisi |
| `useState<Message[]>([])` | L'array dei messaggi, inizialmente vuoto |
| `useState(false)` | Flag per mostrare "sta scrivendo..." mentre il backend elabora |
| `sendMessage(text)` | Aggiunge il messaggio dell'utente, chiama il backend, aggiunge la risposta |
| `[...prev, userMsg]` | Crea un nuovo array con tutti i messaggi precedenti più quello nuovo |
| `try/catch` | Se il backend non risponde, mostra un messaggio di errore |
| `finally` | In ogni caso, togli il flag "sta caricando" |
| `useChat()` | Funzione di comodo per leggere il context dai componenti figli |

### Perché `[...prev, userMsg]` e non `messages.push(userMsg)`?

In React **non si modifica mai lo stato direttamente**. Si crea una **copia nuova** dell'array con il nuovo elemento aggiunto. L'operatore spread `...` copia tutti gli elementi di `prev`, poi aggiungiamo `userMsg` alla fine. React rileva il cambiamento e aggiorna lo schermo.

È come in Python quando fai `lista_nuova = lista_vecchia + [elemento]` invece di `lista_vecchia.append(elemento)`.

---

## 4. ChatComponent: l'interfaccia visiva

Ora creiamo il componente che mostra la conversazione e permette di inviare messaggi.

Crea il file `frontend/app/components/ChatComponent.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useChat } from "../contexts/ChatContext";

export default function ChatComponent() {
  const { messages, sendMessage, loading } = useChat();
  const [input, setInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  }

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-gray-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            Fai una domanda sul ristorante...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-center text-gray-400 text-sm">Sta scrivendo...</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-gray-300">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 px-4 py-3 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Invia
        </button>
      </form>
    </div>
  );
}
```

Analizziamo le parti principali:

### La lista messaggi

```tsx
{messages.map((msg, i) => (
  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
```

- `messages.map(...)` — scorre ogni messaggio e crea un elemento per ciascuno
- `justify-end` / `justify-start` — allinea a destra i messaggi dell'utente, a sinistra le risposte
- `bg-blue-600` per l'utente, `bg-gray-100` per il backend — come i fumetti bianchi e azzurri di WhatsApp

### Il form di input

```tsx
<form onSubmit={handleSubmit}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit">Invia</button>
</form>
```

- `value={input}` — l'input mostra il valore della variabile `input`
- `onChange` — ogni volta che l'utente digita un carattere, aggiorna la variabile
- `onSubmit` — quando l'utente preme Invio o clicca "Invia", esegue `handleSubmit`

### handleSubmit

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();           // evita che la pagina si ricarichi
  if (!input.trim() || loading) return;  // ignora messaggi vuoti
  const text = input;           // salva il testo
  setInput("");                 // svuota il campo
  await sendMessage(text);      // invia al backend
}
```

Salviamo il testo in `text` prima di svuotare `input` perché `setInput("")` è asincrono — la variabile `input` non si svuota subito, ma alla riga successiva potrebbe essere già vuota.

### Le classi Tailwind usate

| Classe | Effetto |
|---|---|
| `h-[500px]` | Altezza fissa di 500 pixel |
| `flex-col` | Dispone gli elementi in colonna |
| `overflow-y-auto` | Aggiunge la scrollbar verticale quando serve |
| `space-y-3` | Spazio verticale tra i messaggi |
| `max-w-[75%]` | Larghezza massima del fumetto: 75% dello spazio |
| `rounded-lg` | Bordi arrotondati |
| `border-t` | Linea separatrice sopra il form |
| `outline-none` | Rimuove il contorno dal campo input |
| `disabled:opacity-50` | Il pulsante diventa semi-trasparente se disabilitato |

---

## 5. Integrare la chat nella pagina principale

Ora colleghiamo tutto. Apri `frontend/app/page.tsx`:

```tsx
import { ChatProvider } from "./contexts/ChatContext";
import ChatComponent from "./components/ChatComponent";
import DocumentList from "./components/DocumentList";
import HealthStatus from "./components/HealthStatus";

export default function Home() {
  return (
    <ChatProvider>
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="mb-6 text-3xl font-bold">RistoranteAI</h1>
        <div className="mb-6 flex gap-4">
          <HealthStatus />
          <DocumentList />
        </div>
        <ChatComponent />
      </main>
    </ChatProvider>
  );
}
```

Presta attenzione all'ordine:

1. `ChatProvider` avvolge tutto — rende il context disponibile a tutti i figli
2. `ChatComponent` sta dentro `ChatProvider` — quindi può usare `useChat()`
3. `HealthStatus` e `DocumentList` restano come nella Lezione 3

### Come passano i dati

```
ChatProvider (gestisce messaggi, loading, sendMessage)
  │
  ├── <h1>RistoranteAI</h1>
  ├── <HealthStatus />      ← non usa il context
  ├── <DocumentList />      ← non usa il context
  └── <ChatComponent />     ← usa useChat() per leggere/inviare messaggi
```

Qualsiasi componente dentro `ChatProvider` può chiamare `useChat()` per accedere ai messaggi e a `sendMessage`. Se un componente fuori dal provider provasse a usarlo, riceverebbe un errore.

---

## 6. Verifica che funzioni

Assicurati che entrambi i server siano in esecuzione:

```bash
# Terminale 1 — Backend
cd ~/progetti/RistoranteAI/backend
source .venv/bin/activate
fastapi dev app/main.py

# Terminale 2 — Frontend
cd ~/progetti/RistoranteAI/frontend
npm run dev
```

Apri `http://localhost:3000` nel browser. Dovresti vedere:

1. L'intestazione "RistoranteAI"
2. Lo stato del backend e la lista dei documenti
3. L'area chat con il messaggio "Fai una domanda sul ristorante..."

Prova a digitare: **"Quali primi avete?"** e premi Invio.

Il flusso sarà:

```
Scrivi "Quali primi avete?"
  → ChatComponent chiama sendMessage()
    → ChatContext aggiunge il messaggio utente allo stato
      → React aggiorna lo schermo (fumetto blu a destra)
        → fetch("/api/query?q=Quali primi avete?")
          → Backend cerca nei file .md
            → Backend risponde con JSON
              → ChatContext aggiunge la risposta dello assistant
                → React aggiorna lo schermo (fumetto grigio a sinistra)
```

Se qualcosa non funziona:

| Problema | Causa probabile | Soluzione |
|---|---|---|
| "Errore: impossibile contattare il backend" | Il backend non è avviato | Avvia `fastapi dev app/main.py` |
| La chat non appare | Context non collegato | Verifica che `ChatProvider` avvolga tutto in `page.tsx` |
| La risposta è vuota | L'endpoint `/api/query` non esiste ancora | Verifica la Lezione 4 — il backend deve avere quell'endpoint |
| Errore CORS | CORS non configurato nel backend | Verifica la Lezione 3 — `CORSMiddleware` in `main.py` |

---

## 7. Come si collega ad AthenaAI

Tutto quello che abbiamo costruito oggi esiste anche in AthenaAI, ma in una versione più complessa:

| RistoranteAI (noi) | AthenaAI (produzione) |
|---|---|
| `ChatContext` con `useState` | Store globale più complesso |
| `fetch()` per ogni messaggio | **WebSocket** per streaming in tempo reale |
| Array `Message[]` con `role` | Stesso concetto, più metadati |
| Singola chat | Più chat, cronologia, autenticazione |
| Ricerca testuale su `.md` | Embeddings su database vettoriale (Weaviate) |
| Il backend risponde subito | Il backend streamma la risposta parola per parola |

### Perché WebSocket?

Con `fetch()` il backend elabora tutto e restituisce la risposta intera. Se la risposta è lunga, l'utente vede "Sta scrivendo..." per parecchi secondi.

Con **WebSocket** il backend può inviare la risposta **pezzo per pezzo** — come quando vedi ChatGPT che scrive parola per parola. È un canale di comunicazione bidirezionale che resta aperto tra frontend e backend.

Nel file `elysia-frontend` di AthenaAI, il componente `ChatPage` fa esattamente quello che abbiamo costruito noi, ma si collega via WebSocket per ricevere le risposte in streaming. Il pattern è lo stesso: messaggi in un array, input in basso, invio al backend.

La nostra versione con `fetch` è più semplice ma il concetto è identico. Quando capirete il codice di RistoranteAI, riconoscerete subito lo stesso pattern in AthenaAI.

---

## 8. Struttura del progetto ora

```
frontend/
├── app/
│   ├── components/
│   │   ├── ChatComponent.tsx    ←  L'interfaccia chat (nuovo)
│   │   ├── DocumentList.tsx     ←  Lista documenti (Lezione 3)
│   │   └── HealthStatus.tsx     ←  Stato backend (Lezione 3)
│   ├── contexts/
│   │   └── ChatContext.tsx      ←  Stato condiviso della chat (nuovo)
│   ├── layout.tsx
│   ├── page.tsx                 ←  Home con chat integrata
│   └── globals.css
├── tailwind.config.ts
└── package.json
```

---

## Riepilogo

In questa lezione abbiamo imparato:

| Concetto | Cosa fa |
|---|---|
| **Context** (`createContext`) | Condivide dati tra componenti senza passare props a mano |
| **Provider** | Il componente che avvolge e rende disponibili i dati del context |
| **`useContext`** | Il hook che legge i dati dal context |
| **`[...prev, nuovo]`** | Pattern per aggiungere elementi a un array di stato |
| **Form controllato** | Input collegato allo stato tramite `value` e `onChange` |
| **`e.preventDefault()`** | Impedisce al form di ricaricare la pagina |

Il flusso completo della chat:

```
Utente digita → handleSubmit() → sendMessage()
  → aggiunge messaggio utente (fumetto blu)
  → fetch("/api/query?q=...")
  → aggiunge risposta assistant (fumetto grigio)
```

---

## Prossima lezione

Nella [Lezione 6](lezione-06.md) prepareremo l'applicazione per la produzione: build del frontend e deploy.
