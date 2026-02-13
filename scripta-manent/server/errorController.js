const AppError = require('./utils/AppError');
const CustomError = require('./utils/CustomError');

/**
 * Gestisce gli errori di tipo CastError (ID non valido per Mongoose).
 * @param {Error} err - L'oggetto errore originale.
 * @returns {CustomError} Un nuovo errore operativo.
 */
const handleCastErrorDB = (err) => {
  const message = `ID non valido: ${err.value}.`;
  return new CustomError('InvalidIdError', message, 400);
};

/**
 * Gestisce gli errori di campo duplicato (codice 11000).
 * @param {Error} err - L'oggetto errore originale.
 * @returns {CustomError} Un nuovo errore operativo.
 */
const handleDuplicateFieldsDB = (err) => {
  // Regex per estrarre il valore duplicato (es. ' "valore-duplicato" ')
  // Nota: err.errmsg non è sempre disponibile, usiamo la versione di err.message
  const valueMatch = err.message.match(/(["'])(\\?.)*?\1/);
  const value = valueMatch ? valueMatch[0] : 'sconosciuto';
  const message = `Valore del campo duplicato: ${value}. Si prega di usare un altro valore.`;
  return new CustomError('DuplicateFieldError', message, 400);
};

/**
 * Gestisce gli errori di validazione Mongoose.
 * @param {Error} err - L'oggetto errore originale.
 * @returns {CustomError} Un nuovo errore operativo.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Dati di input non validi. ${errors.join('. ')}`;
  return new CustomError('ValidationError', message, 400);
};

/**
 * Gestisce gli errori di validazione Zod/altri schemi.
 * @param {Error} err - L'oggetto errore originale.
 * @returns {CustomError} Un nuovo errore operativo.
 */
const handleZodError = (err) => {
  // Parsing robusto dell'errore per prevenire il 'Cannot read properties of undefined'
  const errors = Array.isArray(err.issues) 
    ? err.issues.map((issue) => `${issue.path.join('.')} è richiesto o non è valido: ${issue.message}`)
    : [err.message];
    
  const message = `Dati di input non validi: ${errors.join('; ')}`;
  return new CustomError('ZodValidationError', message, 400);
};


// --- AMBIENTE DI SVILUPPO ---
const sendErrorDev = (err, req, res) => {
  console.error('ERRORE 💥', err.stack);

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// --- AMBIENTE DI PRODUZIONE ---
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERRORE 💥', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Qualcosa è andato storto!',
  });
};


// --- AMBIENTE DI TESTING (Focus sulla gestione degli errori) ---
const sendErrorTest = (err, res) => {
  // Creazione di una copia pulita dell'errore per la gestione (importante per Mongoose/Mongo errors)
  let error = { 
    ...err, 
    name: err.name, 
    message: err.message, 
    // errmsg e code sono specifici di Mongo, inclusi per robustezza
    errmsg: err.errmsg, 
    code: err.code, 
    issues: err.issues 
  };
  
  // Assicurati che l'errore mantenga la sua proprietà isOperational se è già stata impostata
  if (err.isOperational === false) {
      error.isOperational = false;
  } else {
      error.isOperational = true; // Presupponiamo che la maggior parte degli errori Mongoose siano operativi
  }

  // Logica per gestire gli errori specifici e convertirli in CustomError/AppError operativi
  try {
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    
    // Gestione Zod/Joi (controlla l'array issues)
    if (error.name === 'ZodError' || error.name === 'ValidationError' && error.issues) {
      error = handleZodError(error);
    }
    
  } catch (handlingError) {
    // Cattura un errore di programmazione che si verifica durante il tentativo di gestione dell'errore
    console.error('ERRORE DI PROGRAMMAZIONE NEL GESTORE DI ERRORI 💥', handlingError);
    // Imposta l'errore come non operativo (500)
    error = new AppError('Errore interno del server (Fallimento nella gestione degli errori)', 500);
    error.isOperational = false;
  }
  
  // Il test si aspetta solo un messaggio pulito, non un oggetto error esteso.
  // Se l'errore è operativo, lo inviamo in modo pulito
  if (error.isOperational) {
    return res.status(error.statusCode).json({ 
      status: error.status, 
      message: error.message 
    });
  }

  // Altrimenti, è un errore di programmazione (500)
  console.error('ERRORE NON GESTITO 💥', error);

  res.status(500).json({
    status: 'error',
    message: 'Qualcosa è andato storto!',
  });
};

/**
 * Middleware globale per la gestione degli errori.
 */
module.exports = (err, req, res, next) => {
  // Imposta i valori predefiniti per qualsiasi errore non gestito prima
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // In produzione, usiamo la versione pulita per l'utente
    let error = { ...err, name: err.name, message: err.message };
    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV === 'test') {
    // Durante i test, usiamo la gestione degli errori più dettagliata
    sendErrorTest(err, res);
  }
};
