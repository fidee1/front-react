// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../LoginScreen";
import RegisterScreen from "../RegisterScreen";
import ProfileScreen from "../Profile";
import accueilScreen from "../accueilScreen"; // Importer l'écran d'accueil
import { AuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Une fois authentifié, afficher l'écran AccueilScreen en premier.
        <>
          <Stack.Screen name="accueilScreen" component={accueilScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
