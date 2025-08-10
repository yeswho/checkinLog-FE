import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://checkinlog-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to include the token in headers
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("HMS-TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh and role preservation
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired or invalid token
    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes('login')) { 
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const { data } = await axiosClient.post('/user/refresh-token');
        
        // Store the new access token in localStorage
        localStorage.setItem("HMS-TOKEN", data.accessToken);

        // Update the Authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        // Retry the original request with the new token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Clear token and role on refresh token failure
        localStorage.removeItem("HMS-TOKEN");
        localStorage.removeItem("HMS-ROLE");

        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If the error is not related to token expiry, reject it
    return Promise.reject(error);
  }
);

export default axiosClient;