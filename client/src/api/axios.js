import axios from "axios";
import useUserStore from "../context/UserContext";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Refresh logic which solves the infinite loop logout problem
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// add Authorization header to each request
api.interceptors.request.use((config) => {
  const {
    user: { accessToken },
  } = useUserStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const { updateUser, clearUser } = useUserStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // wait until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post(
          "/users/refresh",
          {},
          { withCredentials: true }
        );

        updateUser(data);
        processQueue(null, data.accessToken);

        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        clearUser();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
