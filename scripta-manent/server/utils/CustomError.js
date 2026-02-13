const AppError = require('./AppError');

// Classe utilizzata per definire errori personalizzati con nomi specifici
class CustomError extends AppError {
  constructor(name, message, statusCode) {
    super(message, statusCode);
    this.name = name;
  }
}

module.exports = CustomError;