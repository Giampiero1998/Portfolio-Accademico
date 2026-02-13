const { z } = require('zod');

/**
 * Funzione di middleware generica per la validazione dello schema in Express.
 * Utilizza Zod per parsare e validare il corpo (body) della richiesta.
 * @param {z.ZodObject} schema - Lo schema Zod da utilizzare per la validazione
 * @returns {Function} Middleware di validazione    
 */
const validate = (schema) => (req, res, next) => {
    try {
        // Usa schema.safeParse per validare i dati in ingresso
        schema.parse(req.body); 
        
        // Se la validazione ha successo, passa al middleware successivo
        next(); 
    } catch (error) {
        // Se si verifica un errore di validazione
        if (error instanceof z.ZodError) {
            // Estrae gli errori di validazione
            const validationErrors = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            
            // Restituisce un errore 400 Bad Request con i dettagli degli errori di validazione
            return res.status(400).json({
                status: 'fail',
                message: 'Errore di validazione dei dati in ingresso',
                errors: validationErrors,
            });
        }
        
        // Per altri errori, passa al gestore di errori successivo
        next(error); 
    }
};

module.exports = validate;