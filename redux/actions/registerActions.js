import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../registerSlice";
import { setUser } from "../../authSlice"; // Ajouter l'action setUser pour la mise à jour de l'utilisateur
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importer AsyncStorage
import axios from "axios"; // Assurez-vous qu'Axios est installé

export const register = (userData, onSuccess, onFailure) => async (dispatch) => {
  dispatch(registerStart());
  try {
    console.log("Données utilisateur avant l'API : ", userData); // Affiche les données avant l'appel à l'API

    // Appel de l'API réelle
    const response = await axios.post("http://192.168.215.109:8080/api/register", userData);
    console.log("Réponse de l'API réelle : ", response.data); // Affiche la réponse de l'API

    if (response.data.success) {
      dispatch(registerSuccess());
      dispatch(setUser(response.data.user)); // Utiliser les données utilisateur renvoyées par l'API

      // Sauvegarde également l'utilisateur dans AsyncStorage
      try {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("Utilisateur enregistré dans AsyncStorage :", response.data.user);
      } catch (error) {
        console.log("Erreur lors de la sauvegarde dans AsyncStorage :", error);
      }

      if (onSuccess) onSuccess();
    } else {
      const errorMessages = Object.values(response.data.errors || {}).flat().join(", ");
      dispatch(registerFailure(errorMessages));
      if (onFailure) onFailure(errorMessages);
    }
  } catch (error) {
    console.error("Erreur de l'API :", error);
    const errorMsg = error.response?.data?.message || "An error occurred. Please try again.";
    dispatch(registerFailure(errorMsg));
    if (onFailure) onFailure(errorMsg);
  }
  
};

export const clearUser = () => ({
  type: 'CLEAR_USER'
});