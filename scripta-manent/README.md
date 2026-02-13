# 📚 Scripta Manent - Portfolio Accademico

> *"Verba volant, scripta manent"* - Le parole volano, gli scritti rimangono

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-success)](./server/test)

Applicazione full-stack moderna per la gestione, ricerca e archiviazione di articoli scientifici con sistema di citazioni integrato.

---

## 🌟 Features

### Core Functionality

- ✅ **Autenticazione JWT** - Sistema sicuro di login/registrazione
- ✅ **CRUD Articoli** - Gestione completa articoli scientifici
- ✅ **Ricerca Full-Text** - Ricerca avanzata con MongoDB text search
- ✅ **Filtri Avanzati** - Filtro per autore, anno, journal con operatori di confronto
- ✅ **Gestione Citazioni** - Sistema di citazioni bidirezionale
- ✅ **Paginazione** - Caricamento ottimizzato con limit/skip
- ✅ **Cache Intelligente** - React Query con cache invalidation automatica
- ✅ **Optimistic Updates** - UI reattiva con rollback su errori

### UX/UI

- 🎨 **UI Responsive** - Mantine UI components
- 🌓 **Dark Mode** - Tema chiaro/scuro automatico
- 📱 **Mobile First** - Design ottimizzato per mobile
- 🔔 **Notifications** - Toast notifications per feedback utente
- ⚡ **Loading States** - Skeleton loaders e spinners

### Developer Experience

- 🧪 **Testing Completo** - Jest + Supertest + React Testing Library
- 📝 **Validazione End-to-End** - Zod per backend + frontend
- 🔧 **Error Handling** - Gestione errori centralizzata
- 🐳 **Docker Ready** - Containerizzazione completa (opzionale)
- 📊 **React Query DevTools** - Debug avanzato

---

## 🛠️ Stack Tecnologico

### Frontend

- **Framework**: React 19.1 + Vite
- **UI Library**: Mantine UI 8.3
- **State Management**: Zustand (auth) + React Query (server state)
- **Routing**: React Router v7
- **Form Handling**: React Hook Form
- **HTTP Client**: Fetch API con interceptor custom
- **Icons**: Tabler Icons

### Backend

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.19
- **Database**: MongoDB 8.4 + Mongoose 8.4
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod 3.23
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest 29 + Supertest 7

### DevOps

