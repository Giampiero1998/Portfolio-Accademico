require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Importa il gestore globale degli errori
const globalErrorHandler = require('./errorController'); 

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// 🧱 Middleware di sicurezza e configurazioni
app.use(helmet());

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, error: 'Troppe richieste, riprova più tardi.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json());

// 🧩 Rotte API
const portfolioRoutes = require('./routes/portfolioRoutes');
app.use('/api/portfolio', portfolioRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('API REST Gestore Portfolio in esecuzione.');
});

const authRoutes = require('./routes/authRoutes');
app.use ('/api/auth', authRoutes);

app.use ('/api/articles', require('./routes/articleRoutes'));
app.use ('/api/citations', require('./routes/citationRoutes'));


// ⚠️ Gestore per rotte non trovate (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Impossibile trovare ${req.originalUrl} su questo server!`, 404));
});
// 🌐 Gestore globale degli errori
app.use(globalErrorHandler);

// 🔌 Funzione di connessione al DB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connessione a MongoDB riuscita.');
  } catch (err) {
    console.error('Errore di connessione a MongoDB:', err.message);
    process.exit(1);
  }
};

// 🚀 Avvio del server solo se non in ambiente di test
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server Express in ascolto sulla porta ${PORT}`);
    });
  });
}
// 📦 Esporta l'app per i test Jest
module.exports = app;