/**
 * Protegge le rotte che richiedono autenticazione
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Loader, Center, Text, Stack } from '@mantine/core';

/**
 * HOC per proteggere rotte che richiedono autenticazione
 * @param {Component} children - Componente da renderizzare se autenticato
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  // Loading state
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    // Simula un piccolo delay per controllare il token
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" spacing="md">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">Verifica autenticazione...</Text>
        </Stack>
      </Center>
    );
  }

  // Se non autenticato, redirect a login con return URL
  if (!isLoggedIn || !token) {
    console.warn('🔒 Accesso negato - Redirect a login');
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Autenticato → renderizza il componente protetto
  return children;
};

export default ProtectedRoute;