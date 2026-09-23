import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('eventmate_token');
      if (token) {
        try {
          const user = await apiFetch('/api/auth/me');
          setCurrentUser(user);
        } catch {
          localStorage.removeItem('eventmate_token');
          localStorage.removeItem('eventmate_user');
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setCurrentUser(data.user);
    localStorage.setItem('eventmate_token', data.token);
    localStorage.setItem('eventmate_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async ({ name, email, password, role }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    setCurrentUser(data.user);
    localStorage.setItem('eventmate_token', data.token);
    localStorage.setItem('eventmate_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eventmate_token');
    localStorage.removeItem('eventmate_user');
  };

  const updateCurrentUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('eventmate_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
