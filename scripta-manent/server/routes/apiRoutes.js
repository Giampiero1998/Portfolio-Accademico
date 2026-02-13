const express = require('express');
const router = express.Router();

// Questo router gestirà le rotte API versionate (es. /api/v1/...)
// Rotta di esempio temporanea per verificare che l'API sia attiva
router.get('/', (req, res) => {
    res.status(200).json({ message: 'API V1 in esecuzione. Pronto per i moduli Articoli e Citazioni.' });
});

module.exports = router;