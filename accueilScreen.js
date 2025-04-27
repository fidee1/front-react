import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { logout } from "./authSlice"; // Assurez-vous que le fichier de Redux est correctement configuré
import api from "./api";

function SidebarNav() {
  const userRole = useSelector((state) => state.auth.role); // Récupère le rôle via Redux
  const user = useSelector((state) => state.auth.user); // Récupère l'utilisateur via Redux
  const token = useSelector((state) => state.auth.token); // Récupère le token via Redux
  const dispatch = useDispatch(); // Pour effectuer la déconnexion
  const navigation = useNavigation();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // État pour afficher/masquer la barre latérale
  const [data, setData] = useState("");

  // Fonction pour gérer la déconnexion avec l'alerte
  const handleLogout = () => {
    console.log("Logout clicked");
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "cancel",
          style: "cancel",
        },
        {
          text: "yes",
          onPress: () => {
            dispatch(logout()); // Déclenche la déconnexion
            navigation.replace("TabNavigator", { screen: "LoginScreen" });
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Éléments de navigation pour le freelance
  const freelancerNavItems = [
    { name: "Profile", route: "Profile", icon: "person-outline" },
    { name: "List Of Offers", route: "ListOfOffers", icon: "briefcase-outline" },
    { name: "My Project", route: "MyProject", icon: "folder-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
  ];

  // Éléments de navigation pour le client
  const clientNavItems = [
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Project Management", route: "ProjectManagement", icon: "construct-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Project List", route: "ProjectList", icon: "list-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout }, // Ajouter la fonction de déconnexion
  ];

  // Définition des éléments en fonction du rôle
  const navItems = userRole === "freelancer" ? freelancerNavItems : clientNavItems;

  // Appel API pour mettre à jour les données de l'écran d'accueil
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

  // Fonction pour rendre les éléments de navigation
  const renderNavItem = (item) => (
    <TouchableOpacity
      key={item.route}
      style={styles.navItem}
      onPress={() => {
        setIsSidebarVisible(false); // Ferme la barre après navigation
        item.onPress ? item.onPress() : navigation.navigate(item.route); // Si une fonction de logout existe, l'exécuter
      }}
    >
      <Ionicons name={item.icon} size={24} color={styles.icon.color} style={styles.icon} />
      <Text style={styles.navText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("./assets/images/acc.jpg")}
      style={styles.imageBackground}
    >
      <View style={styles.mainContainer}>
        {/* Affichage du titre et de l'icône uniquement pour le client */}
        {userRole === "client" && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <FontAwesome5 name="laptop-code" size={35} style={styles.headerIcon} />
              <Text style={styles.headerText}>Freelancy</Text>
            </View>
          </View>
        )}

        {/* Bouton pour afficher/masquer la barre latérale */}
        {userRole === "client" && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            <Ionicons name="menu" size={28} color="#ADE1FB" />
          </TouchableOpacity>
        )}

        {/* Overlay pour fermer la barre latérale */}
        {isSidebarVisible && (
          <TouchableWithoutFeedback onPress={() => setIsSidebarVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {/* Barre latérale */}
        {userRole === "client" && isSidebarVisible && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
      <Text style={styles.sidebarTitle}>Freelancy</Text>
    </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {navItems.map(renderNavItem)}
            </ScrollView>
            {/* Bouton de fermeture */}
            <TouchableOpacity
  style={styles.closeButton}
  onPress={() => setIsSidebarVisible(false)}
>
  <Text style={{ fontSize:40,color: 'white' }}>&larr;</Text>
</TouchableOpacity>
          </View>
        )}

        {/* Contenu principal */}
        <View style={styles.content}>
          {userRole === "freelancer" ? (
            <View style={styles.freelancerContainer}>
              {freelancerNavItems.map(renderNavItem)}
            </View>
          ) : (
            <Text style={styles.welcomeText}>Chercher un freelancer ?</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  header: {
    alignItems: "center",
    justifyContent: "center", // Centrer horizontalement
    marginVertical: 15,
    position: "absolute", // Permet d'afficher en haut
    top: 20, // Distance depuis le haut de l'écran
    width: "100%", // S'assurer que le conteneur prend toute la largeur
  },
  headerContent: {
    flexDirection: "column", // Aligner l'icône et le texte verticalement
    alignItems: "center", // Centrer horizontalement
    justifyContent: "center",
  },
  headerIcon: {
    color: "#266CA9",
    marginBottom: -8, // Réduire l'espace entre l'icône et le texte
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#266CA9",
    marginTop: 10,
  },
  menuButton: {
    position: "absolute",
    top: 60,
    left: 10,
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  sidebar: {
    width:200,
    backgroundColor: "#ADE1FB",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    paddingTop: 50,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 150,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  closeButton: {
    position: "absolute",
    top:-40,
    right:-20,
    borderRadius: 20,
    padding: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  freelancerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    elevation: 1,
  },
  icon: {
    marginRight: 5,
    color: "#266CA9",
  },
  navText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#266CA9",
    textAlign: "left",
  },
  sidebarHeader: {
    alignItems: "flex-start", // Aligner le titre à gauche
    marginBottom: 0, // Espacement sous le titre
    paddingLeft:10, // Ajouter un peu d'espace à gauche pour décaler le titre
  },
  
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold", // Poids du texte
    color: "#266CA9", // Couleur bleue
    letterSpacing: 2, // Espacement entre les lettres pour un effet stylé
    textTransform: "uppercase", // Texte en majuscules
    fontFamily: "Borsok", // Police Borsok
    marginTop: -40, // Ajuste la position verticale du titre si nécessaire
  }
  
});

export default SidebarNav;