- **Containerization**: Docker + Docker Compose (opzionale)
- **Process Manager**: Nodemon (dev)
- **Environment**: dotenv
- **Testing DB**: MongoDB Memory Server

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (incluso con Node.js)
- **MongoDB** >= 6.0 ([Download](https://www.mongodb.com/try/download/community)) *o usa Docker*
- **Docker** (opzionale, per containerizzazione)
- **Git** per clonare il repository

Verifica le versioni installate:

```bash
node --version  # v16.x.x o superiore
npm --version   # v8.x.x o superiore
mongod --version # v6.x.x o superiore (opzionale se usi Docker)
```

---

## 🚀 Installazione

### 1. Clona il Repository

```bash
git clone https://github.com/Giampiero1998/scripta-manent.git
cd scripta-manent
```

### 2. Installa Dipendenze Backend

```bash
cd server
npm install
```

### 3. Installa Dipendenze Frontend

```bash
cd ../client
npm install
```

### 4. Configurazione Environment Variables

#### Backend (.env)

Crea il file `server/.env` (copia da `server/.env.example`):

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/scripta_manent_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)

Crea il file `client/.env` (copia da `client/.env.example`):

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_ENV=development

# Debug (opzionale)
VITE_ENABLE_DEBUG=true
```

**Quick Setup:**

```bash
# Backend
cd server
cp .env.example .env
# Modifica server/.env con i tuoi valori

# Frontend
cd ../client
cp .env.example .env
# Modifica client/.env con i tuoi valori
```

---

## ▶️ Esecuzione

### Opzione 1: Sviluppo Locale (Consigliato per Development)

```bash
# Terminal 1: Avvia MongoDB (se non usi Docker)
mongod --dbpath=/path/to/data

# Terminal 2: Avvia Backend
cd server
npm run dev
# Server disponibile su http://localhost:5000

# Terminal 3: Avvia Frontend
cd client
npm run dev
# App disponibile su http://localhost:5173
```

### Opzione 2: Docker Development (con Hot Reload)

```bash
# Dalla root del progetto
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# In background
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop
docker-compose down
```

**Accedi a:**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Opzione 3: Docker Production

```bash
# Build e avvia
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Vedi logs
docker-compose logs -f

# Stop e cleanup
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

### Opzione 4: Produzione (Senza Docker)

```bash
# Backend
cd server
npm start

# Frontend (build statico)
cd client
npm run build
npm run preview
```

---

## 🐳 Docker (Opzionale)

Il progetto include una configurazione Docker completa per sviluppo e produzione.

### Setup Docker

```bash
# 1. Crea file .env (se non l'hai già fatto)
cp server/.env.example server/.env
cp client/.env.example client/.env

# 2. Development con hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 3. Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Comandi Utili

```bash
# Rebuild containers
docker-compose build --no-cache

# Vedi logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Accedi al container
docker exec -it scripta-backend sh

# Stop tutto
docker-compose down

# Stop e rimuovi volumi (⚠️ cancella DB)
docker-compose down -v
```

### Architettura Docker

- **Backend**: Node.js 20 Alpine (multi-stage build)
- **Frontend**: Vite dev (dev) / Nginx (prod)
- **MongoDB**: Mongo 8.0 Alpine con volume persistente
- **Network**: Bridge network isolato `scripta_network`

Per dettagli completi, vedi [DOCKER-USAGE-GUIDE.md](docs/DOCKER-USAGE-GUIDE.md).

---

## 🧪 Testing

### Backend Tests

```bash
cd server

# Esegui tutti i test
npm test

# Test con coverage
npm run test:coverage

# Test in watch mode
npm run test:watch

# Test specifico
npm test -- article.test.js
```

### Frontend Tests

```bash
cd client

# Esegui tutti i test
npm test

# Test con UI
npm run test:ui

# Test coverage
npm run coverage
```

### Test End-to-End

```bash
# Dalla root
npm run test:all
```

**Expected Output:**

```
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        3.5s
```

---

## 📡 API Endpoints

### Autenticazione

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrazione nuovo utente | ❌ |
| POST | `/api/auth/login` | Login utente | ❌ |

**Esempio Request:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mario Rossi",
    "email": "mario@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Articoli

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/portfolio/articles` | Lista articoli con filtri | ❌ |
| GET | `/api/portfolio/articles/:id` | Dettaglio articolo | ❌ |
| GET | `/api/portfolio/articles/:id/with-citations` | Articolo con citazioni | ❌ |
| POST | `/api/portfolio/articles` | Crea nuovo articolo | ✅ |
| PATCH | `/api/portfolio/articles/:id` | Aggiorna articolo | ✅ |
| DELETE | `/api/portfolio/articles/:id` | Elimina articolo | ✅ |

**Query Parameters per GET /articles:**

- `q` - Full-text search (titolo, abstract, autori)
- `authors` - Filtra per autore
- `year` - Filtra per anno specifico
- `year[gte]` - Anno maggiore o uguale
- `year[lte]` - Anno minore o uguale
- `journal` - Filtra per journal
- `limit` - Numero risultati (default: 100)
- `skip` - Offset per paginazione
- `page` - Numero pagina (calcola skip automaticamente)

**Esempio Request:**

```bash
# Ricerca full-text
curl "http://localhost:5000/api/portfolio/articles?q=machine+learning"

# Filtri combinati
curl "http://localhost:5000/api/portfolio/articles?authors=Smith&year[gte]=2020&limit=10"

# Con autenticazione
curl -X POST http://localhost:5000/api/portfolio/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Deep Learning in Healthcare",
    "authors": ["John Smith", "Jane Doe"],
    "year": 2024,
    "journal": "AI Review",
    "abstract": "This paper explores..."
  }'
```

---

### Citazioni

| Metodo | Endpoint | Descrizione | Auth |
|--------|----------|-------------|------|
| GET | `/api/portfolio/citations` | Lista citazioni | ❌ |
| GET | `/api/portfolio/citations?articleId=:id` | Citazioni per articolo | ❌ |
| GET | `/api/portfolio/citations/:id` | Dettaglio citazione | ❌ |
| POST | `/api/portfolio/citations` | Crea citazione | ✅ |
| PATCH | `/api/portfolio/citations/:id` | Aggiorna citazione | ✅ |
| DELETE | `/api/portfolio/citations/:id` | Elimina citazione | ✅ |

**Esempio Request:**

```bash
curl -X POST http://localhost:5000/api/portfolio/citations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "articleId": "507f1f77bcf86cd799439011",
    "referenceText": "Smith et al., Deep Learning Fundamentals, 2023",
    "pagesCited": "15-42"
  }'
```

---

## 📁 Struttura Progetto

```
scripta-manent/                           # 📦 ROOT DEL PROGETTO
│
├── 📄 README.md                          # Documentazione principale
├── 📄 LICENSE                            # Licenza MIT
├── 📄 CONTRIBUTING.md                    # Linee guida contribuzione
├── 📄 CHANGELOG.md                       # Storico versioni
├── 📄 .gitignore                         # ✨ Git ignore globale
│
├── 🐳 docker-compose.yml                 # ✨ Orchestrazione base
├── 🐳 docker-compose.dev.yml             # ✨ Override development
├── 🐳 docker-compose.prod.yml            # ✨ Override production
│
├── 📂 server/                            # ⚙️ BACKEND
│   ├── 📂 controllers/
│   ├── 📂 models/
│   ├── 📂 services/
│   ├── 📂 routes/
│   ├── 📂 middleware/
│   ├── 📂 validation/
│   ├── 📂 utils/
│   ├── 📂 test/
│   ├── 📂 testing/
│   ├── 📄 server.js
│   ├── 📄 errorController.js
│   ├── 📄 package.json
│   ├── 📄 .env                           # (gitignored)
│   ├── 📄 .env.example                   # ✨ Template env vars
│   ├── 🐳 Dockerfile                     # ✨ Backend container (multi-stage)
│   └── 📄 .dockerignore                  # ✨ Docker ignore
│
├── 📂 client/                            # 🎨 FRONTEND
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 features/
│   │   ├── 📂 pages/
│   │   ├── 📂 hooks/
│   │   ├── 📂 services/
│   │   ├── 📂 store/
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   ├── 📄 package.json
│   ├── 📄 .env                           # (gitignored)
│   ├── 📄 .env.example                   # ✨ Template env vars
│   ├── 🐳 Dockerfile                     # ✨ Frontend container (multi-stage)
│   ├── 📄 .dockerignore                  # ✨ Docker ignore
│   ├── 📄 nginx.conf                     # ✨ Nginx production config
│   └── 📄 vite.config.js
│
└── 📂 docs/                              # ✨ DOCUMENTAZIONE
    ├── 📄 DOCKER-USAGE-GUIDE.md
    ├── 📄 STRUTTURA-PROGETTO.md
    └── 📂 images/ (opzionale)
```

---

## 🔧 Configurazione Avanzata

### MongoDB Indexes

Il backend crea automaticamente questi indici:

- **Text Index**: `title`, `abstract`, `authors` (per full-text search)
- **Compound Index**: `year`, `journal` (per query ottimizzate)

Per verificare gli indici:

```javascript
// In MongoDB shell
use scripta_manent_db
db.articles.getIndexes()
```

---

### React Query Cache Strategy

Configurazione in `client/src/main.jsx`:

- **Stale Time**: 5 minuti (dati considerati "freschi")
- **Cache Time**: 10 minuti (dati mantenuti in cache)
- **Refetch on Window Focus**: Abilitato
- **Refetch on Reconnect**: Abilitato
- **Retry**: 1 tentativo con exponential backoff

---

### JWT Token Expiration

- **Access Token**: 1 giorno (configurabile in `authController.js`)
- **Storage**: localStorage (chiave: `auth-storage`)
- **Auto-logout**: Su token scaduto (401 response)

---

## 🐛 Troubleshooting

### Problema: CORS Error

**Errore**: `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Soluzione**:

```bash
# Verifica CLIENT_URL in server/.env
CLIENT_URL=http://localhost:5173

# Riavvia il backend
cd server && npm run dev
```

---

### Problema: MongoDB Connection Failed

**Errore**: `MongoServerError: connect ECONNREFUSED`

**Soluzione**:

```bash
# Verifica che MongoDB sia in esecuzione
mongod --version

# Avvia MongoDB manualmente
mongod --dbpath=/path/to/data

# O usa Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

### Problema: JWT Token Invalid

**Errore**: `401 Unauthorized - Token non valido`

**Soluzione**:

1. Verifica che `JWT_SECRET` sia lo stesso in backend e test
2. Cancella localStorage:

```javascript
// Console del browser
localStorage.clear()
```

3. Fai logout e login di nuovo

---

### Problema: Test Falliti

**Errore**: `Test suite failed to run`

**Soluzione**:

```bash
# Pulisci node_modules e cache
cd server
rm -rf node_modules package-lock.json
npm install

# Esegui test con verbose
npm test -- --verbose --no-cache
```

---

### Problema: Docker Port Already in Use

**Errore**: `bind: address already in use`

**Soluzione**:

```bash
# Trova processo che usa la porta
lsof -i :5000
lsof -i :5173
lsof -i :27017

# Uccidi processo
kill -9 <PID>

# O cambia porta in docker-compose.yml
```

---

## 📊 Performance Tips

### Backend Optimization

1. **Index Usage**: Verifica che le query usino indici

```javascript
// Abilita profiling in MongoDB
db.setProfilingLevel(2)
db.system.profile.find().sort({ts: -1}).limit(5)
```

2. **Pagination**: Usa sempre `limit` per evitare query massive

```javascript
GET /api/portfolio/articles?limit=20&page=1
```

3. **Projection**: Escludi campi non necessari

```javascript
// In articleService.js
.select('-__v -createdAt')
```

---

### Frontend Optimization

1. **Code Splitting**: Usa lazy loading per routes

```javascript
const ArticleForm = lazy(() => import('./features/articles/ArticleForm'));
```

2. **Memoization**: Usa `useMemo` per calcoli pesanti

```javascript
const filteredArticles = useMemo(() => 
  articles.filter(a => a.year > 2020), 
  [articles]
);
```

3. **React Query DevTools**: Monitora cache hit rate

```javascript
// In development, apri DevTools (bottom-right)
// Verifica "Cache Hits" > 70%
```

---

## 🚢 Deployment

### Heroku

```bash
# Login
heroku login

# Crea app
heroku create scripta-manent

# Aggiungi MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main

# Imposta variabili ambiente
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
```

---

### Vercel (Frontend)

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy da client/
cd client
vercel --prod
```

---

### Docker Production

```bash
# Build immagine
docker build -t scripta-manent:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/db \
  -e JWT_SECRET=production-secret \
  --name scripta-backend \
  scripta-manent:latest
```

---

## 🤝 Contributing

Contributions are welcome! Per contribuire:

1. Fork il progetto
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### Coding Standards

- **Linting**: ESLint configurato
- **Formatting**: Prettier
- **Commit Messages**: [Conventional Commits](https://www.conventionalcommits.org/)
- **Tests**: Coverage > 80%

Per dettagli completi, vedi [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

Questo progetto è rilasciato sotto licenza **MIT**. Vedi [LICENSE](LICENSE) per dettagli.

---

## 👥 Team

**Sviluppatori:**

- [Il Tuo Nome](https://github.com/Giampiero1998) - Full Stack Developer

**Progetto Accademico** - 2025

---

## 🙏 Acknowledgments

- [Mantine UI](https://mantine.dev/) - UI Components
- [React Query](https://tanstack.com/query) - Server State Management
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Zod](https://zod.dev/) - Schema Validation

---

## 📞 Support

Per domande o supporto:

- 📧 Email: support@scriptamanent.com
- 🐛 Issue Tracker: [GitHub Issues](https://github.com/Giampiero1998/scripta-manent/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Giampiero1998/scripta-manent/discussions)

---

<div align="center">

**⭐ Se ti piace questo progetto, lascia una stella su GitHub! ⭐**

Made with ❤️ by [Il Tuo Nome]

</div>