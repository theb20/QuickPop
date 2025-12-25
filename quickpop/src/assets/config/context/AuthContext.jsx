import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initialToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!initialToken);

  // Session persistante
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return;
    }
    authService.getMe()
        .then((res) => setUser(res))
        .catch(() => {
            localStorage.removeItem("token");
            setUser(null);
        })
        .finally(() => setLoading(false));
  }, []);

  const signIn = async (data) => {
    const payload = data?.code ? data : { code: data?.email, password: data?.password };
    const res = await authService.login(payload);
    // login service already sets token in localStorage?
    // checking service code: yes it does.
    setUser(res.user);
    return res;
  };

  const signUp = async (data) => {
    const res = await authService.register(data);
    setUser(res.user);
    return res;
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!(user && (user.is_active === true || user.is_active === 1)),
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
