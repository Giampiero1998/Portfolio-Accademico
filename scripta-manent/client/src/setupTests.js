/* eslint-disable no-undef */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

// 1. Polyfills per JSDOM
// Necessario per librerie che usano encoding (es. JWT, parsing)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 2. Mock per Mantine & UI

// Mock di matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), 
    removeListener: vi.fn(), 
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock di ResizeObserver
// Molti componenti moderni lo usano per la responsività
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock di window.scrollTo
window.scrollTo = vi.fn();