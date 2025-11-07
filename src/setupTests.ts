// Este archivo extiende el entorno de prueba de Jest.

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

// Polyfill para TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

if (typeof global.crypto === "undefined") {
  (global as any).crypto = webcrypto;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({ 
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn((key: string) => (store.has(key) ? store.get(key)! : null)),
    setItem: jest.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    clear: jest.fn(() => {
      store.clear();
    }),
    removeItem: jest.fn((key: string) => {
      store.delete(key);
    }),
  };
};

Object.defineProperty(window, "localStorage", {
  value: createMemoryStorage(),
  writable: true,
});

Object.defineProperty(document, "documentElement", {
  value: {
    classList: {
      toggle: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  writable: true,
});

Object.defineProperty(document, "dispatchEvent", {
  value: jest.fn(),
});
