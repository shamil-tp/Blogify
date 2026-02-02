import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials:true
}); // credentials not needed for Bearer token auth

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = secureLocalStorage.getItem("accessToken");
    if (token) {
      console.log("Axios Interceptor: Attaching Access Token:", token.substring(0, 10) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("Axios Interceptor: No Access Token found in storage.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Axios Interceptor: 401 Detected. Attempting Refresh...");
      originalRequest._retry = true;

      try {
        const refreshToken = secureLocalStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.log("Axios Interceptor: No Refresh Token found. Logging out.");
          // No refresh token, logout user
          secureLocalStorage.removeItem("accessToken");
          secureLocalStorage.removeItem("refreshToken");
          // window.location.href = "/login"; // Optional: Redirect to login
          return Promise.reject(error);
        }

        console.log("Axios Interceptor: Sending Refresh Request...");
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, {
          refreshToken,
        });

        console.log("Axios Interceptor: Refresh Successful. New Access Token received.");
        const { accessToken } = res.data;
        secureLocalStorage.setItem("accessToken", accessToken);
        // If rotating refresh token: secureLocalStorage.setItem("refreshToken", res.data.refreshToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        secureLocalStorage.removeItem("accessToken");
        secureLocalStorage.removeItem("refreshToken");
        // window.location.href = "/login"; // Optional: Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
