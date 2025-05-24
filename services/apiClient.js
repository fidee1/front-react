import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration Axios
const apiClient = axios.create({
  // Pour les tests sur émulateur, utilisez localhost
  // Pour les tests sur appareil physique, utilisez l'adresse IP de votre machine
  // Exemple: "http://192.168.1.x:8080/api/"
  baseURL:
    Constants.expoConfig.extra?.API_URL || "http://192.168.215.109:8080/api/",
  timeout: 30000,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Non autorisé. Redirection vers la page de connexion.");
      // Vous pouvez ajouter une logique pour déconnecter automatiquement ici
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default apiClient;