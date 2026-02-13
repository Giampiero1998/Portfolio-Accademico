/**
 *  React Query Hooks per Articles
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  getArticles,
  getArticleById,
  getArticleWithCitations,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../services/api';

// ============================================
// 🔑 Query Keys (per cache management)
// ============================================

export const articleKeys = {
  all: ['articles'],
  lists: () => [...articleKeys.all, 'list'],
  list: (filters) => [...articleKeys.lists(), filters],
  details: () => [...articleKeys.all, 'detail'],
  detail: (id) => [...articleKeys.details(), id],
  withCitations: (id) => [...articleKeys.detail(id), 'citations'],
};

// ============================================
// 📖 QUERY HOOKS (READ)
// ============================================

/**
 * Hook per recuperare lista articoli con filtri
 * @param {Object} filters - { q, authors, year, limit, page }
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useArticles = (filters = {}) => {
  return useQuery({
    queryKey: articleKeys.list(filters),
    queryFn: () => getArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 minuti
    cacheTime: 10 * 60 * 1000, // 10 minuti
    retry: 2,
    onError: (error) => {
      notifications.show({
        title: 'Errore',
        message: error.message || 'Impossibile caricare gli articoli',
        color: 'red',
      });
    },
  });
};

/**
 * Hook per recuperare singolo articolo
 * @param {String} id - ID articolo
 * @param {Object} options - Opzioni React Query
 * @returns {Object} { data, isLoading, error }
 */
export const useArticle = (id, options = {}) => {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => getArticleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      notifications.show({
        title: 'Errore',
        message: error.message || 'Articolo non trovato',
        color: 'red',
      });
    },
    ...options,
  });
};

/**
 * Hook per recuperare articolo con citazioni
 * @param {String} id - ID articolo
 * @returns {Object} { data, isLoading, error }
 */
export const useArticleWithCitations = (id) => {
  return useQuery({
    queryKey: articleKeys.withCitations(id),
    queryFn: () => getArticleWithCitations(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      notifications.show({
        title: 'Errore',
        message: error.message || 'Impossibile caricare le citazioni',
        color: 'red',
      });
    },
  });
};

// ============================================
// ✏️ MUTATION HOOKS (CREATE/UPDATE/DELETE)
// ============================================

/**
 * Hook per creare un nuovo articolo
 * Invalida automaticamente la cache della lista
 * @returns {Object} { mutate, mutateAsync, isLoading, error }
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: (newArticle) => {
      // ✅ Invalida cache lista articoli
      queryClient.invalidateQueries(articleKeys.lists());
      
      notifications.show({
        title: 'Successo!',
        message: 'Articolo creato con successo',
        color: 'green',
      });
      window.location.href = `/articles/${newArticle._id}`;
    },
    onError: (error) => {
      notifications.show({
        title: 'Errore',
        message: error.message || 'Impossibile creare l\'articolo',
        color: 'red',
      });
    },
  });
};

/**
 * Hook per aggiornare un articolo esistente
 * Invalida cache del dettaglio e della lista
 * @returns {Object} { mutate, mutateAsync, isLoading, error }
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateArticle(id, data),
    onMutate: async ({ id, data }) => {
      // ⚡ Optimistic update
      await queryClient.cancelQueries(articleKeys.detail(id));
      
      const previousArticle = queryClient.getQueryData(articleKeys.detail(id));
      
      // Aggiorna cache immediatamente
      queryClient.setQueryData(articleKeys.detail(id), (old) => ({
        ...old,
        ...data,
      }));
      
      return { previousArticle };
    },
    onError: (error, { id }, context) => {
      // ❌ Rollback in caso di errore
      if (context?.previousArticle) {
        queryClient.setQueryData(articleKeys.detail(id), context.previousArticle);
      }
      
      notifications.show({
        title: 'Errore',
        message: error.message || 'Impossibile aggiornare l\'articolo',
        color: 'red',
      });
    },
    onSuccess: (updatedArticle, { id }) => {
      // ✅ Invalida cache
      queryClient.invalidateQueries(articleKeys.detail(id));
      queryClient.invalidateQueries(articleKeys.lists());
      
      notifications.show({
        title: 'Successo!',
        message: 'Articolo aggiornato con successo',
        color: 'green',
      });
    },
  });
};

/**
 * Hook per eliminare un articolo
 * Invalida cache e rimuove dal cache
 * @returns {Object} { mutate, mutateAsync, isLoading, error }
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.lists() });
      
      const previousLists = queryClient.getQueriesData({ queryKey: articleKeys.lists() });
      
      // Rimuovi articolo da tutte le liste in cache
      queryClient.setQueriesData({ queryKey: articleKeys.lists() }, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter(article => article._id !== id);
        }
        // Se old ha una proprietà articles (es. { articles: [...] })
        if (old.articles && Array.isArray(old.articles)) {
          return {
            ...old,
            articles: old.articles.filter(article => article._id !== id)
          };
        }
        return old;
      });
      
      return { previousLists };
    },
    onError: (error, id, context) => {
      // Rollback
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      
      notifications.show({
        title: 'Errore',
        message: error.message || 'Impossibile eliminare l\'articolo',
        color: 'red',
      });
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: articleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      
      notifications.show({
        title: 'Successo!',
        message: 'Articolo eliminato con successo',
        color: 'green',
      });
    },
  });
};

// ============================================
// 🔧 UTILITY HOOKS
// ============================================

/**
 * Hook per invalidare manualmente la cache
 * Utile per force refresh
 */
export const useInvalidateArticles = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries(articleKeys.all),
    invalidateLists: () => queryClient.invalidateQueries(articleKeys.lists()),
    invalidateDetail: (id) => queryClient.invalidateQueries(articleKeys.detail(id)),
  };
};