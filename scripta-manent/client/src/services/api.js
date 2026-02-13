/**
 * API Service
 */

import useAuthStore from '../store/authStore';

// 🔧 Configurazione
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 10000; // 10 secondi

/**
 *   INTERCEPTOR: Fetch wrapper con features avanzate
 * - Aggiunge automaticamente Authorization header
 * - Gestisce timeout
 * - Gestisce errori 401 con logout automatico
 * - Retry automatico per errori di rete
 */
const fetchWithAuth = async (url, options = {}, retries = 1) => {
  const token = useAuthStore.getState().token;
  const logoutUser = useAuthStore.getState().logoutUser;

  // 🔐 Aggiungi automaticamente Authorization header se token presente
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Solo per richieste autenticate (non login/register)
  if (token && !url.includes('/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ⏱️ Timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ✅ SUCCESS - status 2xx
    if (response.ok) {
      // 204 No Content non ha body
      if (response.status === 204) {
        return { success: true };
      }
      return await response.json();
    }

    // ❌ ERROR - status 4xx/5xx
    const errorData = await response.json().catch(() => ({ message: 'Errore sconosciuto' }));

    // 🚨 401 Unauthorized → LOGOUT AUTOMATICO
    if (response.status === 401) {
      console.warn('🔒 Token scaduto o non valido - Logout automatico');
      logoutUser();
      
      // Redirect a login (usa window.location per forzare reload)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
      
      throw new Error('Sessione scaduta. Effettua nuovamente il login.');
    }

    // ❌ Altri errori HTTP
    throw new Error(errorData.message || `Errore HTTP ${response.status}`);

  } catch (error) {
    clearTimeout(timeoutId);

    // 🌐 Network error o timeout
    if (error.name === 'AbortError') {
      throw new Error('Richiesta scaduta. Controlla la tua connessione.');
    }

    // 🔄 RETRY logic per errori di rete
    if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.warn(`🔄 Retry richiesta... (${retries} tentativi rimasti)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aspetta 1 secondo
      return fetchWithAuth(url, options, retries - 1);
    }

    throw error;
  }
};

// ============================================
// 📘 ARTICOLI - CRUD Operations
// ============================================

/**
 * Recupera lista articoli con filtri avanzati
 * @param {Object} filters - { q, authors, year, limit, page, ... }
 * @returns {Promise<Array>} Lista articoli
 */
export const getArticles = async (filters = {}) => {
  const url = new URL(`${API_BASE_URL}/portfolio/articles`);
  
  // Aggiungi parametri query
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  const data = await fetchWithAuth(url.toString(), { method: 'GET' });
  return data.data?.articles || data;
};

/**
 * Recupera singolo articolo per ID
 * @param {String} id - ID articolo
 * @returns {Promise<Object>} Articolo
 */
export const getArticleById = async (id) => {
  const url = `${API_BASE_URL}/portfolio/articles/${id}`;
  const data = await fetchWithAuth(url, { method: 'GET' });
  return data.data?.article || data;
};

/**
 * ✨ NUOVO: Recupera articolo con citazioni popolate (aggregation pipeline)
 * @param {String} id - ID articolo
 * @returns {Promise<Object>} Articolo con citationsData array
 */
export const getArticleWithCitations = async (id) => {
  const url = `${API_BASE_URL}/portfolio/articles/${id}/with-citations`;
  const data = await fetchWithAuth(url, { method: 'GET' });
  return data.data?.article || data;
};

/**
 * Crea nuovo articolo
 * @param {Object} articleData - Dati articolo
 * @returns {Promise<Object>} Articolo creato
 */
export const createArticle = async (articleData) => {
  const url = `${API_BASE_URL}/portfolio/articles`;
  const data = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(articleData),
  });
  return data.data?.article || data;
};

/**
 * Aggiorna articolo esistente
 * @param {String} id - ID articolo
 * @param {Object} articleData - Dati da aggiornare
 * @returns {Promise<Object>} Articolo aggiornato
 */
export const updateArticle = async (id, articleData) => {
  const url = `${API_BASE_URL}/portfolio/articles/${id}`;
  const data = await fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify(articleData),
  });
  return data.data?.article || data;
};

/**
 * Elimina articolo
 * @param {String} id - ID articolo
 * @returns {Promise<void>}
 */
export const deleteArticle = async (id) => {
  const url = `${API_BASE_URL}/portfolio/articles/${id}`;
  await fetchWithAuth(url, { method: 'DELETE' });
  return { success: true };
};

/**
 * ⚠️ DEPRECATO: Usa createArticle() o updateArticle() separatamente
 * Mantenuto per backward compatibility
 */
export const SaveArticle = async (articleData, id = null) => {
  console.warn('⚠️ SaveArticle è deprecato. Usa createArticle() o updateArticle()');
  return id ? updateArticle(id, articleData) : createArticle(articleData);
};

// ============================================
// 🟡 CITAZIONI - CRUD Operations
// ============================================

/**
 * Recupera citazioni per articolo
 * @param {String} articleId - ID articolo genitore
 * @returns {Promise<Array>} Lista citazioni
 */
export const getCitationsByArticleId = async (articleId) => {
  const url = `${API_BASE_URL}/portfolio/citations?articleId=${articleId}`;
  const data = await fetchWithAuth(url, { method: 'GET' });
  return data.data?.citations || data;
};

/**
 * Recupera singola citazione per ID
 * @param {String} id - ID citazione
 * @returns {Promise<Object>} Citazione
 */
export const getCitationById = async (id) => {
  const url = `${API_BASE_URL}/portfolio/citations/${id}`;
  const data = await fetchWithAuth(url, { method: 'GET' });
  return data.data?.citation || data;
};

/**
 * Crea nuova citazione
 * @param {Object} citationData - { articleId, referenceText, pagesCited }
 * @returns {Promise<Object>} Citazione creata
 */
export const createCitation = async (citationData) => {
  const url = `${API_BASE_URL}/portfolio/citations`;
  const data = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(citationData),
  });
  return data.data?.citation || data;
};

/**
 * Aggiorna citazione esistente
 * @param {String} id - ID citazione
 * @param {Object} citationData - Dati da aggiornare
 * @returns {Promise<Object>} Citazione aggiornata
 */
export const updateCitation = async (id, citationData) => {
  const url = `${API_BASE_URL}/portfolio/citations/${id}`;
  const data = await fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify(citationData),
  });
  return data.data?.citation || data;
};

/**
 * Elimina citazione
 * @param {String} id - ID citazione
 * @returns {Promise<void>}
 */
export const deleteCitation = async (id) => {
  const url = `${API_BASE_URL}/portfolio/citations/${id}`;
  await fetchWithAuth(url, { method: 'DELETE' });
  return { success: true };
};

// ============================================
// 🔐 AUTENTICAZIONE
// ============================================

/**
 * Login utente
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { token, user, message }
 */
export const apiLogin = async (credentials) => {
  const url = `${API_BASE_URL}/auth/login`;
  
  // Login non usa fetchWithAuth perché non ha token
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Errore di login' }));
    throw new Error(errorData.message || 'Credenziali non valide');
  }

  return await response.json();
};

/**
 * Registrazione nuovo utente
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} { token, user, message }
 */
export const apiRegister = async (userData) => {
  const url = `${API_BASE_URL}/auth/register`;
  const {...dataToSend } = userData;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Errore di registrazione' }));
    throw new Error(errorData.message || 'Registrazione fallita');
  }

  return await response.json();
};

/**
 * Logout utente (solo lato client)
 * Il token viene rimosso da Zustand store
 */
export const apiLogout = () => {
  const logoutUser = useAuthStore.getState().logoutUser;
  logoutUser();
  
  // Redirect a login
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// ============================================
// 🔧 UTILITY
// ============================================

/**
 * Verifica se l'utente è autenticato
 * @returns {Boolean}
 */
export const isAuthenticated = () => {
  return !!useAuthStore.getState().token;
};

/**
 * Recupera l'utente corrente
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

/**
 * Health check API
 * @returns {Promise<Object>} { status: 'ok' }
 */
export const apiHealthCheck = async () => {
  const url = `${API_BASE_URL}/health`;
  return await fetchWithAuth(url, { method: 'GET' });
};

// ============================================
// 📦 EXPORT DEFAULT (per backward compatibility)
// ============================================

const api = {
  // Articles
  getArticles,
  getArticleById,
  getArticleWithCitations,
  createArticle,
  updateArticle,
  deleteArticle,
  SaveArticle, // deprecated
  
  // Citations
  getCitationsByArticleId,
  getCitationById,
  createCitation,
  updateCitation,
  deleteCitation,
  
  // Auth
  apiLogin,
  apiRegister,
  apiLogout,
  
  // Utility
  isAuthenticated,
  getCurrentUser,
  apiHealthCheck,
};

export default api;
