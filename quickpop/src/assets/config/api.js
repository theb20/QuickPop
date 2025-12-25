import axios from "axios";

/**
 * Instance Axios principale
 */
const resolveBaseURL = () => {
  // 1. En développement : on privilégie l'hôte actuel pour supporter le test sur mobile/LAN
  // Cela permet d'éviter les erreurs CORS/Network si on accède via IP (ex: 192.168.x.x)
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:3000`;
  }

  // 2. Variable d'environnement (Production ou override)
  const envUrl = import.meta.env.VITE_API_URL;
  console.log('VITE_API_URL:', envUrl);
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }
  
  // 3. En production, utiliser le chemin relatif ou erreur explicite
  // Option A : API sur le même domaine (ex: /api)
  return '/api';
};

const api = axios.create({
  baseURL: resolveBaseURL(), 
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Intercepteur REQUEST
 * Ajoute le token automatiquement si présent
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercepteur RESPONSE
 * Centralise la gestion des erreurs
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token expiré / non valide
      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;