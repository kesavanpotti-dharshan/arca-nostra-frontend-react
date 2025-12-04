// src/lib/api/client.ts
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "", // Set in .env → VITE_API_URL=http://localhost:5273
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add auth token later
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;