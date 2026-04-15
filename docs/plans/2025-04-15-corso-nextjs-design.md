# Design: Corso Next.js + FastAPI

## Obiettivo

Insegnare a Simone e Leonardo le basi dello sviluppo web con Next.js 16 + FastAPI, usando come progetto formativo una versione semplificata di AthenaAI. L'obiettivo è che sappiano leggere, capire e modificare il codice di AthenaAI con consapevolezza, supportati da Claude Code.

## Progetto: RistoranteAI

Applicazione RAG che permette di interrogare documenti di testo del ristorante (menu, ricette, allergeni). Stesso tema narrativo del corso Git per coerenza.

## Stack

- Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- Backend: FastAPI + Python 3.12
- RAG: ricerca testuale su file Markdown (no Weaviate, no embeddings, no Supabase)
- Editor: Antigravity via Remote-SSH
- Coding agent: Claude Code (già installato, già esperti)

## Struttura progetto

```
RistoranteAI/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── documents/
│   │   │   └── contexts/
│   │   └── pages/
│   ├── lib/
│   ├── tailwind.config.ts
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── models.py
│   └── requirements.txt
└── data/
    ├── menu.md
    ├── ricette.md
    └── allergeni.md
```

## Lezioni (8 ore totali)

| # | Titolo | Argomento | Tempo |
|---|--------|-----------|-------|
| 0 | Setup | Ambiente, struttura progetto, avvio server | 30 min |
| 1 | Backend FastAPI | main.py, rotte REST, avvio server | 60 min |
| 2 | Frontend Next.js | App Router, layout, page, Tailwind | 60 min |
| 3 | Frontend ↔ Backend | fetch, CORS, visualizzare dati | 60 min |
| 4 | RAG su file di testo | Leggere Markdown, ricerca, endpoint /query | 60 min |
| 5 | Chat UI | Componente chat, React Context | 60 min |
| 6 | Deploy | Build produzione, servire frontend da FastAPI | 30 min |
| 7 | Riepilogo | Corrispondenza con AthenaAI, come orientarsi | 15 min |

## Principi

- Codice semplice e breve (hanno solo basi di Python)
- Nessuna autenticazione, nessun database vettoriale, nessun Docker
- Claude Code usato come strumento naturale, non come argomento didattico a sé
- Ogni lezione produce qualcosa di funzionante
