"use client";

import React, { useEffect, useState } from "react";

const AuthButton: React.FC = () => {
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLoginUrl = async () => {
      // Get scheme and host from window.location
      const res = await fetch(`/api/auth/google`);
      if (!res.ok) {
        setLoginUrl(null);
        return;
      }

      const data = await res.json();
      if (data.url) {
        setLoginUrl(data.url);
      }
    };
    
    fetchLoginUrl();
  }, []);

  const handleLogin = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      alert("No login URL available");
    }
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "0.5em 1.5em",
        fontSize: "1.1em",
        borderRadius: 4,
        background: "#4285F4",
        color: "white",
        border: "none",
        cursor: loginUrl ? "pointer" : "not-allowed",
        opacity: loginUrl ? 1 : 0.6,
      }}
      disabled={!loginUrl}
    >
      Sign in with Google
    </button>
  );
};

export default AuthButton;
