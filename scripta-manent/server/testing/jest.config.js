/**
 * Configurazione Jest per i test del backend
 */

module.exports = {
  // Ambiente di esecuzione dei test
  testEnvironment: 'node',
  
  // File di setup globale eseguito dopo l'ambiente di test
  setupFilesAfterEnv: ['./testing/jest.setup.js'],
  
  // Pattern per trovare i file di test
  testMatch: [
    '**/test/**/*.test.js',
    '**/__tests__/**/*.test.js',
  ],
  
  // Directory da ignorare durante la ricerca dei test
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/testing/**',
  ],
  
  // Coverage thresholds (opzionale)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Directory per i report di coverage
  coverageDirectory: 'coverage',
  
  // Formato dei report di coverage
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Timeout globale per i test (in millisecondi)
  testTimeout: 10000,
  
  // Mostra output dettagliato
  verbose: true,
  
  // Forza l'uscita dopo il completamento dei test
  forceExit: true,
  
  // Pulisce i mock automaticamente tra i test
  clearMocks: true,
  
  // Ripristina i mock automaticamente tra i test
  restoreMocks: true,
};