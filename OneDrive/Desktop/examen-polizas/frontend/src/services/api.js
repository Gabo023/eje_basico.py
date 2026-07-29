import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            "No se pudo conectar con el servidor";

        return Promise.reject(new Error(message));
    }
);

export default api;