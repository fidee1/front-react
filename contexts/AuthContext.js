import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log("Contenu brut de AsyncStorage au démarrage :", storedUser);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Utilisateur chargé depuis AsyncStorage :", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("Aucun utilisateur trouvé dans AsyncStorage");
        }
      } catch (error) {
        console.log("Erreur lors du chargement de l'utilisateur depuis AsyncStorage :", error);
      } finally {
        setLoading(false);
        console.log("Chargement terminé, loading mis à false");
      }
    })();
  }, []);

  const login = async (userData) => {
    console.log("Données utilisateur lors de la connexion :", userData);
    if (!userData?.user?.role) {
      console.warn("Les données utilisateur manquent de rôle ou de structure correcte");
    }
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("Utilisateur sauvegardé dans AsyncStorage :", userData);
    } catch (error) {
      console.log("Erreur lors de la sauvegarde de l'utilisateur dans AsyncStorage :", error);
    }
  };

  const logout = async () => {
    setUser(null);
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