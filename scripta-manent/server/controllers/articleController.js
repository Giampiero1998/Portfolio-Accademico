const articleService = require('../services/articleService');

// HTTP POST /api/portfolio/articles
exports.createArticle = async (req, res, next) => {
    try {
        const articleData = req.body;
        const newArticle = await articleService.createArticle(articleData);

        res.status(201).json({
            status: 'success',
            data: {
                article: newArticle
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

// HTTP GET /api/portfolio/articles
// Supporta ricerca full-text, filtri avanzati e paginazione
exports.getAllArticles = async (req, res, next) => {
    try {
        const queryParams = req.query;
        const articles = await articleService.getAllArticles(queryParams);

        // Metadati aggiuntivi per la paginazione
        res.status(200).json({
            status: 'success',
            results: articles.length,
            data: {
                articles
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

// HTTP GET /api/portfolio/articles/:id
exports.getArticleById = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const article = await articleService.getArticleById(articleId);
        res.status(200).json({
            status: 'success',
            data: {
                article
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        if (error.statusCode === 400) {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

// HTTP GET /api/portfolio/articles/:id/with-citations
// Nuovo endpoint che ritorna l'articolo con tutte le citazioni popolate
exports.getArticleWithCitations = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const articleWithCitations = await articleService.getArticleWithCitations(articleId);
        
        res.status(200).json({
            status: 'success',
            data: {
                article: articleWithCitations
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        if (error.statusCode === 400) {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

// HTTP PATCH /api/portfolio/articles/:id
exports.updateArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const updateData = req.body;

        const updatedArticle = await articleService.updateArticle(articleId, updateData);
        res.status(200).json({
            status: 'success',
            data: {
                article: updatedArticle
            }
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        if (error.statusCode === 400) {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};

// HTTP DELETE /api/portfolio/articles/:id
exports.deleteArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        await articleService.deleteArticle(articleId);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ status: 'fail', message: error.message });
        }
        if (error.statusCode === 400) {
            return res.status(400).json({ status: 'fail', message: error.message });
        }
        next(error);
    }
};
