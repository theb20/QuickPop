import api from "../api.js";

export const login = async (data) => {
  const res = await api.post("/auth/login", { code: data.code, password: data.password });
  if (res?.token) {
    localStorage.setItem("token", res.token);
  }
  return res;
};

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  if (res?.token) {
    localStorage.setItem("token", res.token);
  }
  return res;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
  }
};

export const getMe = async () => {
  return await api.get("/auth/me");
};

export const updateProfile = async (data) => {
  return await api.put("/auth/me", data);
};

export const requestPasswordReset = async (email) => {
  return await api.post("/auth/reset/request", { email });
};

export const verifyResetCode = async (email, code) => {
  return await api.post("/auth/reset/verify", { email, code });
};

export const confirmResetPassword = async (email, code, new_password) => {
  return await api.post("/auth/reset/confirm", { email, code, new_password });
};
