//centeralized API setup

import axios from "axios";
import qs from "qs";
console.log("ENV:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
  timeout: 20000, // fail with a clear error after 20s instead of hanging forever
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// Attach the JWT (saved at login) to every request as a Bearer token.
// This avoids relying on cross-site cookies, which browsers can block
// when the frontend (Netlify/localhost) and backend (Render) are on
// different domains.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;