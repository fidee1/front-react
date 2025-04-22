import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "./api";

function SidebarNav() {
  const userRole = useSelector((state) => state.auth.role); // Récupère le rôle via Redux
  const user = useSelector((state) => state.auth.user); // Récupère l'utilisateur via Redux
  const token = useSelector((state) => state.auth.token); // Récupère le token via Redux
  const navigation = useNavigation();

  const [data, setData] = useState("");

  const baseNavItems = [
    { name: "Profile", route: "Profile", icon: "person-outline" },
  ];

  const freelancerNavItems = [
    { name: "List Of Offers", route: "ListOfOffers", icon: "briefcase-outline" },
    { name: "My Project", route: "MyProject", icon: "folder-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
  ];

  const clientNavItems = [
    { name: "Invoice Management", route: "InvoiceManagement", icon: "briefcase-outline" },
    { name: "Project Management", route: "ProjectManagement", icon: "construct-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Project List", route: "ProjectList", icon: "list-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
  ];

  const navItems = [
    ...baseNavItems,
    ...(userRole === "freelancer" ? freelancerNavItems : []),
    ...(userRole === "client" ? clientNavItems : []),
  ];

  useEffect(() => {
    const updateAccueilScreenData = async () => {
      if (token && user?.id) {
        try {
          const response = await api.put(
            `/acceuilScreen/${user.id}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(response.data);
        } catch (error) {
          console.error("Erreur lors de l'appel API :", error.response || error.message);
        }
      }
    };

    updateAccueilScreenData();
  }, [user?.id, token]);

  const renderNavItem = (item) => (
    <TouchableOpacity
      key={item.route}
      style={styles.navItem}
      onPress={() => navigation.navigate(item.route)}
    >
      <Ionicons name={item.icon} size={24} color="black" style={styles.icon} />
      <Text style={styles.navText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {navItems.map(renderNavItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center", // Centre les éléments verticalement
    paddingTop: 50, // Ajoute un espace en haut pour éviter que le contenu soit trop haut
  },
  welcomeText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // Ajoute de l'espace sous le texte "Welcome"
    marginTop: 10, // Ajoute un espace au-dessus pour qu'il ne touche pas le bord
  },
  scrollContainer: {
    alignItems: "center", // Centre les éléments horizontalement
    paddingHorizontal: 20,
    paddingVertical: 20, // Ajoute un espace vertical pour un meilleur affichage
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    width: "90%", // Ajuste la largeur des éléments
  },
  icon: {
    marginRight: 15,
  },
  navText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});


export default SidebarNav;
