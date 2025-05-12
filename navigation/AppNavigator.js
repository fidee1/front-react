import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
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
import SplashScreen from "../SplashScreen";
import ProfilClient from "../ProfilClient";
import ProjectManagement from "../ProjectManagement";
import projectlist from "../projectlist";
import Freelancers from "../Freelancers";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false); // Cache la SplashScreen après 3 secondes
    },8000)
    return () => clearTimeout(timer); // Nettoie le timer
  }, []);

  useEffect(() => {
    if (isAuthenticated && role) {
      console.log("Rôle utilisateur détecté dans useEffect:", role);
      navigation.navigate("acceuilScreen", { userRole: role });
    }
  }, [isAuthenticated, role, navigation]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSplashVisible ? (
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
      ) : isAuthenticated ? (
        <>
          <Stack.Screen name="acceuilScreen" component={accueilScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ListOfOffers" component={ListOfOffers} />
          <Stack.Screen name="MyProject" component={MyProject} />
          <Stack.Screen name="Claim" component={Claim} />
          <Stack.Screen name="Invoices" component={Invoices} />
          <Stack.Screen name="Inbox" component={Inbox} />
          <Stack.Screen name="ProfilClient"component={ProfilClient}/>
          <Stack.Screen name="ProjectManagement"component={ProjectManagement}/>
          <Stack.Screen name="projectlist"component={projectlist}/>
          <Stack.Screen name="Freelancers" component={Freelancers} />

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
