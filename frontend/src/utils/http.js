import axios from 'axios';

export const generalRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Response interceptor to handle token expiration
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite loop

      try {
        // Attempt to refresh the access token
        const response = await generalRequest.post('/admin/refresh-token', {});

        // Retry the original request with the new access token
        return request(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token request failed:', refreshError);
        // Optionally log out the user or redirect to login
        return Promise.reject(refreshError);
      }
    }

    // If the error is not due to token expiration, reject the promise
    return Promise.reject(error);
  }
);

export default request;
