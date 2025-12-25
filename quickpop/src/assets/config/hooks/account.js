import { useState, useEffect } from "react";
import * as accountService from "../services/account.js";
import { useAuth } from "./auth.js";

export const useAccountData = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await accountService.getAccountData();
      setData(res);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return { data, loading, error, refetch: fetchData };
};
