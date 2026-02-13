const express = require('express');
const articleRoutes = require('./articleRoutes');
const citationRoutes = require('./citationRoutes');

const router = express.Router();

router.use('/articles', articleRoutes);
router.use('/citations', citationRoutes);

// router.use('/citations', citationRoutes);
// Sub routes per moduli futuri possono essere aggiunti qui

// Questo router gestirà le rotte principali dell'API
// Rotta di esempio temporanea per verificare che l'API è attiva
router.get('/', (req, res) => {
    res.status(200).json({ message: 'API V1 in esecuzione. Pronto per i moduli Articoli e Citazioni.' });
});

module.exports = router;