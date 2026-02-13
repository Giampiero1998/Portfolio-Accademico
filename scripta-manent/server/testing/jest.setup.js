/**
 * File di setup globale per i test Jest del backend
 * Configura MongoDB In-Memory Server per l'ambiente di test
 * Posizione: server/testing/jest.setup.js
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Article = require('../models/Article');

let mongoServer;
let testArticle; // Articolo di test globale

/**
 * Hook globale: Eseguito una volta prima di tutti i test
 * Avvia il server MongoDB in-memory e connette Mongoose
 */
beforeAll(async () => {
  try {
    // Avvia il server MongoDB in-memory
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connetti Mongoose al server in-memory (SENZA opzioni deprecate)
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB In-Memory Server avviato con successo');
    console.log(`📍 URI: ${mongoUri}`);
    
    // Imposta variabile d'ambiente per JWT
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jest';
  } catch (error) {
    console.error('❌ Errore durante l\'avvio del server MongoDB in-memory:', error);
    throw error;
  }
});

/**
 * Hook globale: Eseguito una volta dopo tutti i test
 * Disconnette Mongoose e arresta il server MongoDB in-memory
 */
afterAll(async () => {
  try {
    // Disconnetti Mongoose
    await mongoose.disconnect();
    
    // Arresta il server MongoDB in-memory
    if (mongoServer) {
      await mongoServer.stop();
    }
    
    console.log('✅ MongoDB In-Memory Server arrestato con successo');
  } catch (error) {
    console.error('❌ Errore durante l\'arresto del server MongoDB in-memory:', error);
    throw error;
  }
});

/**
 * Hook: Eseguito prima di ogni test
 * Pulisce tutte le collezioni del database e crea un articolo di test
 */
beforeEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    
    // Itera su tutte le collezioni e cancella tutti i documenti
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    // Crea un articolo di test per i test delle citazioni
    testArticle = await Article.create({
      title: 'Test Parent Article',
      authors: ['Test Author'],
      year: 2024,
      journal: 'Test Journal',
      abstract: 'This is a test article for citation tests'
    });
    
    console.log('🧹 Database pulito prima del test');
  } catch (error) {
    console.error('❌ Errore durante la pulizia del database:', error);
    throw error;
  }
});

/**
 * Helper function: Restituisce l'articolo genitore di test
 * Utilizzato nei test delle citazioni
 * @returns {Object} - L'articolo di test creato
 */
function getParentArticle() {
  if (!testArticle) {
    throw new Error('❌ Test article non ancora creato! Assicurati che beforeEach sia stato eseguito.');
  }
  return testArticle;
}

/**
 * ⚠️ IMPORTANTE: Aumenta il timeout per Jest
 * I test di integrazione possono richiedere più tempo
 */
jest.setTimeout(10000); // 10 secondi per test

// Esporta la funzione helper
module.exports = {
  getParentArticle
};