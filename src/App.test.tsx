import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

test("renderiza el título principal", () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByText(/Hola exploradores curiosos/i)).toBeInTheDocument();
});