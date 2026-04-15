# Lezione 0 — Setup: Ambiente e struttura del progetto

**Obiettivo:** Preparare l'ambiente di lavoro, creare la struttura del progetto RistoranteAI | **Tempo stimato:** 30 minuti

## Il corso in breve

Questo corso insegna a costruire un'applicazione web moderna con **Next.js 16** (frontend) e **FastAPI** (backend). Non serve essere programmatori esperti — basta sapere le basi di Python.

Il progetto si chiama **RistoranteAI**: una versione semplificata di AthenaAI che permette di interrogare i documenti del ristorante (menu, ricette, allergeni) tramite una semplice ricerca testuale. Stesso tema del corso Git che avete già fatto — ma qui costruiamo un'applicazione vera, non solo documenti di testo.

**L'architettura:**

```
Browser (utente)
    │
    ▼
┌─────────────────────────┐
│  Next.js (port 3000)    │  ← Frontend: interfaccia grafica
│  React + Tailwind CSS   │     l'utente vede e clicca qui
└───────────┬─────────────┘
            │ HTTP (fetch)
            ▼
┌─────────────────────────┐
│  FastAPI (port 8000)    │  ← Backend: logica e dati
│  Python 3.12            │     legge i file, cerca, risponde
└───────────┬─────────────┘
            │ legge file .md
            ▼
┌─────────────────────────┐
│  data/                  │  ← Documenti del ristorante
│  ├── menu.md            │
│  ├── ricette.md         │
│  └── allergeni.md       │
└─────────────────────────┘
```

Due server separati che comunicano via HTTP. Il frontend fa richieste al backend, il backend legge i file e risponde con i dati. Niente database, niente embeddings, niente Docker — solo file di testo e codice semplice.

**L'ambiente di lavoro:**

- **Server Linux** condiviso, accessibile tramite SSH. Simone e Leonardo hanno ciascuno il proprio account Linux sul server.
- **Antigravity** — un IDE derivato da VS Code — collegato al server tramite **Remote-SSH**. Il PC locale serve solo per eseguire Antigravity; tutto il lavoro avviene sul server.
- **Claude Code** — già installato sul server — come coding agent. Lo useremo per generare e modificare codice durante il corso.

> **Per chi ha fatto il corso Git:** Tutto quello che avete imparato su Git, branch, commit e Pull Request vale anche qui. Il progetto RistoranteAI avrà il suo repository GitHub.

---

## Indice

