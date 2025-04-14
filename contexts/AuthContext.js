// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // user format: { token: string, user: { _id, fullName, email, ... } }

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Utilisateur chargé depuis AsyncStorage :", parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.log("Erreur lors du chargement de l'utilisateur depuis AsyncStorage :", error);
      }
    })();
  }, []);
  

  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.log("Error saving user to storage:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log("Error removing user from storage:", error);
    }
  };

  const isAuthenticated = !!user?.token;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
