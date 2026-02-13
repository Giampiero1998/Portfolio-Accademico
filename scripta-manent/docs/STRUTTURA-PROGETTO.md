# 📁 Struttura Completa del Progetto

```
scripta-manent/                           # 📦 ROOT DEL PROGETTO
│
├── 📄 README.md                          # Documentazione principale
├── 📄 LICENSE                            # Licenza MIT
├── 📄 CONTRIBUTING.md                    # Linee guida contribuzione
├── 📄 CHANGELOG.md                       # Storico versioni
├── 📄 .gitignore                         # ✨ Git ignore globale
│
├── 🐳 docker-compose.yml                 # ✨ Orchestrazione completa (dev+prod)
├── 🐳 docker-compose.dev.yml             # ✨ Override development
├── 🐳 docker-compose.prod.yml            # ✨ Override production
│
├── 📂 server/                            # ⚙️ BACKEND (Node.js/Express)
│   │
│   ├── 📂 controllers/                   # Request handlers
│   │   ├── articleController.js
│   │   ├── citationController.js
│   │   └── authController.js
│   │
│   ├── 📂 models/                        # Mongoose schemas
│   │   ├── Article.js
│   │   ├── Citation.js
│   │   └── User.js
│   │
│   ├── 📂 services/                      # Business logic
│   │   ├── articleService.js
│   │   └── citationService.js
│   │
│   ├── 📂 routes/                        # Express routes
│   │   ├── articleRoutes.js
│   │   ├── citationRoutes.js
│   │   ├── authRoutes.js
│   │   └── portfolioRoutes.js
│   │
│   ├── 📂 middleware/                    # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   │
│   ├── 📂 validation/                    # Zod schemas
│   │   ├── articleSchema.js
│   │   └── citationSchema.js
│   │
│   ├── 📂 utils/                         # Helper functions
│   │   ├── AppError.js
│   │   └── CustomError.js
│   │
│   ├── 📂 test/                          # Backend tests
│   │   ├── article.test.js
│   │   └── citation.test.js
│   │
│   ├── 📂 testing/                       # Test utilities
│   │   ├── jest.setup.js
│   │   └── authTestHelper.js
│   │
│   ├── 📄 server.js                      # Express app entry point
│   ├── 📄 errorController.js             # Global error handler
│   ├── 📄 package.json                   # Backend dependencies
│   ├── 📄 package-lock.json
│   ├── 📄 .env                           # Environment variables (gitignored)
│   ├── 📄 .env.example                   # ✨ Template per .env
│   ├── 🐳 Dockerfile                     # ✨ Backend container (multi-stage)
│   ├── 📄 .dockerignore                  # ✨ Docker ignore per backend
│   └── 📄 jest.config.js                 # Jest configuration
│
├── 📂 client/                            # 🎨 FRONTEND (React/Vite)
│   │
│   ├── 📂 public/                        # Static assets
│   │   └── vite.svg
│   │
│   ├── 📂 src/
│   │   │
│   │   ├── 📂 components/                # Shared components
│   │   │   ├── Layout.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx      # ✨ HOC per auth
│   │   │
│   │   ├── 📂 features/                  # Feature modules
│   │   │   └── 📂 articles/
│   │   │       ├── ArticleList.jsx
│   │   │       ├── ArticleCard.jsx
│   │   │       ├── ArticleForm.jsx
│   │   │       └── ArticleDetailPage.jsx
│   │   │
│   │   ├── 📂 pages/                     # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── 📂 hooks/                     # Custom hooks
│   │   │   ├── useArticles.js            # ✨ React Query hooks
│   │   │   └── useArticleFilters.js
│   │   │
│   │   ├── 📂 services/                  # API client
│   │   │   └── api.js                    # ✨ Enhanced API con interceptors
│   │   │
│   │   ├── 📂 store/                     # Zustand stores
│   │   │   └── authStore.js
│   │   │
│   │   ├── 📂 styles/                    # Global styles (opzionale)
│   │   │   └── global.css
│   │   │
│   │   ├── 📄 App.jsx                    # Root component
│   │   ├── 📄 main.jsx                   # App entry point
│   │   └── 📄 index.css
│   │
│   ├── 📂 tests/                         # Frontend tests (opzionale)
│   │   └── setup.js
│   │
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 package-lock.json
│   ├── 📄 .env                           # Environment variables (gitignored)
│   ├── 📄 .env.example                   # ✨ Template per .env
│   ├── 🐳 Dockerfile                     # ✨ Frontend container (multi-stage)
│   ├── 📄 .dockerignore                  # ✨ Docker ignore per frontend
│   ├── 📄 nginx.conf                     # ✨ Nginx config per production
│   ├── 📄 vite.config.js                 # Vite configuration
│   ├── 📄 jest.config.cjs                # Jest configuration (opzionale)
│   ├── 📄 .eslintrc.cjs                  # ESLint config
│   └── 📄 index.html                     # HTML entry point
│
├── 📂 docs/                              # DOCUMENTAZIONE ✨
│   │                     
│   ├── 📄 DOCKER-USAGE-GUIDE.md          # ✨ Guida Docker completa
│   ├── 📄 STRUTTURA-PROGETTO.md          # ✨ Questo file
│
└──
```

