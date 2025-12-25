import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initialToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const initialUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!!initialToken && !initialUser);

  // Session persistante
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return;
    }
    
    // If we already have user (from localStorage), we don't need to block loading, 
    // but we should still verify/update from server if online.
    if (initialUser) {
        setLoading(false); 
    }

    authService.getMe()
        .then((res) => {
            setUser(res);
            localStorage.setItem("user", JSON.stringify(res));
        })
        .catch((err) => {
            // Only logout if it's NOT a network error (e.g. 401 Unauthorized)
            // or if we are online but failed.
            // If offline, we assume token is still valid.
            if (navigator.onLine && err?.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } else if (!navigator.onLine) {
                console.log("Offline: Keeping session based on local storage.");
            }
        })
        .finally(() => setLoading(false));
  }, []);

  const signIn = async (data) => {
    const payload = data?.code ? data : { code: data?.email, password: data?.password };
    const res = await authService.login(payload);
    setUser(res.user);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  };

  const signUp = async (data) => {
    const res = await authService.register(data);
    setUser(res.user);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  };

  const signOut = async () => {
    try {
        await authService.logout();
    } catch(e) { console.error(e); }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
