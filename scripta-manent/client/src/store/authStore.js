/**
 * Auth Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // 📊 STATE
      // ============================================
      token: null,
      user: null,
      isLoggedIn: false,

      // ============================================
      // 🔐 ACTIONS
      // ============================================

      /**
       * Login utente - salva token e user
       * @param {Object} data - { token, user }
       */
      loginUser: (data) => {
        console.log('✅ Login successful:', data.user?.email);
        set({
          token: data.token,
          user: data.user,
          isLoggedIn: true,
        });
      },

      /**
       * Logout utente - cancella tutto
       */
      logoutUser: () => {
        console.log('🚪 Logout - Clearing auth data');
        set({
          token: null,
          user: null,
          isLoggedIn: false,
        });
      },

      /**
       * Aggiorna solo i dati utente (senza toccare il token)
       * @param {Object} userData - Dati utente aggiornati
       */
      updateUser: (userData) => {
        const currentState = get();
        if (currentState.isLoggedIn) {
          set({
            user: { ...currentState.user, ...userData },
          });
        }
      },

      /**
       * Verifica se il token esiste
       * @returns {Boolean}
       */
      hasToken: () => {
        return !!get().token;
      },

      /**
       * Recupera solo il token (helper per API calls)
       * @returns {String|null}
       */
      getToken: () => {
        return get().token;
      },

      /**
       * Verifica se l'utente è autenticato
       * Alias per isLoggedIn
       * @returns {Boolean}
       */
      checkAuth: () => {
        return get().isLoggedIn && !!get().token;
      },
    }),
    {
      // ============================================
      // 💾 PERSIST CONFIGURATION
      // ============================================
      name: 'auth-storage', // Key in localStorage
      getStorage: () => localStorage,
      
      // Opzionale: log quando lo stato cambia
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          console.log('🔄 Auth state rehydrated from localStorage');
        }
      },
    }
  )
);

// ============================================
// 📦 EXPORT
// ============================================

export default useAuthStore;

/**
 * Helper selectors (opzionali, per performance)
 * Usa questi se vuoi evitare re-render inutili
 */
export const selectToken = (state) => state.token;
export const selectUser = (state) => state.user;
export const selectIsLoggedIn = (state) => state.isLoggedIn;