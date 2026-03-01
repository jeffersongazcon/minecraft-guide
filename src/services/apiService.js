/**
 * Servicio de API
 * Maneja todas las peticiones al backend de Visual Studio (.NET)
 */

import axios from 'axios';

// URL base de tu API
const API_BASE_URL = 'https://localhost:7206/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Servicio de Autenticación
 */
export const authAPI = {
  /**
   * Inicia sesión en la API
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/Auth/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (userData) => {
    try {
      const response = await api.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verifica el token actual
   */
  verifyToken: async () => {
    try {
      const response = await api.get('/Auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene todos los usuarios (admin)
   */
  getUsers: async () => {
    try {
      const response = await api.get('/Auth/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina un usuario (admin)
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/Auth/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

/**
 * Servicio de Construcciones
 */
export const constructionsAPI = {
  /**
   * Obtiene todas las construcciones
   */
  getAll: async () => {
    try {
      const response = await api.get('/Constructions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene una construcción por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/Constructions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Crea una nueva construcción (admin)
   */
  create: async (construction) => {
    try {
      const response = await api.post('/Constructions', construction);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Actualiza una construcción (admin)
   */
  update: async (id, construction) => {
    try {
      const response = await api.put(`/Constructions/${id}`, construction);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Elimina una construcción (admin)
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/Constructions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Marca/desmarca una construcción como favorita
   */
  toggleFavorite: async (id) => {
    try {
      const response = await api.post(`/Constructions/${id}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtiene las construcciones favoritas del usuario actual
   */
  getFavorites: async () => {
    try {
      const response = await api.get('/Constructions/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;