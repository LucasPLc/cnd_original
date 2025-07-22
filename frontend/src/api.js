import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(
  (config) => {
    // Para este fluxo, o token é gerado externamente e deve ser fornecido.
    // Como não temos um fluxo de login aqui, vou usar um token fixo para demonstração.
    // Em uma aplicação real, este token viria do localStorage após o login no SAAM.
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IjEiLCJpc3MiOiJzYWFtIiwiZXhwIjoxNzU4MTc3OTM3fQ.3jA4B-cAWStXm_uB5f8t_b5pW-YwzQjZ7bY3zJ6rY5k";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