---

## 📊 Statistiche Progetto

### Backend

- **Controllers**: 3 file
- **Models**: 3 file
- **Services**: 2 file
- **Routes**: 4 file
- **Middleware**: 3 file
- **Tests**: 2 file + utilities
- **Total Lines**: ~2,000

### Frontend

- **Components**: 4 shared
- **Features**: 4 article components
- **Pages**: 2 auth pages
- **Hooks**: 2 custom hooks
- **Services**: 1 API client
- **Store**: 1 auth store
- **Total Lines**: ~1,500

### Totale Progetto

- **Total Files**: ~50+
- **Total Lines of Code**: ~3,500+
- **Dependencies**: ~40 packages
- **Test Coverage**: 80%+

---

## 🎯 File Essenziali da Creare

### Root

- ✅ README.md  
- ✅ CONTRIBUTING.md
- ✅ CHANGELOG.md
- ✅ .gitignore
- ✅ docker-compose.yml
- ✅ docker-compose.dev.yml
- ✅ docker-compose.prod.yml

### Server

- ✅ Dockerfile
- ✅ .dockerignore
- ✅ .env.example

### Client

- ✅ Dockerfile
- ✅ .dockerignore
- ✅ nginx.conf
- ✅ .env.example

---

## 📦 Package.json Scripts (Root)

```json
{
  "name": "scripta-manent",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "install:all": "npm install --prefix server && npm install --prefix client",
    "dev:backend": "cd server && npm run dev",
    "dev:frontend": "cd client && npm run dev",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "test:backend": "cd server && npm test",
    "test:frontend": "cd client && npm test",
    "test:all": "npm run test:backend && npm run test:frontend",
    "build:backend": "cd server && npm run build",
    "build:frontend": "cd client && npm run build",
    "docker:dev": "docker-compose -f docker-compose.yml -f docker-compose.dev.yml up",
    "docker:prod": "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d",
    "docker:build": "docker-compose build --no-cache",
    "docker:down": "docker-compose down -v"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**Installa concurrently:**

```bash
npm install concurrently --save-dev
```

---

## 🚀 Quick Start Commands

```bash
# Setup completo
npm run install:all

# Development (senza Docker)
npm run dev

# Development (con Docker)
npm run docker:dev

# Testing
npm run test:all

# Production build
npm run build:backend
npm run build:frontend

# Production (Docker)
npm run docker:prod
```

---

## 📝 Note

1. **File .env** sono gitignored ma `.env.example` tracciati
2. **node_modules/** esclusi da Git e Docker
3. **Tests** in directories separate
4. **Docker** completamente opzionale
5. **Docs/** directory opzionale per documentazione extra

---

## 🔐 File Sensibili (gitignored)

- `server/.env`
- `client/.env`
- `server/node_modules/`
- `client/node_modules/`
- `server/coverage/`
- `client/coverage/`
- `*.log`
- `.DS_Store`

---

**Questa è la struttura finale del progetto!** 🎉