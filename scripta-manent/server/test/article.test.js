// /server/test/article.test.js
const request = require('supertest');
const app = require('../server'); 
const Article = require('../models/Article');
const { createAuthenticatedUser, getAuthHeader } = require('../testing/authTestHelper');

// Dati Articolo di Test Standard
const VALID_DATA = {
    title: 'Functional Testing in Scalable APIs',
    authors: ['Alice Smith', 'Bob Johnson'],
    year: new Date().getFullYear(), // Anno corrente
    journal: 'Software Architecture Review',
    abstract: 'Analysis of isolation techniques for integration testing.',
};

// Dati Articolo Non Valido (violazione dello schema Zod)
const INVALID_DATA = {
    title: 'Bad Data Test',
    authors: [], // Manca un autore (min: 1)
    year: 2050, // Anno futuro (max: anno corrente)
};

let createdArticleId;
let authToken; // Token di autenticazione per i test

describe('Article API Endpoints (/api/portfolio/articles)', () => {
    beforeEach(async () => {
        const { token } = await createAuthenticatedUser();
        authToken = token;
    });

    // --- FUN-B01: POST - Creazione Riuscita ---
    test('FUN-B01: dovrebbe creare un nuovo articolo e restituire 201 Created', async () => {
        const response = await request(app)
          .post('/api/portfolio/articles')
          .set(getAuthHeader(authToken)) // ✅ Aggiungi autenticazione
          .send(VALID_DATA);

        expect(response.statusCode).toBe(201); // Standard RESTful [5]
        expect(response.body.status).toBe('success');
        expect(response.body.data.article.title).toBe(VALID_DATA.title);
        expect(response.body.data.article.authors.length).toBe(2);
        
        // Memorizza l'ID per i test successivi
        createdArticleId = response.body.data.article._id;
    });

    // --- FUN-B02: POST - Validazione Zod Fallita (400) ---
    test('FUN-B02: dovrebbe rifiutare la creazione con dati non validi e restituire 400 Bad Request', async () => {
        const response = await request(app)
          .post('/api/portfolio/articles')
          .set(getAuthHeader(authToken)) // ✅ Aggiungi autenticazione
          .send(INVALID_DATA);

        expect(response.statusCode).toBe(400); // Bad Request [6]
        expect(response.body.status).toBe('fail');
        
        // Verifica la presenza di errori di validazione di Zod
        expect(response.body.errors).toBeDefined();
        // Verifica che ci sia almeno un errore sull'anno (2050) o sugli autori
        expect(response.body.errors.some(e => e.path === 'year' || e.path === 'authors')).toBe(true); 
    });

    // --- FUN-B03: GET /:id - Lettura Articolo Singolo (200) ---
    test('FUN-B03: dovrebbe recuperare l\'articolo tramite ID creato e restituire 200 OK', async () => {
        // Creazione di un'istanza necessaria per il test
        const initialArticle = await Article.create(VALID_DATA);

        const response = await request(app)
          .get(`/api/portfolio/articles/${initialArticle._id}`);
        // ℹ️ GET non richiede autenticazione (rotta pubblica)

        expect(response.statusCode).toBe(200);
        expect(response.body.data.article.title).toBe(VALID_DATA.title);
    });

    // --- FUN-B04: PATCH /:id - Aggiornamento Parziale Riuscito ---
    test('FUN-B04: dovrebbe aggiornare solo l\'abstract (PATCH) e restituire 200 OK', async () => {
        const initialArticle = await Article.create(VALID_DATA);
        const update = { abstract: 'Nuovo abstract aggiornato per il test PATCH.' };
        
        const response = await request(app)
          .patch(`/api/portfolio/articles/${initialArticle._id}`)
          .set(getAuthHeader(authToken)) // ✅ Aggiungi autenticazione
          .send(update);

        expect(response.statusCode).toBe(200);
        expect(response.body.data.article.abstract).toBe(update.abstract);
        // Verifica che il campo 'year' non sia stato inavvertitamente modificato
        expect(response.body.data.article.year).toBe(VALID_DATA.year); 
    });

    // --- FUN-B05: DELETE /:id - Cancellazione Riuscita ---
    test('FUN-B05: dovrebbe cancellare un articolo tramite ID e restituire 204 No Content', async () => {
        const initialArticle = await Article.create(VALID_DATA);

        const response = await request(app)
          .delete(`/api/portfolio/articles/${initialArticle._id}`)
          .set(getAuthHeader(authToken)); // ✅ Aggiungi autenticazione

        expect(response.statusCode).toBe(204); // No Content [5]
        expect(response.body).toEqual({}); // Il corpo deve essere vuoto per 204
        
        // Verifica la cancellazione tentando di recuperare l'articolo
        const checkResponse = await request(app)
          .get(`/api/portfolio/articles/${initialArticle._id}`);
            
        expect(checkResponse.statusCode).toBe(404); // Not Found
    });
    
    // Test aggiuntivo (opzionale) per la Ricerca Full-Text (Task 2.16)
    test('FUN-B06: dovrebbe filtrare gli articoli usando la Ricerca Full-Text (?q=keywords)', async () => {
        await Article.create({...VALID_DATA, title: 'Deep Learning Optimization' });
        await Article.create({...VALID_DATA, title: 'Standard Software Testing' });

        const response = await request(app)
          .get('/api/portfolio/articles?q=Learning');
        // ℹ️ GET con query string non richiede autenticazione

        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.articles[0].title).toContain('Learning');
    });
});