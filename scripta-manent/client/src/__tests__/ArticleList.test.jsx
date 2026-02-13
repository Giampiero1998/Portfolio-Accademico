import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react'; 
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ArticleList from '../features/articles/ArticleList'; 
import { MantineProvider } from '@mantine/core';

// Mocks
const mockNavigate = vi.fn();
const mockUpdateFilters = vi.fn();
const mockResetFilters = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock di default del custom hook useArticleFilters
const mockUseArticleFilters = vi.fn();
mockUseArticleFilters.mockReturnValue({
    filters: { q: '', authors: '', year: '' },
    updateFilters: mockUpdateFilters,
    resetFilters: mockResetFilters,
    hasActiveFilters: false, // Default: bottone reset disabilitato
    getApiFilters: () => ({}),
});

vi.mock('../../hooks/useArticleFilters', () => ({
  useArticleFilters: mockUseArticleFilters,
}));

// Mock di useAuthStore
vi.mock('../../store/authStore', () => ({
  default: (selector) => selector({ isLoggedIn: true }),
}));

// Mock di ArticleCard per isolarlo dai test
vi.mock('../features/articles/ArticleCard', () => ({
  default: ({ article }) => (
    <div data-testid="article-card">
      {article.title}
    </div>
  )
}));

// Mock di React Query
import * as ReactQuery from '@tanstack/react-query';
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
}));

// Wrapper per Mantine
const renderWithMantine = (ui) => {
  return render(
    <MantineProvider>{ui}</MantineProvider>
  );
};

describe('ArticleList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reimposta il mock di default per ogni test
    mockUseArticleFilters.mockReturnValue({
        filters: { q: '', authors: '', year: '' },
        updateFilters: mockUpdateFilters,
        resetFilters: mockResetFilters,
        hasActiveFilters: false,
        getApiFilters: () => ({}),
    });
  });

  // 1. Test Loading State
  it('mostra gli scheletri di caricamento quando isLoading è true', () => {
    ReactQuery.useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      isFetching: false,
    });

    renderWithMantine(<ArticleList />);
    const skeletons = document.getElementsByClassName('mantine-Skeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // 2. Test Empty State
  it('mostra messaggio quando non ci sono articoli', () => {
    ReactQuery.useQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    renderWithMantine(<ArticleList />);
    expect(screen.getByText(/Nessun articolo disponibile/i)).toBeInTheDocument();
  });

  // 3. Test Rendering Lista Articoli
  it('renderizza correttamente la lista degli articoli', () => {
    const mockArticles = [
      { _id: '1', title: 'React Testing', abstract: 'Intro to testing', authors: ['Mario'], year: 2024 },
      { _id: '2', title: 'Advanced Vitest', abstract: 'Deep dive', authors: ['Luigi'], year: 2024 }
    ];

    ReactQuery.useQuery.mockReturnValue({
      data: mockArticles,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    renderWithMantine(<ArticleList />);
    expect(screen.getByText('React Testing')).toBeInTheDocument();
    expect(screen.getByText('Advanced Vitest')).toBeInTheDocument();
  });

  // 4. Test Filtri di Ricerca
  it('chiama updateFilters quando si scrive nei campi di ricerca', () => {
    ReactQuery.useQuery.mockReturnValue({ data: [], isLoading: false });
    
    renderWithMantine(<ArticleList />);
    
    const searchInput = screen.getByPlaceholderText('Full-Text Search');
    fireEvent.change(searchInput, { target: { name: 'q', value: 'React' } });

    expect(mockUpdateFilters).toHaveBeenCalledWith(expect.objectContaining({
      q: 'React'
    }));
  });

  // 5. Test Reset Filtri 
  it('chiama resetFilters quando si clicca il bottone di reset', async () => {
    // 1. Configura il mock per simulare che ci siano filtri attivi
    mockUseArticleFilters.mockReturnValue({
        filters: { q: 'test' },
        updateFilters: mockUpdateFilters,
        resetFilters: mockResetFilters,
        hasActiveFilters: true,
        getApiFilters: () => ({ q: 'test' }),
    });

    ReactQuery.useQuery.mockReturnValue({ data: [], isLoading: false });

    renderWithMantine(<ArticleList />);
    
    const resetButton = screen.getByRole('button', { name: /Reset Filtri/i });
    expect(resetButton).not.toBeDisabled();
    
    fireEvent.click(resetButton);
    expect(mockResetFilters).toHaveBeenCalled();
    // Verifica che il bottone venga disabilitato dopo il reset
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reset Filtri/i })).toBeDisabled();
    });
  });
});