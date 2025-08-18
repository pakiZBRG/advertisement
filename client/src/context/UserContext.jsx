import axios from "axios";
import { create } from "zustand";

const useUserStore = create((set, get) => ({
  user: {
    userId: null,
    accessToken: null,
  },
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
  clearUser: () =>
    set({
      user: { userId: null, accessToken: null },
    }),
  checkAuth: async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/users/refresh",
        {},
        { withCredentials: true }
      );

      get().updateUser(data);
    } catch (err) {
      console.log("Auth check failed:", err.message);
      get().clearUser();
    }
  },
}));

export default useUserStore;
