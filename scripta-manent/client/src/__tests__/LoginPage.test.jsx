import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../../pages/LoginPage'; 
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

// Mocks
const mockLoginUser = vi.fn();
const mockNavigate = vi.fn();
const mockMutate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../store/authStore', () => ({
  default: (selector) => selector({ loginUser: mockLoginUser }),
}));

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

// Mock React Query useMutation
import * as ReactQuery from '@tanstack/react-query';
vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn(),
}));

const renderPage = () => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </MantineProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for useMutation
    ReactQuery.useMutation.mockReturnValue({
        mutate: mockMutate,
        isLoading: false
    });
  });

  // 1. Test Validazione Email Vuota
  it('mostra errore se si prova a fare submit senza email', async () => {
    const mockMutateLocal = vi.fn();
    ReactQuery.useMutation.mockReturnValue({
      mutate: mockMutateLocal,
      isLoading: false
    });

    renderPage();
    
    const submitBtn = screen.getByRole('button', { name: /Accedi/i });
    fireEvent.click(submitBtn);

    // React Hook Form è asincrono
    await waitFor(() => {
      expect(screen.getByText("L'email è obbligatoria")).toBeInTheDocument();
    });

    // Verifica che mutate non venga chiamata se validazione fallisce
    expect(mockMutateLocal).not.toHaveBeenCalled();
  });

  // 2. Test Login Riuscito (Integrazione logica onSuccess)
  it('reindirizza e salva utente su login riuscito', () => {
    // Dobbiamo simulare la logica interna di onSuccess definita nel componente.
    // Poiché stiamo mockando useMutation, dobbiamo catturare le opzioni passate.
    let mutationOptions;
    ReactQuery.useMutation.mockImplementation((options) => {
        mutationOptions = options;
        return { mutate: vi.fn(), isLoading: false };
    });

    renderPage();
    
    // Simuliamo che il componente monti e noi eseguiamo manualmente la onSuccess 
    // per testare la logica interna (store + navigate)
    const mockData = { token: '123', user: { name: 'Test' } };
    mutationOptions.onSuccess(mockData);

    expect(mockLoginUser).toHaveBeenCalledWith(mockData);
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({ title: 'Accesso Riuscito' }));
    expect(mockNavigate).toHaveBeenCalledWith('/articles');
  });

  // 3. Test Errore API
  it('mostra notifica di errore su fallimento API', () => {
    let mutationOptions;
    ReactQuery.useMutation.mockImplementation((options) => {
        mutationOptions = options;
        return { mutate: vi.fn(), isLoading: false };
    });

    renderPage();

    const mockError = { message: 'Credenziali errate' };
    mutationOptions.onError(mockError);

    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({ 
        title: 'Errore di Accesso',
        color: 'red' 
    }));
  });

  // 4. Test Password Field Masked
  it('il campo password deve essere di tipo password', () => {
    renderPage();
    const passwordInput = screen.getByLabelText('Password'); // Label match
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // 5. Test Link a Registrazione
  it('contiene il link alla pagina di registrazione', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Registrati qui/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });
});