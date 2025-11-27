import { Api } from "@demo/api-sdk";

const api = new Api<string>({
    baseURL: import.meta.env.VITE_API_URL,
    securityWorker: () => {
        const token = localStorage.getItem('jwt')
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
});

export { api }