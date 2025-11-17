import { createContext, useContext, useState } from "react";
import { sha256 } from "../utils/crypto";

export type UserRole = "estudiante" | "docente" | "admin";

export interface StoredUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  passHash: string;
}

export interface AuthUser extends Omit<StoredUser, "passHash"> {}

interface RegisterPayload {
  nombre: string;
  email: string;
  role: UserRole;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  currentUser: AuthUser | null;
  register(payload: RegisterPayload): Promise<void>;
  login(payload: LoginPayload): Promise<void>;
  logout(): void;
}

const USERS_KEY = "immersive_users";
const SESSION_KEY = "immersive_active_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const safeLocalStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage;
};

const generateId = () => {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }

  if (cryptoApi?.getRandomValues) {
    const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return `user-${Date.now()}`;
};

const readUsers = (): StoredUser[] => {
  try {
    const storage = safeLocalStorage();
    if (!storage) return [];
    const raw = storage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const persistUsers = (users: StoredUser[]) => {
  const storage = safeLocalStorage();
  if (!storage) return;
  storage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): AuthUser | null => {
  try {
    const storage = safeLocalStorage();
    if (!storage) return null;
    const raw = storage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const persistSession = (user: AuthUser | null) => {
  const storage = safeLocalStorage();
  if (!storage) return;
  if (!user) {
    storage.removeItem(SESSION_KEY);
  } else {
    storage.setItem(SESSION_KEY, JSON.stringify(user));
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(() => readUsers());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => readSession());

  const register = async ({ nombre, email, role, password }: RegisterPayload) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = nombre.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const passHash = await sha256(password);
    const id = generateId();
    const newUser: StoredUser = {
      id,
      nombre: trimmedName,
      email: normalizedEmail,
      role,
      passHash,
    };
    const authUser: AuthUser = { id: newUser.id, nombre: newUser.nombre, email: newUser.email, role: newUser.role };

    setUsers((prev) => {
      if (prev.some((user) => user.email === normalizedEmail)) {
        throw new Error("El correo ya está registrado.");
      }
      const updated = [...prev, newUser];
      persistUsers(updated);
      return updated;
    });

    setCurrentUser(authUser);
    persistSession(authUser);
  };

  const login = async ({ email, password }: LoginPayload) => {
    const normalizedEmail = email.trim().toLowerCase();
    const passHash = await sha256(password);

    const storedUser =
      users.find((user) => user.email === normalizedEmail && user.passHash === passHash) ??
      readUsers().find((user) => user.email === normalizedEmail && user.passHash === passHash);

    if (!storedUser) {
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }

    const authUser: AuthUser = { id: storedUser.id, nombre: storedUser.nombre, email: storedUser.email, role: storedUser.role };
    setCurrentUser(authUser);
    persistSession(authUser);
  };

  const logout = () => {
    setCurrentUser(null);
    persistSession(null);
  };

  const value: AuthContextValue = {
    currentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
