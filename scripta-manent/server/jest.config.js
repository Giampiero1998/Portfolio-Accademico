/** @type {import('jest').Config}   */
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./testing/jest.setup.js'],
  transform: {},
  verbose: true,
  detectOpenHandles: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};