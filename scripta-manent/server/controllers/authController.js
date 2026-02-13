const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Funzione helper per generare il token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Il token scade in 1 giorno
  });
};

// Registrazione Utente 
// POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Un utente con questa email esiste già.' });
    }

    // Il modello User gestirà l'hashing della password
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Genera il token per l'auto-login
      const token = generateToken(user._id);
      res.status(201).json({
        message: 'Registrazione completata con successo.',
        token: token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      res.status(400).json({ message: 'Dati utente non validi.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
};

// Login Utente 
// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verifica utente e password corretti tramite il metodo comparePassword
    if (user && (await user.comparePassword(password))) {
      // Genera il token JWT
      const token = generateToken(user._id);
      res.json({
        message: 'Login effettuato con successo.',
        token: token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      // Messaggio generico per motivi di sicurezza
      res.status(401).json({ message: 'Credenziali non valide.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};