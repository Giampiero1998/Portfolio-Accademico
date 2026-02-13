const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Article = require('../models/Article');
const Citation = require('../models/Citation');
const { getParentArticle } = require('../testing/jest.setup');
const { createAuthenticatedUser, getAuthHeader } = require('../testing/authTestHelper');

const makeValidCitationData = (articleId) => ({
  articleId: articleId.toString(),
  referenceText: 'Mongoose and Zod validation, 2024.',
  pagesCited: '1-10',
});

describe('Citation API Endpoints (/api/portfolio/citations)', () => {
  
  let authToken;
  let testUser;

  beforeEach(async () => {
    const { token, user } = await createAuthenticatedUser();
    authToken = token;
    testUser = user;
    
    // Log minimi per confermare il fix
    // console.log('👤 User ricreato per il test:', user._id);
  });

  test('FUN-B01: crea una citazione e aggiorna l\'articolo genitore', async () => {
    const parentArticle = getParentArticle();
    const VALID_CITATION_DATA = makeValidCitationData(parentArticle._id);

    const res = await request(app)
      .post('/api/portfolio/citations')
      .set(getAuthHeader(authToken))
      .send(VALID_CITATION_DATA);

    expect(res.statusCode).toBe(201);

    const citationId = res.body.data.citation._id;
    const updatedArticle = await Article.findById(parentArticle._id);
    expect(updatedArticle).not.toBeNull();
    expect(updatedArticle.citations.map(id => id.toString())).toContain(citationId);
  });

  test('FUN-B02: ritorna 400 se articleId è assente o non valido', async () => {
    const parentArticle = getParentArticle();

    let res = await request(app)
      .post('/api/portfolio/citations')
      .set(getAuthHeader(authToken))
      .send({ referenceText: 'Test', pagesCited: '1-5' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toContain('Errore di validazione');

    const invalidId = { 
      ...makeValidCitationData(parentArticle._id), 
      articleId: new mongoose.Types.ObjectId().toString() 
    };
    
    res = await request(app)
      .post('/api/portfolio/citations')
      .set(getAuthHeader(authToken))
      .send(invalidId);
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toContain('Articolo genitore non trovato');
  });

  test('FUN-B03: recupera citazione tramite ID', async () => {
    const parentArticle = getParentArticle();
    const citation = await Citation.create(makeValidCitationData(parentArticle._id));

    const res = await request(app)
      .get(`/api/portfolio/citations/${citation._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.citation.referenceText).toBe(citation.referenceText);
  });

  test('FUN-B04: filtra citazioni per articolo genitore', async () => {
    const parentArticle = getParentArticle();
    await Citation.create(makeValidCitationData(parentArticle._id));

    const otherArticle = await Article.create({ 
      title: 'Altro Paper', 
      year: 2023, 
      authors: ['Altro'] 
    });
    await Citation.create(makeValidCitationData(otherArticle._id));

    const res = await request(app)
      .get(`/api/portfolio/citations?articleId=${otherArticle._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toBe(1);
    expect(res.body.data.citations[0].articleId).toBe(otherArticle._id.toString());
  });

  test('FUN-B05: cancella citazione e aggiorna articolo genitore', async () => {
    const parentArticle = getParentArticle();
    const citation = await Citation.create(makeValidCitationData(parentArticle._id));
    await Article.findByIdAndUpdate(parentArticle._id, { $push: { citations: citation._id } });

    const res = await request(app)
      .delete(`/api/portfolio/citations/${citation._id}`)
      .set(getAuthHeader(authToken));

    expect(res.statusCode).toBe(204);

    const updated = await Article.findById(parentArticle._id);
    expect(updated).not.toBeNull();
    expect(updated.citations.length).toBe(0);
  });

  test('FUN-B06: aggiorna una citazione esistente', async () => {
    const parentArticle = getParentArticle();
    const citation = await Citation.create(makeValidCitationData(parentArticle._id));

    const updateData = {
      referenceText: 'Testo aggiornato 2025.',
      pagesCited: '100-110',
    };

    const res = await request(app)
      .patch(`/api/portfolio/citations/${citation._id}`)
      .set(getAuthHeader(authToken))
      .send(updateData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.citation.referenceText).toBe(updateData.referenceText);
    expect(res.body.data.citation.pagesCited).toBe(updateData.pagesCited);
    
    const fakeId = new mongoose.Types.ObjectId();
    const resNotFound = await request(app)
      .patch(`/api/portfolio/citations/${fakeId}`)
      .set(getAuthHeader(authToken))
      .send(updateData);
    
    expect(resNotFound.statusCode).toBe(404);
    expect(resNotFound.body.message).toContain('Citazione non trovata');

    const longText = 'A'.repeat(1001);
    const resZodFail = await request(app)
      .patch(`/api/portfolio/citations/${citation._id}`)
      .set(getAuthHeader(authToken))
      .send({ referenceText: longText });
    
    expect(resZodFail.statusCode).toBe(400);
    expect(resZodFail.body.message).toContain('Errore di validazione');
  });
  
  test('FUN-B07: ritorna 400 se si fornisce un ID citazione malformato', async () => {
    const res = await request(app)
      .get(`/api/portfolio/citations/123`);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toContain('ID citazione non valido');
  });
});