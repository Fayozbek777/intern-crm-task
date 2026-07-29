import axios from "axios";

// Agar proxy ishlatilsa, /api dan foydalanamiz
const API_URL =
  process.env.REACT_APP_USE_PROXY === "true"
    ? "/api"
    : process.env.REACT_APP_API_URL || "https://for-interns.vercel.app/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
