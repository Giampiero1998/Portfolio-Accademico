# Contributing to Scripta Manent

Grazie per il tuo interesse nel contribuire a Scripta Manent! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)

---

## 📜 Code of Conduct

Questo progetto aderisce al [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Partecipando, ti impegni a rispettare questo codice.

---

## 🚀 Getting Started

### 1. Fork il Repository

Click sul pulsante "Fork" in alto a destra su GitHub.

### 2. Clone il tuo Fork

```bash
git clone https://github.com/Giampiero1998/scripta-manent.git
cd scripta-manent
```

### 3. Aggiungi Upstream Remote

```bash
git remote add upstream https://github.com/Giampiero1998/scripta-manent.git
```

### 4. Crea un Branch

```bash
git checkout -b feature/nome-feature
```

---

## 🐳 Docker Development (Opzionale)

Se preferisci usare Docker per lo sviluppo:

### Setup

```bash
# 1. Assicurati di aver creato i file .env
cp server/.env.example server/.env
cp client/.env.example client/.env

# 2. Avvia con Docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Workflow con Docker

```bash
# Modifica codice (hot reload automatico)
# Backend: nodemon rileva cambiamenti
# Frontend: Vite HMR attivo

# Run tests nei container
docker exec scripta-backend npm test
docker exec scripta-frontend npm test

# Accedi al container per debug
docker exec -it scripta-backend sh

# Stop
docker-compose down
```

### Quando Usare Docker vs Locale

**Usa Docker se:**

- Vuoi un ambiente isolato e consistente
- Non vuoi installare MongoDB localmente
- Stai sviluppando su Windows (meno problemi)
- Vuoi testare production build

**Usa setup locale se:**

- Preferisci velocità massima (no overhead Docker)
- Vuoi debug più semplice con IDE
- Hai già MongoDB installato
- Stai su macOS/Linux (setup più semplice)

---

## 🔄 Development Process

### 1. Mantieni il tuo Fork Aggiornato

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Installa Dipendenze

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

### 3. Configura Environment Variables

```bash
# Backend
cp server/.env.example server/.env
# Modifica server/.env con valori appropriati

# Frontend
cp client/.env.example client/.env
# Modifica client/.env con valori appropriati
```

### 4. Scegli Modalità Esecuzione

#### Opzione A: Locale (Consigliato per Development)

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

#### Opzione B: Docker (Alternativa)

```bash
# Development con hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Accedi a http://localhost:5173
```

### 5. Sviluppa la tua Feature

- Segui gli [standard di codifica](#coding-standards)
- Scrivi test per nuove funzionalità
- Aggiorna la documentazione se necessario

### 6. Testa le Modifiche

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# Tutti i test
npm run test:all
```

#### Testing con Docker (Opzionale)

```bash
# Run tests nei container
docker exec scripta-backend npm test
docker exec scripta-frontend npm test

# Run con coverage
docker exec scripta-backend npm run test:coverage
```

---

## 🔀 Pull Request Process

### 1. Commit le Modifiche

Segui le [linee guida per i commit](#commit-guidelines):

```bash
git add .
git commit -m "feat: aggiungi ricerca avanzata per citazioni"
```

### 2. Push al tuo Fork

```bash
git push origin feature/nome-feature
```

### 3. Crea la Pull Request

1. Vai su GitHub al tuo fork
2. Click su "Compare & pull request"
3. Compila il template della PR con:
   - **Descrizione**: Cosa fa la tua modifica?
   - **Motivazione**: Perché è necessaria?
   - **Testing**: Come hai testato?
   - **Screenshots**: (se applicabile)

### 4. Code Review

- Rispondi ai commenti dei reviewer
- Effettua modifiche se richieste
- Mantieni la conversazione professionale e costruttiva

### 5. Merge

Dopo l'approvazione, un maintainer farà il merge della tua PR!

---

## 📏 Coding Standards

### JavaScript/React

#### Style Guide

- Usa **ES6+** syntax
- **2 spaces** per indentazione
- **Single quotes** per stringhe
- **Semicolons** alla fine delle istruzioni
- **Arrow functions** per callbacks

#### Naming Conventions

```javascript
// Components: PascalCase
const ArticleCard = () => {};

// Functions: camelCase
const fetchArticles = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';

// Private functions: _camelCase
const _internalHelper = () => {};
```

#### File Structure

```javascript
// 1. Imports
import React from 'react';
import { useState } from 'react';

// 2. Constants
const MAX_ITEMS = 10;

// 3. Component
const MyComponent = () => {
  // 3a. Hooks
  const [state, setState] = useState();
  
  // 3b. Handlers
  const handleClick = () => {};
  
  // 3c. Render
  return <div>...</div>;
};

// 4. Export
export default MyComponent;
```

---

### Backend

#### Controller Pattern

```javascript
exports.getArticles = async (req, res, next) => {
  try {
    // 1. Validate input
    const params = req.query;
    
    // 2. Call service
    const articles = await articleService.getAll(params);
    
    // 3. Return response
    res.status(200).json({
      status: 'success',
      data: { articles }
    });
  } catch (error) {
    // 4. Handle error
    next(error);
  }
};
```

#### Service Pattern

```javascript
exports.getAll = async (filters) => {
  // 1. Build query
  const query = buildQuery(filters);
  
  // 2. Execute query
  const articles = await Article.find(query);
  
  // 3. Return data
  return articles;
};
```

---

## 📝 Commit Guidelines

Seguiamo [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nuova feature
- `fix`: Bug fix
- `docs`: Solo documentazione
- `style`: Formattazione, missing semicolons, etc
- `refactor`: Refactoring codice
- `test`: Aggiunta test
- `chore`: Build, tools, dependencies

### Examples

```bash
# Feature
git commit -m "feat(articles): aggiungi filtro per anno"

# Bug fix
git commit -m "fix(auth): risolvi logout non funzionante"

# Documentation
git commit -m "docs(readme): aggiorna sezione installazione"

# Breaking change
git commit -m "feat(api)!: cambia formato response articoli

BREAKING CHANGE: il campo 'data' ora è 'articles'"
```

---

## 🧪 Testing

### Backend Tests

#### Unit Tests

```javascript
describe('articleService.getAll', () => {
  it('should return all articles', async () => {
    const articles = await articleService.getAll();
    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
  });
});
```

#### Integration Tests

```javascript
describe('GET /api/portfolio/articles', () => {
  it('should return 200 and articles list', async () => {
    const res = await request(app)
      .get('/api/portfolio/articles')
      .expect(200);
    
    expect(res.body.status).toBe('success');
    expect(res.body.data.articles).toBeDefined();
  });
});
```

---

### Frontend Tests

#### Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import ArticleCard from './ArticleCard';

test('renders article title', () => {
  render(<ArticleCard article={{ title: 'Test' }} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

#### Hook Tests

```javascript
import { renderHook, act } from '@testing-library/react';
import { useArticles } from './useArticles';

test('fetches articles', async () => {
  const { result } = renderHook(() => useArticles());
  
  await act(async () => {
    await result.current.refetch();
  });
  
  expect(result.current.data).toBeDefined();
});
```

---

## 📚 Documentation

### Code Comments

```javascript
/**
 * Recupera articoli con filtri opzionali
 * @param {Object} filters - Oggetto filtri { q, authors, year }
 * @param {string} filters.q - Query full-text search
 * @param {string} filters.authors - Filtra per autore
 * @param {number} filters.year - Filtra per anno
 * @returns {Promise<Array>} Lista articoli
 * @throws {Error} Se query fallisce
 */
const getArticles = async (filters = {}) => {
  // Implementation
};
```

### README Updates

Quando aggiungi nuove feature, aggiorna:

- [ ] Sezione Features
- [ ] API Endpoints (se applicabile)
- [ ] Esempi di utilizzo
- [ ] Screenshots (se UI changes)

---

## ❓ Questions?

Se hai domande:

- 💬 Apri una [Discussion](https://github.com/Giampiero1998/scripta-manent/discussions)
- 🐛 Segnala un [Issue](https://github.com/Giampiero1998/scripta-manent/issues)
- 📧 Email: <support@scriptamanent.com>

---

## 🎉 Thank You

Grazie per il tuo contributo! Ogni contributo, grande o piccolo, è apprezzato. 🙏

---

**Happy Coding!** 💻
