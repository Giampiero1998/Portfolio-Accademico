const mongoose = require('mongoose');
const citationService = require('../services/citationService');
const Article = require('../models/Article');

// POST /api/portfolio/citations
exports.createCitation = async (req, res, next) => {
  try {
    const { articleId, referenceText, pagesCited } = req.body;

    // Controllo ID articolo genitore (anche se Zod lo ha validato, controlliamo l'esistenza)
    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ status: 'fail', message: 'articleId mancante o non valido.' });
    }

    const parentArticle = await Article.findById(articleId);
    if (!parentArticle) {
      return res.status(400).json({ status: 'fail', message: 'Articolo genitore non trovato.' });
    }

    const newCitation = await citationService.createCitation({ articleId, referenceText, pagesCited });
    
    // Aggiorna l'articolo genitore
    parentArticle.citations.push(newCitation._id);
    await parentArticle.save();

    res.status(201).json({ status: 'success', data: { citation: newCitation } });
  } catch (error) {
    next(error);
  }
};

// GET /api/portfolio/citations
exports.getAllCitations = async (req, res, next) => {
  try {
    // Filtro per articleId se presente nella query
    const query = req.query.articleId ? { articleId: req.query.articleId } : {};
    const citations = await citationService.getAllCitations(query);
    
    res.status(200).json({ status: 'success', results: citations.length, data: { citations } });
  } catch (error) {
    next(error);
  }
};

// GET /api/portfolio/citations/:id
exports.getCitationById = async (req, res, next) => {
  try {
    const citation = await citationService.getCitationById(req.params.id);
    res.status(200).json({ status: 'success', data: { citation } });
  } catch (error) {
    // Gestione errori 404/400 gestiti dal service
    if (error.statusCode === 404) return res.status(404).json({ status: 'fail', message: error.message });
    if (error.statusCode === 400) return res.status(400).json({ status: 'fail', message: error.message });
    next(error);
  }
};

// PATCH /api/portfolio/citations/:id
exports.updateCitationById = async (req, res, next) => {
  try {
    const updatedCitation = await citationService.updateCitation(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { citation: updatedCitation } });
  } catch (error) {
    // Gestione errori 404/400 gestiti dal service
    if (error.statusCode === 404) return res.status(404).json({ status: 'fail', message: error.message });
    if (error.statusCode === 400) return res.status(400).json({ status: 'fail', message: error.message });
    next(error);
  }
};

// DELETE /api/portfolio/citations/:id
exports.deleteCitation = async (req, res, next) => {
  try {
    const deletedCitation = await citationService.deleteCitation(req.params.id);

    // Rimuove la citazione dall'array 'citations' dell'articolo genitore
    if (deletedCitation && deletedCitation.articleId) {
      await Article.findByIdAndUpdate(deletedCitation.articleId, {
        $pull: { citations: deletedCitation._id }
      });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    // Gestione errori 404/400 gestiti dal service
    if (error.statusCode === 404) return res.status(404).json({ status: 'fail', message: error.message });
    if (error.statusCode === 400) return res.status(400).json({ status: 'fail', message: error.message });
    next(error);
  }
};


