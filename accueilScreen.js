import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./contexts/AuthContext";
import api from './api';

function SidebarNav() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const userRole = "freelancer";
  const [data, setData] = useState(null); // Ajoutez un état pour stocker la réponse de l'API
  console.log("User Context Data:", user);
  console.log("User Role:", user?.user?.role);
  
  const baseNavItems = [
    { name: "Dashboard", route: "DashboardHome", icon: "speedometer-outline" },
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

  // Utilisation du useEffect pour effectuer l'appel API
  useEffect(() => {
    const updateAccueilScreenData = async () => {
      if (user?.token && user?.id) {
        try {
          const response = await api.put(`/acceuilScreen/${user.id}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          });
          console.log("Réponse API:", response.data); // Vérifiez ici la réponse de l'API
          setData(response.data); // Si la réponse de l'API doit mettre à jour les données
        } catch (error) {
          console.error("Erreur lors de l'appel API:", error);
        }
      }
    };

    updateAccueilScreenData();
  }, [user?.id, user?.token, data]); // Re-démarre l'effet lorsque les dépendances changent

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {navItems.map(renderNavItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Couleur d'arrière-plan claire
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15, // Espacement vertical plus large
    paddingHorizontal: 20, // Espacement horizontal supplémentaire
    marginBottom: 10, // Espacement entre chaque item
    backgroundColor: "#fff", // Couleur de fond pour chaque item
    borderRadius: 8, // Bords arrondis
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Ombre pour Android
  },
  icon: {
    marginRight: 15, // Plus d'espace entre l'icône et le texte
  },
  navText: {
    fontSize: 18, // Police légèrement plus grande
    color: "#333", // Couleur de texte foncée
    fontWeight: "500", // Texte semi-gras pour un meilleur contraste
  },
});


export default SidebarNav;
