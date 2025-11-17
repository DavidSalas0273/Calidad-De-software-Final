// src/components/Navbar.test.tsx
import { render, screen} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";

// Limpia los mocks antes de cada prueba
beforeEach(() => {
  jest.clearAllMocks();
});

// --- Pruebas de renderizado ---
describe("Navbar - Renderizado", () => {
  test("renderiza el título principal 'UCC : Prácticas Desarrollo'", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Laboratorio Inmersivo/i)).toBeInTheDocument();
  });

  test("renderiza el botón con el texto 'Tema'", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Tema/i })).toBeInTheDocument();
  });
});

