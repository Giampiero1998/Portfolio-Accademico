const express = require('express');
const articleController = require('../controllers/articleController');
const validate = require('../middleware/validate'); 
const { createArticleSchema, updateArticleSchema } = require('../validation/articleSchema'); 
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Rotte pubbliche (GET)
router.get('/', articleController.getAllArticles);

// Nuovo endpoint per articolo con citazioni popolate
router.get('/:id/with-citations', articleController.getArticleWithCitations);

router.get('/:id', articleController.getArticleById);

// ✅ Rotte protette con validazione
router.post(
    '/', 
    protect, 
    validate(createArticleSchema),
    articleController.createArticle
);

router.patch(
    '/:id', 
    protect, 
    validate(updateArticleSchema),
    articleController.updateArticle
);

router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router;