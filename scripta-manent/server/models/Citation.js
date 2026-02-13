const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, "L'ID dell'articolo è obbligatorio"]
    },
    referenceText: {
        type: String,
        required: [true, "Il testo di riferimento è obbligatorio"]
    },
    citedArticleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: false
    },
    pagesCited: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Citation', citationSchema);