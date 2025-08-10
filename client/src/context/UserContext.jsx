import axios from "axios";
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: "",
  setUser: (user) => set({ user }),
  checkAuth: async () => {
    try {
      const { data } = await axios.get("/api/v1/users/me", {
        withCredentials: true,
      });

      if (data.message) throw new Error("Not authenticated");

      set({ user: data.user.userId });
    } catch (err) {
      console.log({ err });
      set({ user: "" });
    }
  },
}));

export default useUserStore;
