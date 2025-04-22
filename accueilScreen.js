import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "./api";

function SidebarNav() {
  const userRole = useSelector((state) => state.auth.role); // Récupère le rôle via Redux
  const user = useSelector((state) => state.auth.user); // Récupère l'utilisateur via Redux
  const token = useSelector((state) => state.auth.token); // Récupère le token via Redux
  const navigation = useNavigation();

  console.log("Données utilisateur dans SidebarNav :", user);
  console.log("Rôle utilisateur (Redux) :", userRole);

  const [data, setData] = useState(null);

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

  // Détermine les éléments de navigation à afficher selon le rôle
  const navItems = [
    ...baseNavItems,
    ...(userRole === "freelancer" ? freelancerNavItems : []),
    ...(userRole === "client" ? clientNavItems : []),
  ];

  console.log("Items de navigation générés :", navItems);

  useEffect(() => {
    const updateAccueilScreenData = async () => {
      if (token && user?.id) {
        try {
          const response = await api.put(
            `/acceuilScreen/${user.id}`,
            {}, // Payload vide si non nécessaire
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Réponse API :", response.data);
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
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
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