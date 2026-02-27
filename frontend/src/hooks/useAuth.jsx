import { useEffect, useState } from "react";
import api from "../api/axios";
import secureLocalStorage from "react-secure-storage";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureLocalStorage.getItem("accessToken");

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    api.get("/api/auth/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return { loading, authenticated };
}
