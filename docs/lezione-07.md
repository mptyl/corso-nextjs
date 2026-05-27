# Lezione 7 — Riepilogo: Da RistoranteAI a AthenaAI

**Tempo:** 15 minuti
**Obiettivo:** Collegare quello che abbiamo costruito con il progetto vero (AthenaAI), sapere dove mettere le mani e come lavorare con Claude Code.

---

## 1. RistoranteAI vs AthenaAI: stessa idea, scala diversa

In questo corso avete costruito **RistoranteAI**, un'app semplificata. Il progetto vero su cui lavorerete si chiama **AthenaAI**. L'architettura è la stessa — cambia la complessità.

| RistoranteAI | AthenaAI | Ruolo |
|---|---|---|
| `frontend/` | `elysia-frontend/` | Interfaccia utente (Next.js) |
| `backend/` | `elysia/` | API e logica (FastAPI) |
| `data/*.md` | Weaviate | Dati / conoscenza |
| `search_documents()` | Tree + Tools | Ricerca nelle risposte |
| `fetch("/api/query")` | WebSocket `/ws/query` | Comunicazione frontend↔backend |
| `ChatComponent` | `ChatPage` | Interfaccia chat |

La differenza principale: RistoranteAI legge file di testo. AthenaAI usa un **database vettoriale** (Weaviate) e un sistema di **tools** più complesso. Ma il flusso è identico — l'utente chiede, il backend cerca, il frontend mostra.

---

## 2. Dove guardare in AthenaAI

Quando aprite il repository, partite da questi file:

| File | Cosa fa |
|---|---|
| `elysia/api/app.py` | L'app FastAPI principale (come il nostro `main.py`) |
| `elysia-frontend/app/page.tsx` | Il router principale delle pagine |
| `elysia-frontend/app/components/chat/` | I componenti della chat |
| `elysia-frontend/app/components/contexts/` | I contesti React (state management) |
| `elysia-frontend/app/layout.tsx` | Il layout root con tutti i provider |

---

## 3. Dove mettere le mani

Avere una mappa vi fa risparmiare tempo. Ogni volta che dovete cambiare qualcosa, sapete già dove andare:

**Voglio cambiare l'interfaccia?**
→ `elysia-frontend/app/components/`

**Voglio cambiare un endpoint API?**
→ `elysia/api/routes/`

**Voglio cambiare come vengono cercati i dati?**
→ `elysia/tools/`

**Voglio aggiungere una nuova pagina?**
→ Create il file in `elysia-frontend/app/pages/` e aggiungetelo al `RouterContext`

---

## 4. Usare Claude Code su AthenaAI

Claude Code è il vostro assistente di programmazione. È bravo, ma ha bisogno di contesto. Seguite queste regole:

**Leggete il file prima di chiedere modifiche.** Se volete cambiare un componente, apritelo e leggetelo. Poi dite a Claude cosa avete visto e cosa volete cambiare.

**Date contesto.** Invece di "cambia questa funzione", dite:

> Questo è un endpoint FastAPI in `elysia/api/routes/query.py`. Voglio aggiungere un parametro `limit` alla funzione `search`.

**Chiedete cambiamenti piccoli.** Una cosa alla volta. Non chiedete "riscrivi tutta la chat" — chiedete "aggiungi un pulsante per cancellare la cronologia".

**Verificate sempre.** Dopo ogni modifica, avviate il dev server e testate:

```bash
# Backend
cd elysia && python -m uvicorn api.app:app --reload

# Frontend
cd elysia-frontend && npm run dev
```

---

## 5. Risorse per continuare

Quello che avete imparato qui è reale — sono le stesse tecnologie usate nel mondo del lavoro. Per approfondire:

- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs) — la documentazione ufficiale, ben scritta
- **FastAPI:** [fastapi.tiangolo.com](https://fastapi.tiangolo.com) — tutorial eccellente, parte dalle basi
- **React:** [react.dev/learn](https://react.dev/learn) — guida interattiva ufficiale
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs) — cercate la classe che vi serve
- **TypeScript:** [typescript-lang.org/docs](https://www.typescriptlang.org/docs/) — per capire i tipi

---

## Riepilogo del corso

In 7 lezioni avete imparato a:

0. **Setup** — Ambiente e struttura del progetto
1. **Backend** — FastAPI e le prime API
2. **Frontend** — Next.js, React e Tailwind
3. **Collegare Frontend e Backend** — CORS, fetch e dati a schermo
4. **RAG** — Ricerca testuale all'interno dei documenti
5. **Interfaccia Chat** — React context e layout conversazionale
6. **Deploy** — Compilazione statica e server unificato
7. **Riepilogo** — Collegamento tra RistoranteAI e AthenaAI

Ora sapete dove mettere le mani. Buon lavoro.
