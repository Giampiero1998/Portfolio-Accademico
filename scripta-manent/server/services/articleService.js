const Article = require('../models/Article');
const mongoose = require('mongoose');

/**
 * Crea un nuovo articolo nel database.
 * @param {Object} articleData - Dati validati dell'articolo.
 * @returns {Promise<Article>} L'oggetto dell'articolo appena creato.
 */
exports.createArticle = async (articleData) => {
    const newArticle = await Article.create(articleData);
    return newArticle;
};

/**
 * Crea più articoli nel database in un'unica operazione.
 * @param {Array<Object>} articlesData - Array di dati validati degli articoli.
 * @returns {Promise<Array<Article>>} Lista degli articoli appena creati.
 */
exports.createMultipleArticles = async (articlesData) => {
    const newArticles = await Article.insertMany(articlesData);
    return newArticles;
};

/**
 * ✨ TASK 4.1 & 4.2: Funzione helper per costruire la query di ricerca avanzata.
 * Supporta:
 * - Ricerca full-text con score (?q=learning)
 * - Filtri combinati (?year=2024&authors=Smith)
 * - Operatori di confronto (?year[gte]=2020&year[lte]=2024)
 * - Paginazione (?limit=10&skip=0)
 * 
 * @param {Object} queryParams - Parametri della query dalla richiesta.
 * @returns {Object} - Oggetto contenente query, sort, limit, skip e projection.
 */
const buildAdvancedQuery = (queryParams) => {
    let query = {};
    let sort = { year: -1, title: 1 }; // Default: ordina per anno DESC, poi titolo ASC
    let projection = { __v: 0 }; // Escludi sempre __v
    let limit = 100; // Default limit
    let skip = 0; // Default skip (nessuna paginazione)

    // Ricerca full-text con textScore
    if (queryParams.q) {
        query.$text = { $search: queryParams.q };
        // Quando c'è ricerca full-text, ordina per relevance score
        sort = { score: { $meta: "textScore" } };
        // Aggiungi il campo score alla projection per restituirlo nella risposta
        projection.score = { $meta: "textScore" };
    }

    // Paginazione
    if (queryParams.limit) {
        limit = parseInt(queryParams.limit, 10);
        if (isNaN(limit) || limit < 1) limit = 100; // Fallback a 100
    }

    if (queryParams.skip) {
        skip = parseInt(queryParams.skip, 10);
        if (isNaN(skip) || skip < 0) skip = 0; // Fallback a 0
    }

    // Se viene passato 'page', calcoliamo skip automaticamente
    if (queryParams.page) {
        const page = parseInt(queryParams.page, 10);
        if (!isNaN(page) && page > 0) {
            skip = (page - 1) * limit;
        }
    }

    // Filtri per proprietà specifiche
    const excludeFields = ['q', 'sort', 'order', 'page', 'limit', 'skip'];
    const filterQuery = { ...queryParams };
    
    // Rimuove i campi non necessari per il filtraggio
    excludeFields.forEach(el => delete filterQuery[el]);

    // Converte operatori di confronto in formato MongoDB
    let queryStr = JSON.stringify(filterQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
    query = { ...query, ...JSON.parse(queryStr) };

    // ✅ Custom sorting 
    if (queryParams.sort && !queryParams.q) {
        const sortBy = queryParams.sort.split(',').join(' ');
        sort = sortBy;
    }

    return { query, sort, projection, limit, skip };
};

/**
 * Recupera tutti gli articoli con supporto completo per:
 * - Ricerca full-text con relevance score
 * - Filtri combinati
 * - Paginazione
 * 
 * @param {Object} queryParams - Parametri dalla query string
 * @returns {Promise<Array<Article>>} Lista di articoli
 */
exports.getAllArticles = async (queryParams = {}) => {
    try {
        const { query, sort, projection, limit, skip } = buildAdvancedQuery(queryParams);
        
        const articles = await Article.find(query, projection)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .exec();
        
        return articles;
    } catch (err) {
        console.error('Errore in getAllArticles:', err.message);
        throw err;
    }
};

/**
 * Recupera un articolo per ID.
 * @param {String} articleId - ID dell'articolo.
 * @returns {Promise<Article|null>} L'articolo trovato o null se non esiste.
 */
exports.getArticleById = async (articleId) => {
    // ✅ TASK 4.4: Validazione ID prima di cercare
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        const error = new Error('ID articolo non valido');
        error.statusCode = 400;
        error.name = 'CastError';
        throw error;
    }

    const article = await Article.findById(articleId).select('-__v');
    if (!article) {
        const error = new Error('Articolo non trovato con l\'ID fornito');
        error.statusCode = 404;
        throw error;
    }
    return article;
};

/**
 * Recupera un articolo con tutte le sue citazioni (usando Aggregation Pipeline)
 * 
 * @param {String} articleId - ID dell'articolo
 * @returns {Promise<Object>} Articolo con array di citazioni popolate
 */
exports.getArticleWithCitations = async (articleId) => {
    // ✅Validazione ID
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        const error = new Error('ID articolo non valido');
        error.statusCode = 400;
        error.name = 'CastError';
        throw error;
    }

    const result = await Article.aggregate([
        // Stage 1: Filtra per ID specifico
        {
            $match: { _id: new mongoose.Types.ObjectId(articleId) }
        },
        // Stage 2: Lookup (JOIN) con la collection Citation
        {
            $lookup: {
                from: 'citations', // Nome della collection in MongoDB (plurale minuscolo)
                localField: 'citations', // Campo nell'Article che contiene gli ID
                foreignField: '_id', // Campo nella Citation da matchare
                as: 'citationsData' // Nome del campo risultante con l'array di citazioni
            }
        },
        // Stage 3: Proiezione per escludere __v e riorganizzare i dati
        {
            $project: {
                __v: 0,
                'citationsData.__v': 0
            }
        }
    ]);

    // Se non trova l'articolo, lancia errore 404
    if (!result || result.length === 0) {
        const error = new Error('Articolo non trovato con l\'ID fornito');
        error.statusCode = 404;
        throw error;
    }

    // Restituisce il primo (e unico) elemento dell'array
    return result[0];
};

/**
 * Aggiorna un articolo esistente.
 * @param {String} articleId - ID dell'articolo da aggiornare.
 * @param {Object} updateData - Dati aggiornati dell'articolo.
 * @returns {Promise<Article>} L'articolo aggiornato.
 */
exports.updateArticle = async (articleId, updateData) => {
    // ✅ TASK 4.4: Validazione ID
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        const error = new Error('ID articolo non valido');
        error.statusCode = 400;
        error.name = 'CastError';
        throw error;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
        articleId, 
        updateData, 
        { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedArticle) {
        const error = new Error('Articolo non trovato');
        error.statusCode = 404;
        throw error;
    }
    return updatedArticle;
};

/**
 * Elimina un articolo per ID.
 * @param {String} articleId - ID dell'articolo da eliminare.
 * @returns {Promise<void>}
 */
exports.deleteArticle = async (articleId) => {
    // ✅ TASK 4.4: Validazione ID
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        const error = new Error('ID articolo non valido');
        error.statusCode = 400;
        error.name = 'CastError';
        throw error;
    }

    const deletedArticle = await Article.findByIdAndDelete(articleId);
    if (!deletedArticle) {
        const error = new Error('Articolo non trovato');
        error.statusCode = 404;
        throw error;
    }
    return null;
};