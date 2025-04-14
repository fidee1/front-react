import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: Constants.expoConfig.extra?.API_URL || 'http://127.0.0.1:8000/api', 
  timeout: 10000,
});

// Intercepteur pour inclure le token
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
      // Ajouter une action ici, comme une déconnexion automatique.
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
