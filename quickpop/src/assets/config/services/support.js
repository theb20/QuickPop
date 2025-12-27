import api from "../api.js";

export const createSupport = async (data) => {
  return await api.post("/support", data);
};
