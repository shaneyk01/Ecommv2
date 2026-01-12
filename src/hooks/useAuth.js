// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { listenToAuth } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = listenToAuth((u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  return { user, initializing };
}
