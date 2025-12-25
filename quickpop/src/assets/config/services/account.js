import api from "../api.js";

export const getAccountData = async () => {
  return await api.get("/account/data");
};
