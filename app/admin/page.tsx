"use client";

import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated via cookie by making a test request
    fetch("/api/menu")
      .then(() => {
        // If cookie is set, admin_auth will be validated server-side
        // We use localStorage as a client-side hint (cookie is httpOnly)
        const auth = sessionStorage.getItem("admin_auth");
        if (auth === "1") setAuthenticated(true);
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("admin_auth", "1");
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading portal…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
