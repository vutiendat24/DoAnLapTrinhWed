import React from "react";

export function AuthBackground({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      {children}
    </div>
  );
}
