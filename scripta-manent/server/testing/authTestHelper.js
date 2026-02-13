const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Crea un utente di test e genera un token JWT valido
 * @returns {Promise<{user: Object, token: string}>}
 */
async function createAuthenticatedUser() {
  console.log('🔍 CREATE AUTH USER - Starting...');
  console.log('🔍 CREATE AUTH USER - JWT_SECRET:', process.env.JWT_SECRET || 'Using default: test-secret-key-for-jest');
  
  // Crea un utente di test
  const user = await User.create({
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    name: 'Test User'
  });

  console.log('🔍 CREATE AUTH USER - User created:', user.email, 'ID:', user._id);

  // Genera token JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'test-secret-key-for-jest',
    { expiresIn: '1h' }
  );

  console.log('🔍 CREATE AUTH USER - Token generated:', token ? token.substring(0, 30) + '...' : 'NULL');

  // 🔍 VERIFICA IMMEDIATA DEL TOKEN
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-key-for-jest');
    console.log('✅ CREATE AUTH USER - Token verification SUCCESS:', decoded);
  } catch (err) {
    console.error('❌ CREATE AUTH USER - Token verification FAILED:', err.message);
  }

  return { user, token };
}

/**
 * Genera un token JWT per un utente esistente
 * @param {Object} user - L'utente per cui generare il token
 * @returns {string} - Token JWT
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'test-secret-key-for-jest',
    { expiresIn: '1h' }
  );
}

/**
 * Restituisce l'header Authorization con Bearer token
 * @param {string} token - Token JWT
 * @returns {Object} - Oggetto header per supertest
 */
function getAuthHeader(token) {
  const header = { Authorization: `Bearer ${token}` };
  console.log('🔍 GET AUTH HEADER - Returning:', header);
  return header;
}

module.exports = {
  createAuthenticatedUser,
  generateToken,
  getAuthHeader
};