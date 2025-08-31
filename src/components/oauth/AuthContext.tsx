"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Helper to check cookie
  const checkLoggedIn = () =>
    typeof document !== "undefined" &&
    document.cookie.includes("google_tokens=");

  useEffect(() => {
    setLoggedIn(checkLoggedIn());

    // Update on tab focus (handles login via redirect)
    const onFocus = () => setLoggedIn(checkLoggedIn());
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
