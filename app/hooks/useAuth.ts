import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const SENHA_SISTEMA = import.meta.env?.VITE_SENHA_SISTEMA || 'caps3maringa';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = storage.getAuth();
    setIsAuthenticated(auth);
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === SENHA_SISTEMA) {
      storage.setAuth(true);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.removeAuth();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};