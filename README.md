# Corso: Next.js + FastAPI — Il Progetto RistoranteAI

**Durata:** ~8 ore | **Livello:** Base | **Prerequisiti:** Basi di Python, corso Git/GitHub completato

---

## Introduzione

Questo corso insegna le basi dello sviluppo web con **Next.js 16** (frontend) e **FastAPI** (backend), costruendo una mini-applicazione RAG ispirata ad AthenaAI.

Simone e Leonardo lavorano sullo stesso server Linux usato nel corso Git, usando Antigravity via Remote-SSH e Claude Code come coding agent.

Il progetto formativo è **RistoranteAI**: un'applicazione che permette di interrogare documenti di testo del ristorante (menu, ricette, allergeni) tramite una chat.

## Indice

| # | Lezione | Argomento | Tempo |
|---|---------|-----------|-------|
| 0 | [Setup](docs/lezione-00.md) | Ambiente, struttura progetto | 30 min |
| 1 | [Backend FastAPI](docs/lezione-01.md) | Rotte REST, avvio server | 60 min |
| 2 | [Frontend Next.js](docs/lezione-02.md) | App Router, React, Tailwind | 60 min |
| 3 | [Frontend ↔ Backend](docs/lezione-03.md) | fetch, CORS, visualizzare dati | 60 min |
| 4 | [RAG su file di testo](docs/lezione-04.md) | Ricerca nei documenti | 60 min |
| 5 | [Chat UI](docs/lezione-05.md) | Componente chat con React | 60 min |
| 6 | [Deploy](docs/lezione-06.md) | Build produzione | 30 min |
| 7 | [Riepilogo](docs/lezione-07.md) | Corrispondenza con AthenaAI | 15 min |

**Totale:** ~7,5 ore

## Stack tecnologico

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python 3.12
- **RAG:** ricerca testuale su file Markdown (no Weaviate)
- **Editor:** Antigravity via Remote-SSH
- **Coding agent:** Claude Code

## Build & Preview

```bash
pip install -r requirements.txt
mkdocs serve
```
