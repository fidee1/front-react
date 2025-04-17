// navigation/AppNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../LoginScreen";
import RegisterScreen from "../RegisterScreen";
import accueilScreen from "../accueilScreen";
import Profile from "../Profile";
import ListOfOffers from "../ListOfOffers";
import MyProject from "../MyProject";
import Claim from "../Claim";
import Invoices from "../Invoices";
import Inbox from "../Inbox";
import { AuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Une fois authentifié, afficher l'écran d'accueil puis les autres pages
        <>
          <Stack.Screen name="Accueil" component={accueilScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ListOfOffers" component={ListOfOffers} />
          <Stack.Screen name="MyProject" component={MyProject} />
          <Stack.Screen name="Claim" component={Claim} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="Inbox" component={Inbox} />
        </>
      ) : (
        // Si non authentifié, afficher les pages de connexion et d'inscription
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