1. [Verifica prerequisiti](#01-verifica-prerequisiti)
2. [Creare la struttura del progetto](#02-creare-la-struttura-del-progetto)
3. [Creare i documenti del ristorante](#03-creare-i-documenti-del-ristorante)
4. [Inizializzare Git e pubblicare su GitHub](#04-inizializzare-git-e-pubblicare-su-github)
5. [Come comunicano frontend e backend](#05-come-comunicano-frontend-e-backend)

---

## 0.1 Verifica prerequisiti

Prima di iniziare, verifichiamo che tutto il necessario sia installato sul server. Apri il terminale di Antigravity (`Ctrl+`` `) e lancia questi comandi:

```bash
node --version
```

Deve restituire **v20.x.x** o superiore. Node.js è il runtime che esegue il codice JavaScript del frontend Next.js.

```bash
python3 --version
```

Deve restituire **Python 3.12.x** o superiore. Python è il linguaggio del backend FastAPI.

```bash
npm --version
```

Deve restituire un numero di versione. `npm` è il gestore pacchetti di Node — serve per installare le librerie del frontend.

```bash
git --version
```

Deve restituire un numero di versione. Git lo conoscete già dal corso precedente.

```bash
gh --version
```

Deve restituire un numero di versione. GitHub CLI serve per creare il repository da terminale.

### Risultato atteso

```
$ node --version
v20.11.0

$ python3 --version
Python 3.12.2

$ npm --version
10.2.4

$ git --version
git version 2.43.0

$ gh --version
gh version 2.42.1
```

Se qualche comando non funziona (errore "command not found"), chiedi all'amministratore del server di installare il pacchetto mancante. **Non proseguire senza aver verificato tutto.**

---

## 0.2 Creare la struttura del progetto

Simone crea la cartella del progetto e tutta la struttura necessaria. Dal terminale:

```bash
mkdir -p ~/progetti/RistoranteAI/frontend
mkdir -p ~/progetti/RistoranteAI/backend/app
mkdir -p ~/progetti/RistoranteAI/data
```

Il flag `-p` crea tutte le cartelle intermedie se non esistono. Per esempio `mkdir -p backend/app` crea sia `backend` sia `app` dentro `backend`.

Entriamo nella cartella del progetto:

```bash
cd ~/progetti/RistoranteAI
```

Da qui in poi, tutti i comandi si eseguono dentro questa cartella.

Verifichiamo la struttura:

```bash
find . -type d | sort
```

Deve restituire:

```
.
./backend
./backend/app
./data
./frontend
```

### Cosa contiene ogni cartella

| Cartella | Cosa conterrà |
|---|---|
| `frontend/` | Il progetto Next.js — l'interfaccia grafica che l'utente vede nel browser |
| `backend/` | Il progetto FastAPI — il server Python che gestisce la logica |
| `backend/app/` | Il codice Python del backend (file `.py`) |
| `data/` | I documenti del ristorante in formato Markdown |

Per ora le cartelle sono vuote — le riempiremo nelle prossime lezioni. Oggi creiamo solo i file di dati.

---

## 0.3 Creare i documenti del ristorante

La cartella `data/` conterrà i file di testo su cui il nostro sistema farà le ricerche. Sono file Markdown — lo stesso formato che avete usato nel corso Git.

### Il menu

Crea il file `data/menu.md` con questo contenuto. Puoi usare Antigravity (tasto destro sulla cartella `data` → New File) oppure il terminale:

```bash
cat > data/menu.md << 'EOF'
# Menu — Ristorante Da Luigi

## Antipasti

- **Bruschetta al pomodoro** — €6
  Pane tostato con pomodorini freschi, aglio e basilico
- **Caprese** — €7
  Mozzarella di bufala, pomodoro, olio extravergine
- **Carpaccio di manzo** — €9
  Fettine sottili di manzo con rucola e scaglie di parmigiano

## Primi

- **Spaghetti alla Carbonara** — €10
  Guanciale, uova, pecorino romano, pepe nero
- **Bucatini all'Amatriciana** — €10
  Guanciale, pomodoro, pecorino romano
- **Risotto ai funghi porcini** — €12
  Riso carnaroli, funghi porcini freschi, parmigiano
- **Lasagne della Nonna** — €11
  Pasta fresca, ragù di carne, besciamella, parmigiano

## Secondi

- **Cotoletta alla Milanese** — €12
  Cotoletta di vitello impanata e fritta
- **Pesce Spada alla Griglia** — €14
  Pesce spada locale con contorno di verdure
- **Ossobuco** — €13
  Ossobuco di vitello brasato con gremolata

## Pizze

- **Margherita** — €7
  Pomodoro, mozzarella, basilico
- **Diavola** — €8
  Pomodoro, mozzarella, salame piccante
- **Quattro Formaggi** — €9
  Mozzarella, gorgonzola, parmigiano, fontina

## Dolci

- **Tiramisù** — €6
  Savoiardi, mascarpone, caffè, cacao
- **Panna Cotta** — €5
  Panna cotta con coulis di frutti di bosco
- **Cannolo Siciliano** — €5
  Cialda croccante, ricotta, gocce di cioccolato
EOF
```

### Le ricette

```bash
cat > data/ricette.md << 'EOF'
# Ricette — Ristorante Da Luigi

## Spaghetti alla Carbonara

**Tempo:** 20 minuti | **Porzioni:** 4

**Ingredienti:**
- 400g spaghetti
- 200g guanciale
- 4 tuorli d'uovo
- 100g pecorino romano grattugiato
- Pepe nero q.b.

**Procedimento:**
Tagliare il guanciale a listarelle e farlo rosolare in padella senza olio finché diventa croccante. In una ciotola sbattere i tuorli con il pecorino e abbondante pepe nero. Scolare la pasta al dente e versarla nella padella con il guanciale (fuoco spento). Aggiungere il composto di uova e pecorino, mescolare velocemente. Il calore della pasta cuocerà le uova senza farle strapazzare.

## Pizza Margherita

**Tempo:** 90 minuti (inclusa lievitazione) | **Porzioni:** 1

**Ingredienti per l'impasto:**
- 250g farina 00
- 150ml acqua tiepida
- 3g lievito di birra fresco
- 5g sale
- 1 cucchiaio olio extravergine

**Ingredienti per la farcitura:**
- 100g passata di pomodoro
- 125g mozzarella fiordilatte
- Foglie di basilico fresco

**Procedimento:**
Sciogliere il lievito nell'acqua tiepida. Impastare farina, acqua con lievito, sale e olio per 10 minuti. Coprire e far lievitare per almeno 1 ora. Stendere l'impasto, condire con il pomodoro e infornare a 250°C per 8 minuti. Sfornare, aggiungere la mozzarella e il basilico, infornare altri 4 minuti.

## Tiramisù

**Tempo:** 30 minuti + riposo | **Porzioni:** 6

**Ingredienti:**
- 500g mascarpone
- 4 uova
- 100g zucchero
- 300g savoiardi
- 300ml caffè espresso (freddo)
- Cacao amaro q.b.

**Procedimento:**
Separare i tuorli dagli albumi. Montare i tuorli con lo zucchero fino a ottenere un composto chiaro e spumoso. Aggiungere il mascarpone e mescolare bene. Montare gli albumi a neve ferma e incorporarli delicatamente al composto. Inzuppare i savoiardi nel caffè e disporli in uno strato in una pirofila. Coprire con uno strato di crema. Ripetere gli strati. Spolverizzare con cacao amaro. Far riposare in frigo almeno 4 ore.

## Risotto ai funghi porcini

**Tempo:** 35 minuti | **Porzioni:** 4

**Ingredienti:**
- 320g riso carnaroli
- 300g funghi porcini freschi
- 1 cipolla
- 1L brodo vegetale
- 80g parmigiano grattugiato
- 50g burro
- Vino bianco q.b.

**Procedimento:**
Soffriggere la cipolla tritata con 20g di burro. Aggiungere i funghi tagliati e cuocere 5 minuti. Tostare il riso, sfumare con il vino bianco. Aggiungere il brodo un mestolo alla volta, mescolando. Dopo 18 minuti spegnere il fuoco, aggiungere burro e parmigiano. Mantecare e servire.
EOF
```

### Gli allergeni

```bash
cat > data/allergeni.md << 'EOF'
# Allergeni — Ristorante Da Luigi

## Informazioni sugli allergeni

Ogni piatto del nostro menu può contenere uno o più dei seguenti allergeni. Chiedete sempre al personale per informazioni dettagliate.

## Elenco allergeni per piatto

### Bruschetta al pomodoro
- Glutine (pane)
- Possibilità di tracce di aglio

### Caprese
- Lattosio (mozzarella di bufala)

### Carpaccio di manzo
- Lattosio (scaglie di parmigiano)
- Possibilità di tracce di glutine

### Spaghetti alla Carbonara
- Glutine (spaghetti)
- Uova
- Lattosio (pecorino romano)

### Bucatini all'Amatriciana
- Glutine (bucatini)
- Lattosio (pecorino romano)

### Risotto ai funghi porcini
- Lattosio (burro, parmigiano)

### Lasagne della Nonna
- Glutine (pasta fresca)
- Uova (pasta e besciamella)
- Lattosio (besciamella, parmigiano)

### Cotoletta alla Milanese
- Glutine (impanatura)
- Uova (impanatura)
- Lattosio (possibile)

### Pesce Spada alla Griglia
- Pesce
- Possibilità di tracce di solfiti

### Ossobuco
- Lattosio (possibile nella preparazione)

### Pizza Margherita
- Glutine (impasto)
- Lattosio (mozzarella)

### Pizza Diavola
- Glutine (impasto)
- Lattosio (mozzarella)
- Solfiti (salame)

### Pizza Quattro Formaggi
- Glutine (impasto)
- Lattosio (mozzarella, gorgonzola, parmigiano, fontina)

### Tiramisù
- Glutine (savoiardi)
- Uova
- Lattosio (mascarpone)
- Caffeina (caffè)

### Panna Cotta
- Lattosio (panna)

### Cannolo Siciliano
- Glutine (cialda)
- Lattosio (ricotta)

## Legenda allergeni

| Codice | Allergene | Presente in |
|--------|-----------|-------------|
| 1 | Glutine | Pasta, pane, impanature, savoiardi |
| 2 | Lattosio | Formaggi, burro, panna, mascarpone |
| 3 | Uova | Carbonara, lasagne, tiramisù, impanature |
| 4 | Pesce | Pesce spada |
| 5 | Solfiti | Salame, pesce conservato |
EOF
```

### Verifica

Controlla che tutti i file siano al loro posto:

```bash
ls -la data/
```

Devi vedere tre file:

```
-rw-r--r--  1 simone  staff  ... allergeni.md
-rw-r--r--  1 simone  staff  ... menu.md
-rw-r--r--  1 simone  staff  ... ricette.md
```

Questi file sono i "documenti" del nostro ristorante. Nelle prossime lezioni, il backend FastAPI li leggerà e ci farà sopra delle ricerche. È la base semplificata di quello che AthenaAI fa con documenti molto più complessi.

---

## 0.4 Inizializzare Git e pubblicare su GitHub

Come avete imparato nel corso Git, ogni progetto ha il suo repository. Simone inizializza Git e crea il repository su GitHub:

```bash
cd ~/progetti/RistoranteAI
git init
```

Ora crea il primo commit con i file di dati:

```bash
git add data/
git commit -m "Init: documenti del ristorante (menu, ricette, allergeni)"
```

Crea il repository su GitHub:

```bash
gh repo create RistoranteAI --public --source=. --push
```

Se preferisci creare il repository dal browser:

1. Vai su [github.com](https://github.com) → clicca **New repository**
2. Nome: `RistoranteAI` → **Public** → **Create repository**
3. Poi collega il remote dal terminale:
   ```bash
   git remote add origin git@github.com:SimoneRossi/RistoranteAI.git
   git push -u origin main
   ```

### Verifica

```bash
git log --oneline
```

Deve mostrare il commit iniziale:

```
a1b2c3d Init: documenti del ristorante (menu, ricette, allergeni)
```

```bash
git remote -v
```

Deve mostrare il remote su GitHub:

```
origin  git@github.com:SimoneRossi/RistoranteAI.git (fetch)
origin  git@github.com:SimoneRossi/RistoranteAI.git (push)
```

---

## 0.5 Come comunicano frontend e backend

Prima di iniziare a scrivere codice, è importante capire come i due server lavorano insieme.

### Due server, due porte

Avremo **due processi** in esecuzione contemporaneamente sul server Linux:

| Server | Porta | Tecnologia | Cosa fa |
|---|---|---|---|
| Backend | `8000` | FastAPI (Python) | Riceve richieste, legge i file, risponde con i dati |
| Frontend | `3000` | Next.js (Node.js) | Mostra l'interfaccia nel browser, chiama il backend |

Quando aprite il browser andate su `http://localhost:3000` — vedete il frontend Next.js. Quando il frontend ha bisogno di dati (per esempio la lista dei piatti), fa una richiesta HTTP al backend su `http://localhost:8000`.

### Il flusso di una richiesta

```
1. L'utente digita "carbonara" nella barra di ricerca
                     │
                     ▼
2. Il frontend Next.js invia una richiesta HTTP:
   GET http://localhost:8000/search?q=carbonara
                     │
                     ▼
3. Il backend FastAPI riceve la richiesta:
   - legge i file in data/
   - cerca "carbonara" nel testo
   - prepara la risposta in formato JSON
                     │
                     ▼
4. Il backend risponde:
   {"results": ["Spaghetti alla Carbonara — €10", ...]}
                     │
                     ▼
5. Il frontend riceve la risposta e la mostra a schermo
```

### Perché due server separati?

Potreste chiedervi: perché non un unico server che fa tutto? Perché nella realtà i progetti funzionano così. Separare frontend e backend permette di:

- sviluppare e modificare le due parti in modo indipendente
- scalare i due server separatamente (se il backend ha molto traffico, aggiungi solo backend)
- usare il linguaggio migliore per ogni parte (Python per la logica, JavaScript per l'interfaccia)

È esattamente come AthenaAI: anche lì c'è un frontend Next.js che parla con un backend Python.

### CORS: una parola che sentirete spesso

Quando il frontend (porta 3000) chiama il backend (porta 8000), il browser blocca la richiesta per motivi di sicurezza. È una protezione chiamata **CORS** (Cross-Origin Resource Sharing). Nel backend dovremo dire esplicitamente "accetta richieste dalla porta 3000". Lo faremo nella prossima lezione — per ora sappiate che esiste e che è normale.

### Come avvieremo i server

Durante lo sviluppo, terremo **due terminali aperti** in Antigravity:

```
Terminale 1 (backend):
$ cd ~/progetti/RistoranteAI/backend
$ fastapi dev app/main.py
# Partito su http://localhost:8000

Terminale 2 (frontend):
$ cd ~/progetti/RistoranteAI/frontend
$ npm run dev
# Partito su http://localhost:3000
```

Non preoccupatevi dei comandi esatti — li vedremo nelle prossime lezioni. L'importante è capire che **dobbiamo avviare entrambi** per vedere l'applicazione funzionare.

---

## Riepilogo

### Struttura del progetto

```
RistoranteAI/
├── frontend/          ← Next.js (lezione 2)
├── backend/
│   ├── app/           ← FastAPI (lezione 1)
│   └── requirements.txt
└── data/
    ├── menu.md        ✓ creato
    ├── ricette.md     ✓ creato
    └── allergeni.md   ✓ creato
```

### Comandi usati

```bash
# Verifica prerequisiti
node --version
python3 --version
npm --version
git --version
gh --version

# Creazione struttura
mkdir -p ~/progetti/RistoranteAI/frontend
mkdir -p ~/progetti/RistoranteAI/backend/app
mkdir -p ~/progetti/RistoranteAI/data

# Git
cd ~/progetti/RistoranteAI
git init
git add data/
git commit -m "Init: documenti del ristorante (menu, ricette, allergeni)"
gh repo create RistoranteAI --public --source=. --push
```

### Concetti chiave

| Concetto | Spiegazione |
|---|---|
| Frontend | L'interfaccia che l'utente vede nel browser (Next.js) |
| Backend | Il server che gestisce la logica e i dati (FastAPI) |
| HTTP | Il protocollo con cui frontend e backend comunicano |
| Porta 3000 | Dove gira il frontend Next.js |
| Porta 8000 | Dove gira il backend FastAPI |
| CORS | Protezione del browser che va configurata nel backend |
| `data/*.md` | File di testo che il backend legge per rispondere alle query |

---

*Prossima lezione: [Lezione 1 — Backend FastAPI: creiamo il server Python]*
