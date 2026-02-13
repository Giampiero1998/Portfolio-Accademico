const mongoose = require('mongoose');

// Definizione dello schema per gli articoli accademici
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Il titolo è obbligatorio.'],
        trim: true,
    },
    authors: {
        type: [String],
        required: [true, 'È richiesto almeno un autore.'],
    },
    journal: {
        type: String,
        trim: true,
    },
    volume: String,
    issue: String,
    year: {
        type: Number,
        required: [true, 'L\'anno di pubblicazione è obbligatorio.'],
        min: 1800, // Assicuriamoci che l'anno sia realistico
        max: new Date().getFullYear(),
    },
    pages: String, // Es. "513-538"
    abstract: {
        type: String,
        required: false,
    },
    // Referencing: Array di ObjectId che puntano ai documenti Citation
    citations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Citation',
    }],
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//Creazione dell'indice per la ricerca full-text sul titolo e sull'abstract
articleSchema.index({ title: 'text', abstract: 'text', authors: 'text' }, {name: 'TextSearchIndex',weights: { title: 5, abstract: 1, authors: 1 }});

module.exports = mongoose.model('Article', articleSchema);