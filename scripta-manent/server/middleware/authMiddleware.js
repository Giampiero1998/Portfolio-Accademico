const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 🔍 DEBUG
    console.log('🔍 AUTH MIDDLEWARE - Headers:', req.headers.authorization);
    console.log('🔍 AUTH MIDDLEWARE - JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

    // Controlla se l'header Authorization esiste e inizia con "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('🔍 AUTH MIDDLEWARE - Token extracted:', token ? token.substring(0, 20) + '...' : 'NULL');
    }

    // Controllo token FUORI dal blocco if
    if (!token) {
        console.log('❌ AUTH MIDDLEWARE - No token found');
        return res.status(401).json({ 
            status: 'fail',
            message: 'Accesso negato. Token non fornito.' 
        });
    }

    try {
        // Verifica il token usando la tua chiave segreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔍 AUTH MIDDLEWARE - Token decoded:', decoded);

        // Trova l'utente nel DB e allegalo all'oggetto 'req'
        req.user = await User.findById(decoded.userId).select('-password');
        
        console.log('🔍 AUTH MIDDLEWARE - User found:', req.user ? req.user.email : 'NULL');
        
        if (!req.user) {
            console.log('❌ AUTH MIDDLEWARE - User not found in DB');
            return res.status(401).json({ 
                status: 'fail',
                message: 'Utente non trovato.' 
            });
        }

        console.log('✅ AUTH MIDDLEWARE - Authentication successful');
        next();
    } catch (error) {
        console.error('❌ AUTH MIDDLEWARE - Error:', error.message);
        return res.status(401).json({ 
            status: 'fail',
            message: 'Accesso negato. Token non valido o scaduto.' 
        });
    }
};