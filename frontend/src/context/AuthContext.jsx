import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAuthenticated = !!user;

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/auth/profile');
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setError(err?.response?.data?.message || 'Non authentifié');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de connexion');
      setUser(null);
      return { success: false, message: error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur d\'inscription');
      setUser(null);
      return { success: false, message: error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
    } catch (err) {
      setError('Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;