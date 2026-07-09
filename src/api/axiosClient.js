import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ចាប់យកតម្លៃពី .env ស្វ័យប្រវត្ត
  headers: {
    "Content-Type": "application/json",
  },
});

// ប្រព័ន្ធ Interceptor៖ ជួយលួចថែម Token ទៅក្នុង Header រាល់ពេលបាញ់ API (បើមាន Token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;