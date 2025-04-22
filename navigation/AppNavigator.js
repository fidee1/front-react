import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, user, role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && role) {
      console.log("Rôle utilisateur détecté dans useEffect:", role);
      navigation.navigate("acceuilScreen", { userRole: role }); // Passe le rôle en paramètre
    }
  }, [isAuthenticated, role]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="acceuilScreen" component={accueilScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ListOfOffers" component={ListOfOffers} />
          <Stack.Screen name="MyProject" component={MyProject} />
          <Stack.Screen name="Claim" component={Claim} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="Inbox" component={Inbox} />
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
