import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./contexts/AuthContext";
import api from "./api";

function SidebarNav() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // Log pour inspecter le rôle utilisateur et le contexte complet
  console.log("Données utilisateur dans SidebarNav :", user);
  console.log("Rôle utilisateur (user?.user?.role) :", user?.user?.role);

  const userRole = "freelancer";
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

  // Log pour inspecter les items de navigation générés
  const navItems = [
    ...baseNavItems,
    ...(userRole === "freelancer" ? freelancerNavItems : []),
    ...(userRole === "client" ? clientNavItems : []),
  ];
  console.log("Items de navigation générés :", navItems);

  useEffect(() => {
    const updateAccueilScreenData = async () => {
    if (user?.token && user?.id) {
        try {
            const response = await api.put(
                `/acceuilScreen/${user.id}`,
                {}, // Assurez-vous que ce payload est correct ou laissez vide si aucun payload n'est nécessaire
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
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
  }, [user?.id, user?.token, data]);

  const renderNavItem = (item) => (
    <TouchableOpacity
      key={item.route}
      style={[styles.navItem, { pointerEvents: "auto" }]} // Utilisation de style.pointerEvents
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Remplacement de shadow properties par boxShadow
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
