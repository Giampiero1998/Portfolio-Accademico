# 🐳 Docker Usage Guide - Scripta Manent

## 📋 Setup Iniziale

### 1. Crea i file .env

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

### 2. Verifica Struttura File

```
scripta-manent/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── server/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env
└── client/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    └── .env
```

---

## 🚀 Comandi Docker

### Development Mode (con hot reload)

```bash
# Avvia tutti i servizi in development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Avvia in background
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Rebuild se hai modificato Dockerfile
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Rebuild da zero (no cache)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
```

### Production Mode

```bash
# Avvia in production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Stop e rimuovi volumi
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

### Gestione Servizi

```bash
# Vedi logs di tutti i servizi
docker-compose logs -f

# Vedi logs di un servizio specifico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Stop tutti i servizi
docker-compose down

# Stop e rimuovi volumi (⚠️ cancella DB)
docker-compose down -v

# Riavvia un singolo servizio
docker-compose restart backend
```

---

## 🔍 Debug e Troubleshooting

### Accedi al Container

```bash
# Bash nel backend
docker exec -it scripta-backend sh

# Bash nel frontend
docker exec -it scripta-frontend sh

# Mongo shell
docker exec -it scripta-mongo mongosh
```

### Verifica Health Checks

```bash
# Vedi stato health
docker ps

# Se un container è "unhealthy":
docker inspect scripta-backend | grep -A 10 Health
```

### Pulisci Docker

```bash
# Rimuovi container stopped
docker container prune

# Rimuovi immagini unused
docker image prune -a

# Pulizia completa (⚠️ rimuove TUTTO)
docker system prune -a --volumes
```

---

## 📊 Monitoraggio

### Resource Usage

```bash
# Vedi utilizzo risorse
docker stats

# Vedi solo scripta-manent
docker stats scripta-backend scripta-frontend scripta-mongo
```

### Network Inspection

```bash
# Vedi network
docker network ls

# Ispeziona network scripta
docker network inspect scripta_network
```

---

## 🧪 Testing con Docker

### Run Tests nel Container

```bash
# Backend tests
docker exec scripta-backend npm test

# Frontend tests
docker exec scripta-frontend npm test
```

### Run One-off Commands

```bash
# Esegui comando nel backend
docker-compose run --rm backend npm run seed-db

# Esegui comando nel frontend
docker-compose run --rm frontend npm run build
```

---

## 🔄 Workflow Tipico

### Sviluppo Quotidiano

```bash
# 1. Avvia ambiente
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 2. Vedi logs
docker-compose logs -f

# 3. Modifica codice (hot reload automatico)
# ...

# 4. Stop ambiente
docker-compose down
```

### Deploy Produzione

```bash
# 1. Build produzione
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# 2. Avvia produzione
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 3. Verifica health
docker ps

# 4. Vedi logs
docker-compose logs -f backend frontend
```

---

## ⚠️ Common Issues

### Issue: Port Already in Use

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

### Issue: MongoDB Connection Failed

**Errore**: `MongoServerError: connect ECONNREFUSED`

**Soluzione**:

```bash
# 1. Verifica che mongo sia healthy
docker ps

# 2. Aspetta che mongo sia pronto
docker-compose logs -f mongo

# 3. Riavvia backend dopo mongo è healthy
docker-compose restart backend
```

---

### Issue: Frontend Can't Reach Backend

**Errore**: `Failed to fetch`

**Soluzione**:

```bash
# 1. Verifica network
docker network inspect scripta_network

# 2. Verifica variabile VITE_API_URL
docker exec scripta-frontend env | grep VITE

# 3. In development, usa http://localhost:5000/api
# In production Docker, usa http://backend:5000/api
```

---

## 🎯 Best Practices

### Development

1. **Usa volume mounts** per hot reload
2. **Non committare** `.env` files
3. **Rebuild** dopo cambio dipendenze
4. **Usa logs** per debugging

### Production

1. **NO volume mounts** (usa COPY nel Dockerfile)
2. **Usa secret management** per env vars
3. **Set resource limits** in docker-compose.prod.yml
4. **Abilita health checks**
5. **Usa reverse proxy** (nginx/traefik) davanti ai container

---

## 📦 Backup e Restore

### Backup MongoDB

```bash
# Backup
docker exec scripta-mongo mongodump --out /data/backup

# Copy to host
docker cp scripta-mongo:/data/backup ./mongodb-backup

# Compress
tar -czf mongodb-backup-$(date +%Y%m%d).tar.gz ./mongodb-backup
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup scripta-mongo:/data/restore

# Restore
docker exec scripta-mongo mongorestore /data/restore
```

---

## 🚢 Deploy su Server

### Con Docker Compose

```bash
# 1. Clone repo su server
git clone https://github.com/user/scripta-manent.git
cd scripta-manent

# 2. Setup env vars
cp server/.env.example server/.env
cp client/.env.example client/.env
# Modifica con valori produzione

# 3. Build e avvia
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. Setup reverse proxy (nginx/traefik) davanti ai container
```

### Con Docker Registry

```bash
# 1. Build images
docker build -t scripta-backend:latest ./server
docker build -t scripta-frontend:latest ./client

# 2. Tag per registry
docker tag scripta-backend:latest registry.example.com/scripta-backend:latest
docker tag scripta-frontend:latest registry.example.com/scripta-frontend:latest

# 3. Push
docker push registry.example.com/scripta-backend:latest
docker push registry.example.com/scripta-frontend:latest

# 4. Pull e run su server
docker pull registry.example.com/scripta-backend:latest
docker run -d -p 5000:5000 registry.example.com/scripta-backend:latest
```

---

## 📚 Resources

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)

---

**Happy Dockerizing!** 🐳