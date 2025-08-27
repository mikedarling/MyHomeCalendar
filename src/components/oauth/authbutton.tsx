"use client";

import React from "react";

const AuthButton: React.FC = () => {
  const handleLogin = async () => {
    // Fetch the Google OAuth URL from the API
    const res = await fetch("/api/auth/google");
    if (!res.ok) {
      alert("Failed to get Google login URL");
      return;
    }
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("No login URL returned");
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
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
};

export default AuthButton;
