const { z } = require('zod');
// Schema Zod per la validazione degli articoli 
// Include campi obbligatori e opzionali
exports.createArticleSchema = z.object({
    title: z.string({
        required_error: "Il titolo è obbligatorio",
    }).min(1, "Il titolo non può essere vuoto"),

    // Autori: Array di stringhe, almeno un autore richiesto
    authors: z.array(
        z.string().min(1, "Il nome dell'autore non può essere vuoto")
    ).min(1, "È richiesto almeno un autore per l'articolo"),

    // Anno: Obbligatorio, numero intero tra 1800 e l'anno corrente
    year: z.number({
        required_error: "L'anno di pubblicazione è obbligatorio",
        invalid_type_error: "L'anno deve essere un numero"
    }).int().min(1800, "L'anno non è valido").max(new Date().getFullYear(), "L'anno non può essere nel futuro"),

    // Lista dei campi opzionali
    journal: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    abstract: z.string().optional(),
    citations: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "ID di citazione non valido")).optional(),
});

// Esporta gli schemi per la creazione e l'aggiornamento degli articoli
exports.updateArticleSchema = exports.createArticleSchema.partial();