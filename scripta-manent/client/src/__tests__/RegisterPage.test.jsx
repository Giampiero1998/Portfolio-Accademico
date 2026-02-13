import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RegisterPage from '../../pages/RegisterPage';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import * as ReactQuery from '@tanstack/react-query';

// Mocks simili a Login
const mockLoginUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../store/authStore', () => ({
  default: (selector) => selector({ loginUser: mockLoginUser }),
}));

vi.mock('@mantine/notifications', () => ({
  notifications: { show: vi.fn() },
}));

vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn(),
}));

const renderPage = () => {
  return render(
    <MantineProvider>
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    </MantineProvider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ReactQuery.useMutation.mockReturnValue({ mutate: vi.fn(), isLoading: false });
  });

  // 1. Test Validazione Campi Obbligatori
  it('mostra errori per tutti i campi obbligatori vuoti', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Registrati/i }));

    await waitFor(() => {
      expect(screen.getByText("Il nome è obbligatorio")).toBeInTheDocument();
      expect(screen.getByText("L'email è obbligatoria")).toBeInTheDocument();
      expect(screen.getByText("La password è obbligatoria")).toBeInTheDocument();
    });
  });

  // 2. Test Validazione Formato Email
  it('mostra errore per formato email non valido', async () => {
    renderPage();
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrati/i }));

    await waitFor(() => {
      expect(screen.getByText("Inserisci un'email valida")).toBeInTheDocument();
    });
  });

  // 3. Test Password Mismatch
  it('mostra errore se le password non coincidono', async () => {
    renderPage();
    
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Conferma Password'), { target: { value: 'password999' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Registrati/i }));

    await waitFor(() => {
      expect(screen.getByText("Le password non coincidono")).toBeInTheDocument();
    });
  });

  // 3.1 Test Validazione Password Lunghezza Minima
  it('mostra errore se la password è troppo corta (meno di 6 caratteri)', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Registrati/i }));

    await waitFor(() => {
      expect(screen.getByText("Inserisci almeno sei caratteri")).toBeInTheDocument();
    });
  });

  // 4. Test Registrazione Riuscita
  it('esegue login e redirect dopo registrazione con successo', () => {
    let mutationOptions;
    ReactQuery.useMutation.mockImplementation((options) => {
        mutationOptions = options;
        return { mutate: vi.fn(), isLoading: false };
    });

    renderPage();
    const mockData = { token: 'abc', message: 'Ok' };
    mutationOptions.onSuccess(mockData);

    expect(mockLoginUser).toHaveBeenCalledWith(mockData);
    expect(notifications.show).toHaveBeenCalledWith(expect.objectContaining({ title: 'Registrazione completata' }));
    expect(mockNavigate).toHaveBeenCalledWith('/articles');
  });

  // 5. Test Link a Login
  it('contiene il link alla pagina di login', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Accedi qui/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});