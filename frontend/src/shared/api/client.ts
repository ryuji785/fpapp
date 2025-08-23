import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
