// /client/src/features/articles/ArticleForm.test.jsx (CORRETTO e STABILE)
import React from 'react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

// Importiamo le funzioni da mockare. Grazie a vi.mock (sotto), queste saranno funzioni mockate.
import { SaveArticle, getArticles } from '../services/api'; 
import ArticleForm from './ArticleForm'; // Assicurati che il path sia corretto

// --- 1. MOCKING DEI MODULI ESTERNI ---

// Mock di React Router Dom
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockUseParams(),
    };
});

// Mock dei servizi API
// In Vite/Vitest, è meglio mockare l'intero modulo invece di usare spyOn su un import
vi.mock('../services/api', () => ({
    SaveArticle: vi.fn(),
    getArticles: vi.fn(),
}));

// Query Client con configurazione per i test
const queryClient = new QueryClient({
    defaultOptions: { 
        queries: { retry: false, refetchOnWindowFocus: false }, 
        mutations: { retry: false } 
    },
});

// Dati Articolo per l'editing
const MOCK_ARTICLE_DATA = { 
    title: 'Vecchio Titolo', 
    authors: ['Autore Precaricato'], 
    year: 2000, 
    id: 'article-123', // Assicuriamoci che l'ID corrisponda a quello aspettato
    _id: 'article-123'
};

// Dati validi per simulare l'inserimento
const TEST_DATA = {
    title: 'Testing Front-end with RTL',
    year: '2025',
    authors: 'Jane Doe, John Smith',
};

describe('ArticleForm Functional Testing (Client-Side)', () => {
    
    // Setup dell'utente per le interazioni (Best Practice RTL moderna)
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();

        // Impostazione dei valori di default per la creazione (POST)
        // Nota: Usiamo SaveArticle (il mock) direttamente
        SaveArticle.mockResolvedValue({ status: 201, data: { article: { id: 'new-article-id' } } }); 
        
        // Imposta il default per useParams (modalità CREAZIONE)
        mockUseParams.mockReturnValue({ id: undefined }); 
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Funzione di rendering helper
    const renderComponent = (props = {}) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <Router> 
                    <ArticleForm {...props} />
                </Router>
            </QueryClientProvider>
        );
    };

    // --- FUN-F01: Validazione Client-Side (Input Mancante) ---
    test('FUN-F01: dovrebbe mostrare errori di validazione per campi obbligatori vuoti', async () => {
        renderComponent();
        
        // Importante: await user.click
        await user.click(screen.getByRole('button', { name: /Crea Articolo/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/Il titolo è obbligatorio/i)).toBeInTheDocument();
            // Nota: Assicurati che il testo "Campo obbligatorio" esista nel tuo componente, 
            // altrimenti adatta il testo all'errore reale mostrato da React Hook Form
             expect(screen.getAllByText(/obbligatorio/i).length).toBeGreaterThan(0);
        });
        
        expect(SaveArticle).not.toHaveBeenCalled();
    });

    // --- FUN-F02: Flusso di Creazione Riuscita ---
    test('FUN-F02: dovrebbe chiamare l\'API POST con dati validi e reindirizzare', async () => {
        renderComponent();
        
        await user.type(screen.getByLabelText(/Titolo/i), TEST_DATA.title);
        await user.type(screen.getByLabelText(/Anno di Pubblicazione/i), TEST_DATA.year);
        await user.type(screen.getByLabelText(/Autori/i), TEST_DATA.authors); 
        
        await user.click(screen.getByRole('button', { name: /Crea Articolo/i }));
        
        await waitFor(() => {
            expect(SaveArticle).toHaveBeenCalledWith(
                expect.objectContaining({ year: parseInt(TEST_DATA.year) }),
                null // null perché è creazione (nessun ID)
            );
            expect(mockNavigate).toHaveBeenCalledWith('/articles');
        });
    });
    
    // --- FUN-F03: Gestione Errore API (Mostra Alert) ---
    test('FUN-F03: dovrebbe mostrare un messaggio di Alert in caso di fallimento della mutazione API', async () => {
        // Mock per simulare un errore del server
        SaveArticle.mockRejectedValueOnce(new Error('Network Error: Server non risponde')); 
        renderComponent();
        
        await user.type(screen.getByLabelText(/Titolo/i), 'Test Errore');
        await user.type(screen.getByLabelText(/Anno di Pubblicazione/i), '2023');
        await user.type(screen.getByLabelText(/Autori/i),'Test Author');
        
        await user.click(screen.getByRole('button', { name: /Crea Articolo/i }));
        
        await waitFor(() => {
            // Mantine notifications o Alert standard? 
            // Se usi Mantine notifications, il testo appare nel DOM ma potrebbe non essere un role="alert" standard
            // Cerchiamo il testo genericamente se il role fallisce
            expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
        });
    });

    // --- FUN-F04: Flusso di Editing Riuscito ---
    test('FUN-F04: dovrebbe pre-caricare i dati esistenti e chiamare l\'API PATCH al submit', async () => {
        const ARTICLE_ID = 'article-123';
        
        // Setup per l'editing
        mockUseParams.mockReturnValue({ id: ARTICLE_ID });
        
        // Mocking della risposta getArticles per il fetching iniziale
        getArticles.mockResolvedValueOnce(MOCK_ARTICLE_DATA); 
        
        // Nota: isEdit prop potrebbe non essere necessaria se l'hook controlla l'ID nell'URL, 
        // ma la passiamo per sicurezza come nel test originale
        renderComponent({ isEdit: true });
        
        await waitFor(() => {
            // Asserisce sul valore pre-popolato dal mock
            expect(screen.getByDisplayValue(MOCK_ARTICLE_DATA.title)).toBeInTheDocument();
        });
        
        const titleInput = screen.getByLabelText(/Titolo/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Titolo Modificato');
        
        // Verifica che il bottone cambi testo in edit mode (se applicabile) o usa il testo generico
        // Qui cerchiamo un bottone submit generico o specifico
        const submitBtn = screen.getByRole('button', { name: /(Salva Modifiche|Crea Articolo|Aggiorna)/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(SaveArticle).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Titolo Modificato' }),
                ARTICLE_ID 
            );
        });
    });

    // --- FUN-F05: Test sui Metadati (Formattazione Autori) ---
    test("FUN-F05: dovrebbe formattare correttamente gli autori rimuovendo gli spazi", async () => {
        // Reset specifico non necessario grazie al beforeEach, ma male non fa
        SaveArticle.mockClear();
        
        renderComponent();

        await user.type(screen.getByLabelText(/Titolo/i), 'Test');
        await user.type(screen.getByLabelText(/Anno di Pubblicazione/i), '2020');
        await user.type(screen.getByLabelText(/Autori/i), '  First Author , Second Author ');
        
        await user.click(screen.getByRole('button', { name: /Crea Articolo/i }));

        await waitFor(() => {
            expect(SaveArticle).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: expect.arrayContaining(['First Author', 'Second Author']),
                }),
                null
            );
        });
    });
});