// Classe utilizzata per la gestione degli errori operativi nell'applicazione
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); 

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Cattura la traccia dello stack per un debug più facile
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;