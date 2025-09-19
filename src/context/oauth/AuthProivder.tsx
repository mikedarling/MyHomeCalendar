'use client';

import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
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

export default AuthProvider;