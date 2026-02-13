import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { useArticleFilters } from '../../hooks/useArticleFilters';

describe('useArticleFilters Hook', () => {
  
  // Helper per wrappare l'hook nel Router (necessario per useSearchParams)
  const wrapper = ({ children, initialEntries = ['/articles'] }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

  // 1. Parsing URL Params Iniziali
  it('legge correttamente i filtri iniziali dalla URL', () => {
    const { result } = renderHook(() => useArticleFilters(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/articles?q=react&year=2024'] })
    });

    expect(result.current.filters.q).toBe('react');
    expect(result.current.filters.year).toBe('2024');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  // 2. Updating Filters (Aggiornamento URL)
  it('aggiorna i filtri e sincronizza la URL', () => {
    const { result } = renderHook(() => useArticleFilters(), {
      wrapper: ({ children }) => wrapper({ children })
    });

    act(() => {
      result.current.updateFilters({ q: 'vitest', authors: 'Mario' });
    });

    expect(result.current.filters.q).toBe('vitest');
    expect(result.current.filters.authors).toBe('Mario');
    
    // Testiamo getApiFilters
    const apiFilters = result.current.getApiFilters();
    expect(apiFilters).toEqual({ q: 'vitest', authors: 'Mario' });
  });

  // 3. Reset Filtri
  it('pulisce i filtri quando viene chiamato resetFilters', () => {
    const { result } = renderHook(() => useArticleFilters(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/articles?q=old'] })
    });

    // Conferma stato iniziale
    expect(result.current.filters.q).toBe('old');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.q).toBe('');
    expect(result.current.hasActiveFilters).toBe(false);
    expect(Object.keys(result.current.getApiFilters()).length).toBe(0);
  });

  // Test aggiuntivo: Pulizia valori vuoti
  it('non include stringhe vuote in getApiFilters', () => {
    const { result } = renderHook(() => useArticleFilters(), {
        wrapper: ({ children }) => wrapper({ children })
      });
  
      act(() => {
        result.current.updateFilters({ q: 'test', year: '' });
      });
  
      const apiFilters = result.current.getApiFilters();
      expect(apiFilters).toHaveProperty('q', 'test');
      expect(apiFilters).not.toHaveProperty('year');
  });
});