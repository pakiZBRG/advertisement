import axios from "axios";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/v1/users/me", {
          withCredentials: true, // 👈 important to send cookies
        });
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return { user };
};
