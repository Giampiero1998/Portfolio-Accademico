//Creazione dello schema di validazione per le citazioni
const { z } = require('zod');
const objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

const citationSchema = z.object({
    articleId: z.string({required_error: "L'ID dell'articolo è obbligatorio"}).regex(objectIdRegex, 'ID dell\'articolo non valido'),
    referenceText: z.string({required_error: "Il testo di riferimento è obbligatorio"}).min(5, "Il testo di riferimento deve contenere almeno 5 caratteri").max(1000),
    citedArticleId: z.string().regex(objectIdRegex, 'ID dell\'articolo citato non valido').optional(),
    pagesCited: z.string().max(100).optional(),
    createdAt: z.date().default(new Date())
});

module.exports = { 
    createCitationSchema: citationSchema,
    updateCitationSchema: citationSchema.partial().and (z.object({
        articleId: z.string().regex(objectIdRegex).optional(),
    })),
 };