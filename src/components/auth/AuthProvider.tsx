"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  apiFetch,
  clearStoredToken,
  parseJsonResponse,
  setStoredToken,
  type SessionUser,
} from "../../lib/api";

type AuthContextValue = {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<SessionUser>;
  register: (payload: {
    email: string;
    name: string;
    password: string;
    role: SessionUser["role"];
  }) => Promise<SessionUser>;
  signOut: () => void;
  refreshSession: () => Promise<SessionUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    const token =
      typeof window === "undefined" ? null : localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const response = await apiFetch("/api/auth/me");
      const nextUser = await parseJsonResponse<SessionUser>(response);
      setUser({
        ...nextUser,
        id: nextUser.id ?? nextUser._id,
      });
      return nextUser;
    } catch {
      clearStoredToken();
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const signIn = async (payload: { email: string; password: string }) => {
    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await parseJsonResponse<{
      token: string;
      user: SessionUser;
    }>(response);

    setStoredToken(data.token);
    setUser({
      ...data.user,
      id: data.user.id ?? data.user._id,
    });
    return data.user;
  };

  const register = async (payload: {
    email: string;
    name: string;
    password: string;
    role: SessionUser["role"];
  }) => {
    const response = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await parseJsonResponse<{
      token: string;
      user: SessionUser;
    }>(response);

    setStoredToken(data.token);
    setUser({
      ...data.user,
      id: data.user.id ?? data.user._id,
    });
    return data.user;
  };

  const signOut = () => {
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        signIn,
        register,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
