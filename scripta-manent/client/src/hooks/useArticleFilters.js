/**
 * Custom Hook per gestire i filtri degli articoli tramite URL query string
 * 
 * Sincronizza i filtri con l'URL utilizzando React Router useSearchParams
 * Permette navigazione avanti/indietro del browser mantenendo lo stato dei filtri
 */

import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Hook per gestire filtri articoli sincronizzati con URL
 * @returns {Object} - { filters, updateFilters, resetFilters }
 */
export const useArticleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Estrae i filtri correnti dall'URL
   * Memoizzato per evitare ricalcoli non necessari
   */
  const filters = useMemo(() => ({
    q: searchParams.get('q') || '',           // Ricerca full-text
    authors: searchParams.get('authors') || '', // Filtro autori
    year: searchParams.get('year') || '',       // Filtro anno
    journal: searchParams.get('journal') || '', // Filtro journal (opzionale)
  }), [searchParams]);

  /**
   * Aggiorna i filtri nell'URL
   * Rimuove parametri vuoti per mantenere URL pulito
   * 
   * @param {Object} newFilters - Oggetto con i nuovi valori dei filtri
   * @example updateFilters({ q: 'machine learning', year: '2024' })
   */
  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    // Itera sui nuovi filtri e aggiunge solo quelli non vuoti
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value.trim());
      }
    });
    
    // Aggiorna l'URL (trigger re-render dei componenti che usano useSearchParams)
    setSearchParams(params);
  }, [setSearchParams]);

  /**
   * Resetta tutti i filtri cancellando la query string
   * Utile per il pulsante "Reset" nella Sidebar
   */
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  /**
   * Verifica se ci sono filtri attivi
   * Utile per mostrare/nascondere il pulsante Reset
   */
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  /**
   * Converte i filtri in un formato adatto per query API
   * Rimuove chiavi con valori vuoti
   */
  const getApiFilters = useCallback(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {});
  }, [filters]);

  return {
    filters,              // Filtri correnti estratti dall'URL
    updateFilters,        // Funzione per aggiornare i filtri
    resetFilters,         // Funzione per resettare tutti i filtri
    hasActiveFilters,     // Boolean: ci sono filtri attivi?
    getApiFilters,        // Filtri formattati per chiamate API
  };
};