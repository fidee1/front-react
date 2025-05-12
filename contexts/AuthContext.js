import React, { createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../redux/actions/registerActions"; // Assume you have actions to handle user state

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);  // Getting user from Redux state
  const loading = useSelector((state) => state.auth.loading);  // Optional: manage loading in Redux

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log("Contenu brut de AsyncStorage au démarrage :", storedUser);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Utilisateur chargé depuis AsyncStorage :", parsedUser);
          dispatch(setUser(parsedUser)); // Dispatch user to Redux
        } else {
          console.log("Aucun utilisateur trouvé dans AsyncStorage");
        }
      } catch (error) {
        console.log("Erreur lors du chargement de l'utilisateur depuis AsyncStorage :", error);
      } finally {
        console.log("Chargement terminé");
      }
    })();
  }, [dispatch]);

  const login = async (userData) => {
    console.log("Données utilisateur lors de la connexion :", userData);
    if (!userData?.user?.role) {
      console.warn("Les données utilisateur manquent de rôle ou de structure correcte");
    }
    dispatch(setUser(userData));  // Dispatch user data to Redux
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("Utilisateur sauvegardé dans AsyncStorage :", userData);
    } catch (error) {
      console.log("Erreur lors de la sauvegarde de l'utilisateur dans AsyncStorage :", error);
    }
  };

  const logout = async () => {
    dispatch(clearUser());  // Clear user in Redux
    try {
      await AsyncStorage.removeItem("user");
      console.log("Utilisateur supprimé de AsyncStorage");
    } catch (error) {
      console.log("Erreur lors de la suppression de l'utilisateur de AsyncStorage :", error);
    }
  };

  const isAuthenticated = !!user?.token;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
  
}
