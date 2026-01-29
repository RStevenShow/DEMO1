import { useState } from "react";
import { Login } from "@/app/components/Login";
import { InventarioCRUD } from "@/app/components/InventarioCRUD";

export function AdminView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <InventarioCRUD onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
