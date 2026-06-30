import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    const check = async () => {
      try {
        if (window.api?.auth?.getStatus) {
          const status = await window.api.auth.getStatus();
          setConnected(status.connected);
          setEmail(status.email);
        }
      } catch {
        // no-op: running without Electron backend
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const connect = async () => {
    try {
      const result = await window.api.auth.startOAuth();
      if (result.success) {
        setConnected(true);
        setEmail(result.email);
      }
      return result;
    } catch (err) {
      throw err;
    }
  };

  const disconnect = async () => {
    await window.api.auth.disconnect();
    setConnected(false);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ connected, email, loading, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
