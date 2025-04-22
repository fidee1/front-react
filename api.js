import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Axios
const api = axios.create({
  baseURL: Constants.expoConfig.extra?.API_URL || "http://localhost:8000/api/",
  timeout: 10000,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Non autorisé. Redirection vers la page de connexion.');
      // Vous pouvez ajouter une logique pour déconnecter automatiquement ici
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fonctions pour les appels API
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // Retourne les données de la réponse
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Gère les erreurs
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/profile'); // Le token est automatiquement ajouté via l'intercepteur
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
