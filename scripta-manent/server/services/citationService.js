const mongoose = require('mongoose');
const Citation = require('../models/Citation');
const Article = require('../models/Article');

exports.createCitation = async ({ articleId, referenceText, pagesCited }) => {
  if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
    const err = new Error('articleId mancante o non valido.');
    err.statusCode = 400; // Garantisce che FUN-B02 riceva 400
    throw err;
  }

  const parentArticle = await Article.findById(articleId);
  if (!parentArticle) {
    const err = new Error('Articolo genitore non trovato.');
    err.statusCode = 400; // Garantisce che FUN-B02 riceva 400 per ID inesistente
    throw err;
  }
  
  // La creazione fallisce se mancano referenceText/pagesCited (ValidationError di Mongoose)
  return await Citation.create({ articleId, referenceText, pagesCited }); 
};

exports.getAllCitations = async (query = {}) => {
  return await Citation.find(query).sort({ createdAt: -1 }).select('-__v').lean();
};

exports.getCitationById = async (citationId) => {
  if (!mongoose.Types.ObjectId.isValid(citationId)) {
    const err = new Error('ID citazione non valido');
    err.statusCode = 400;
    throw err;
  }

  const citation = await Citation.findById(citationId).select('-__v').lean();
  if (!citation) {
    const err = new Error('Citazione non trovata');
    err.statusCode = 404;
    throw err;
  }
  return citation;
};

exports.updateCitation = async (citationId, citationData) => {
  if (!mongoose.Types.ObjectId.isValid(citationId)) {
    const err = new Error('ID citazione non valido');
    err.statusCode = 400;
    throw err;
  }

  // Usiamo runValidators per assicurare che la validazione Mongoose sia eseguita
  const updatedCitation = await Citation.findByIdAndUpdate(citationId, citationData, { new: true, runValidators: true }).select('-__v').lean();
  if (!updatedCitation) {
    const err = new Error('Citazione non trovata');
    err.statusCode = 404;
    throw err;
  }
  return updatedCitation;
};

exports.deleteCitation = async (citationId) => {
  if (!mongoose.Types.ObjectId.isValid(citationId)) {
    const err = new Error('ID citazione non valido');
    err.statusCode = 400;
    throw err;
  }

  // 1. Trova ed elimina la citazione
  const deletedCitation = await Citation.findByIdAndDelete(citationId);
  if (!deletedCitation) {
    const err = new Error('Citazione non trovata');
    err.statusCode = 404;
    throw err;
  }

  // 2. Rimuovi l'ID della citazione dall'articolo genitore (FUN-B05)
  const articleId = deletedCitation.articleId;
  const updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    { $pull: { citations: deletedCitation._id } },
    { new: true }
  );

  if (!updatedArticle) {
      console.warn(`Articolo genitore ${articleId} non trovato durante la pulizia dopo l'eliminazione della citazione.`);
  }

  return deletedCitation;
};



