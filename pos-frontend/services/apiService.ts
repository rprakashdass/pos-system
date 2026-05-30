import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Prefer same-origin API calls (e.g. /api/*) so the app can be deployed
// behind a reverse proxy / auth gateway without hard-coding origins.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Allow gateways / upstream to use cookie-based sessions if desired.
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(endpoint: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(endpoint, config);
    return response.data;
  }
}

const apiService = new ApiService();
export { apiService };
export default apiService;