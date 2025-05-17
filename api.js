import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Axios
const api = axios.create({
  // Pour les tests sur émulateur, utilisez localhost
  // Pour les tests sur appareil physique, utilisez l'adresse IP de votre machine
  // Exemple: "http://192.168.1.x:8080/api/"
  baseURL: Constants.expoConfig.extra?.API_URL || "http://192.168.1.113:8080/api/",
  timeout: 30000,
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

export const getFreelancers = async () => {
  try {
    console.log('Début de l\'appel API getFreelancers');
    const response = await api.get('/freelancers');
    console.log('Réponse API brute:', response);
    console.log('Structure de la réponse:', typeof response.data, Array.isArray(response.data));
    
    // Vérifier si la réponse est un objet avec une propriété data (format Laravel API Resource)
    if (response.data && typeof response.data === 'object' && response.data.data && Array.isArray(response.data.data)) {
      console.log('Format détecté: Laravel API Resource avec data wrapper');
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée getFreelancers:', error);
    console.error('Message d\'erreur:', error.message);
    console.error('Réponse d\'erreur:', error.response?.data);
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
