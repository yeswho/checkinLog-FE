import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("HMS-TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes('login')) { 
      originalRequest._retry = true;
      try {
        const { data } = await axiosClient.post('/user/refresh-token');
        localStorage.setItem("HMS-TOKEN", data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("HMS-TOKEN");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;