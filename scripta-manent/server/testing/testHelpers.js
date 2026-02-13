/**
 * File di utilità per i test del backend
 * Fornisce funzioni helper riutilizzabili nei test
 * Posizione: server/testing/testHelpers.js
 */

const Article = require('../models/Article');
const Citation = require('../models/Citation');
const User = require('../models/User');

/**
 * Crea un articolo di test con dati predefiniti
 * @param {Object} overrides - Campi da sovrascrivere sui dati di default
 * @returns {Promise<Object>} Articolo creato
 */
async function createTestArticle(overrides = {}) {
  const defaultData = {
    title: 'Test Article Title',
    authors: ['Test Author 1', 'Test Author 2'],
    year: new Date().getFullYear(),
    journal: 'Test Journal',
    abstract: 'This is a test abstract for testing purposes.',
  };

  const articleData = { ...defaultData, ...overrides };
  return await Article.create(articleData);
}

/**
 * Crea un utente di test con dati predefiniti
 * @param {Object} overrides - Campi da sovrascrivere sui dati di default
 * @returns {Promise<Object>} Utente creato
 */
async function createTestUser(overrides = {}) {
  const defaultData = {
    email: `test-${Date.now()}@example.com`,
    password: 'testPassword123',
    name: 'Test User',
  };

  const userData = { ...defaultData, ...overrides };
  return await User.create(userData);
}

/**
 * Crea una citazione di test con dati predefiniti
 * @param {String|ObjectId} articleId - ID dell'articolo genitore
 * @param {Object} overrides - Campi da sovrascrivere sui dati di default
 * @returns {Promise<Object>} Citazione creata
 */
async function createTestCitation(articleId, overrides = {}) {
  const defaultData = {
    articleId: articleId,
    referenceText: 'This is a test reference text.',
    pagesCited: '10-15',
  };

  const citationData = { ...defaultData, ...overrides };
  return await Citation.create(citationData);
}

/**
 * Pulisce completamente il database (cancella tutte le collezioni)
 * @returns {Promise<void>}
 */
async function clearDatabase() {
  const collections = Object.keys(require('mongoose').connection.collections);
  for (const collectionName of collections) {
    const collection = require('mongoose').connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

/**
 * Genera un JWT token valido per i test
 * @param {String|ObjectId} userId - ID dell'utente
 * @returns {String} Token JWT
 */
function generateTestToken(userId) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
}

/**
 * Valida che una risposta di errore abbia la struttura corretta
 * @param {Object} response - Risposta della API
 * @param {Number} expectedStatus - Status code atteso
 * @param {String} expectedMessage - Messaggio di errore atteso (parziale)
 */
function expectErrorResponse(response, expectedStatus, expectedMessage) {
  expect(response.statusCode).toBe(expectedStatus);
  expect(response.body.status).toBe('fail');
  if (expectedMessage) {
    expect(response.body.message).toContain(expectedMessage);
  }
}

/**
 * Valida che una risposta di successo abbia la struttura corretta
 * @param {Object} response - Risposta della API
 * @param {Number} expectedStatus - Status code atteso
 */
function expectSuccessResponse(response, expectedStatus = 200) {
  expect(response.statusCode).toBe(expectedStatus);
  expect(response.body.status).toBe('success');
  expect(response.body.data).toBeDefined();
}

module.exports = {
  createTestArticle,
  createTestUser,
  createTestCitation,
  clearDatabase,
  generateTestToken,
  expectErrorResponse,
  expectSuccessResponse,
};