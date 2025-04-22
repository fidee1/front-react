import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../registerSlice";
import { setUser } from "../../authSlice"; // Ajouter l'action setUser pour la mise à jour de l'utilisateur
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importer AsyncStorage

export const register = (userData, onSuccess, onFailure) => async (dispatch) => {
  dispatch(registerStart());
  try {
    // Simulation d'une requête API
    const response = await fakeApiCall(userData);

    if (response.success) {
      dispatch(registerSuccess());
      dispatch(setUser(userData));  // Sauvegarde l'utilisateur dans le store Redux après l'inscription

      // Sauvegarde également l'utilisateur dans AsyncStorage
      try {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        console.log("Utilisateur enregistré dans AsyncStorage :", userData);
      } catch (error) {
        console.log("Erreur lors de la sauvegarde dans AsyncStorage :", error);
      }

      if (onSuccess) onSuccess();
    } else {
      dispatch(registerFailure(response.message));
      if (onFailure) onFailure(response.message);
    }
  } catch (error) {
    dispatch(registerFailure("An error occurred. Please try again."));
    if (onFailure) onFailure("An error occurred. Please try again.");
  }
};

// Simulation d'une fonction d'appel d'API
const fakeApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logique pour simuler un succès ou un échec
      if (data.email === "already@exists.com") {
        resolve({ success: false, message: "Email already exists" });
      } else {
        resolve({ success: true });
      }
    }, 1500);
  });
};
