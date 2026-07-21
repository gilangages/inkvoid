import createClient from "openapi-fetch";
import type { paths } from "../../types/api";

// URL dasar API
const API_BASE_URL = import.meta.env.VITE_APP_PATH || "http://localhost:3000/api";

/**
 * Ini adalah wrapper tipe-aman (type-safe) dari native fetch bawaan browser.
 * Semua path endpoint dan tipe respons akan otomatis mengikuti openapi.json.
 */
const api = createClient<paths>({
  baseUrl: API_BASE_URL,
});

// Middleware opsional untuk menyisipkan token otomatis ke setiap request (jika ada)
api.use({
  onRequest({ request }) {
    let token = localStorage.getItem("token");
    if (token) {
      try {
        // react-use's useLocalStorage stores strings with JSON.stringify
        token = JSON.parse(token);
      } catch (e) {
        // Fallback
      }
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});

export default api;
