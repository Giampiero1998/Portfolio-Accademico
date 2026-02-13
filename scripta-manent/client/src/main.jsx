import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Importa i CSS di Mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ============================================
// 🔧 QUERY CLIENT CONFIGURATION
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //  Cache Strategy
      staleTime: 5 * 60 * 1000, // 5 minuti - dati "freschi"
      cacheTime: 10 * 60 * 1000, // 10 minuti - mantieni in cache
      
      //  Refetch Strategy
      refetchOnWindowFocus: true, // Refetch quando torni al tab
      refetchOnReconnect: true, // Refetch quando torna internet
      refetchOnMount: true, // Refetch al mount del componente
      
      //  Retry Strategy
      retry: 1, // Riprova 1 volta su errore
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      
      //  Performance
      suspense: false, // Disabilita Suspense mode
      useErrorBoundary: false, // Non usare Error Boundary di default
    },
    mutations: {
      //  Retry per mutations (solo su network errors)
      retry: (failureCount, error) => {
        // Non ritentare su errori HTTP (400, 401, etc.)
        if (error?.message?.includes('HTTP')) return false;
        // Riprova max 1 volta su network errors
        return failureCount < 1;
      },
      retryDelay: 1000, // 1 secondo tra tentativi
    },
  },
});

// ============================================
// 🎨 MANTINE THEME
// ============================================

const mantineTheme = {
  colors: {
    brand: [
      '#E7EDE8', '#CFDBCFB', '#9EB6A3', '#6D9176', '#3C6C4A',
      '#245833', '#0D2513', '#091C0E', '#051209', '#020904'
    ],
  },
  primaryColor: 'brand',
  black: '#0D2513',
  defaultRadius: 'md',
  components: {
    MantineProvider: {
      styles: {
        body: {
          color: '#0D2513',
          backgroundColor: '#C4BFB8',
        },
      },
    },
  },

  // Aggiungi qui altre customizzazioni tema
};

// ============================================
// 🚀 APP RENDER
// ============================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider 
          defaultColorScheme="auto"
          theme={mantineTheme}
        >
          <Notifications 
            position="top-right" 
            limit={3} // Max 3 notifiche simultanee
            autoClose={4000} // Chiusura automatica dopo 4 secondi
          />
          <App />
        </MantineProvider>
      </BrowserRouter>
      
      {/*  React Query DevTools */}
      {import.meta.env.MODE === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);