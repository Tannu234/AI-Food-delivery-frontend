//centeralized API setup

import axios from "axios";
import qs from "qs";
console.log("ENV:", import.meta.env.VITE_API_URL);

// Render's free tier puts the backend to sleep after inactivity.
// Waking it up can take 30-50s, so we use a generous timeout and
// automatically retry once if the first attempt times out.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
  timeout: 45000, // 45s to allow for Render cold starts
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Only retry once, and only for timeouts / network errors
    // (not for real 4xx/5xx responses from the server).
    const isTimeoutOrNetworkError =
      error.code === "ECONNABORTED" || !error.response;

    if (isTimeoutOrNetworkError && config && !config.__isRetry) {
      config.__isRetry = true;
      config.timeout = 45000;
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;