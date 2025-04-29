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
  Button,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { logout } from "./authSlice"; // Assurez-vous que le fichier de Redux est correctement configuré
import api from "./api";

function SidebarNav() {
//const userRole = useSelector((state) => state.auth.role); // Récupérer le rôle de l'utilisateur depuis Redux
  const [showForm, setShowForm] = useState(false); // Contrôler l'affichage du formulaire
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [skills, setSkills] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [projectsCount, setProjectsCount] = useState("");
  // Fonction pour gérer le filtrage
  const handleFilter = () => {
    console.log("Skills:", skills);
    console.log("Budget Range:", budgetRange);
    console.log("Projects Count:", projectsCount);
    setShowFilterModal(false); // Fermer la modal après le filtrage
  };
  
  // Fonction pour publier le projet
  const handlePublishProject = () => {
    if (!projectTitle || !projectDescription || !projectBudget || !projectDeadline) {
      Alert.alert("Error", "All fields must be filled!");
    } else {
      // Simuler l'envoi des données
      Alert.alert("Success", "Your project has been published!");
      // Réinitialiser le formulaire
      setProjectTitle("");
      setProjectDescription("");
      setProjectBudget("");
      setProjectDeadline("");
      setShowForm(false);
    }
  };

  const userRole = useSelector((state) => state.auth.role); // Récupère le rôle via Redux
  const user = useSelector((state) => state.auth.user); // Récupère l'utilisateur via Redux
  const token = useSelector((state) => state.auth.token); // Récupère le token via Redux
  const dispatch = useDispatch(); // Pour effectuer la déconnexion
  const navigation = useNavigation();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // État pour afficher/masquer la barre latérale
  const [data, setData] = useState("");

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            dispatch(logout()); // Déclenche la déconnexion
            navigation.replace("TabNavigator", { screen: "LoginScreen" });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const freelancerNavItems = [
    { name: "Profile", route: "Profile", icon: "person-outline" },
    { name: "List Of Offers", route: "ListOfOffers", icon: "briefcase-outline" },
    { name: "My Project", route: "MyProject", icon: "folder-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
  ];

  const clientNavItems = [
    { name: "Profil Client", route: "ProfilClient", icon: "person-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Project Management", route: "ProjectManagement", icon: "construct-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Project List", route: "ProjectList", icon: "list-outline" },
    { name: "Inbox", route: "Inbox", icon: "mail-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
  ];

  const navItems = userRole === "freelancer" ? freelancerNavItems : clientNavItems;

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
      onPress={() => {
        setIsSidebarVisible(false);
        item.onPress ? item.onPress() : navigation.navigate(item.route);
      }}
    >
      <Ionicons name={item.icon} size={24} color="#FFF" style={styles.icon} />
      <Text style={styles.navText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("./assets/images/acc.jpg")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.mainContainer}>
        {/* En-tête global en haut de l'écran */}
        <View style={styles.globalHeader}>
          <FontAwesome5 name="laptop-code" size={28} style={styles.globalHeaderIcon} />
          <Text style={styles.globalHeaderTitle}>Freelancy</Text>
        </View>
  
        {/* Bouton pour afficher/masquer la barre latérale */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <FontAwesome5 name="bars" size={28} color="#ADE1FB" />
        </TouchableOpacity>
  
        {/* Overlay lorsque la barre latérale est visible */}
        {isSidebarVisible && (
          <TouchableWithoutFeedback onPress={() => setIsSidebarVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
  
        {/* Barre latérale */}
        {isSidebarVisible && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <FontAwesome5 name="laptop-code" size={28} style={styles.headerIcon} />
              <Text style={styles.sidebarTitle}>Freelancy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {navItems.map(renderNavItem)}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsSidebarVisible(false)}
            >
              <Text style={styles.closeButtonText}>&larr;</Text>
            </TouchableOpacity>
          </View>
        )}
  
      {/* Contenu principal */}
<View style={styles.content}>
  {userRole === "freelancer" ? (
    <View style={styles.roleContent}>
      <Text style={styles.roleTitle}>Bienvenue, Freelancer !</Text>
      <Text style={styles.roleText}>
        Ici, vous pouvez gérer vos offres, projets, et consulter vos factures.
      </Text>
    </View>
  ) : userRole === "client" ? (
    <>
      <View style={styles.roleContent}>
        <Text style={styles.roleTitle}>Welcome, Client! </Text>
        <Text style={[styles.roleText, { marginBottom: 20 }]}>
          Are you looking for a freelancer for your project? Here, you can post
          your project and connect with the perfect freelancer to meet your
          needs.
        </Text>
        {/* Bouton pour afficher le formulaire */}
        <Button
          title="Publish a Project"
          onPress={() => setShowForm(true)}
          color="#041D56"
        />

        {/* Modal pour afficher le formulaire */}
        <Modal
          visible={showForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowForm(false)} // Permet de fermer le modal en appuyant en dehors
        >
          <View style={styles.modalOverlay}>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Post Your Project</Text>

              <TextInput
                style={styles.input}
                placeholder="Project Title"
                value={projectTitle}
                onChangeText={setProjectTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Project Description"
                value={projectDescription}
                onChangeText={setProjectDescription}
                multiline
                numberOfLines={4}
              />
              <TextInput
                style={styles.input}
                placeholder="Budget"
                keyboardType="numeric"
                value={projectBudget}
                onChangeText={setProjectBudget}
              />
              <TextInput
                style={styles.input}
                placeholder="Project Deadline (e.g., 30 days)"
                value={projectDeadline}
                onChangeText={setProjectDeadline}
              />

              <Button
                title="Submit Project"
                onPress={handlePublishProject}
                color="#0F2573"
              />
              <Button
                title="Close"
                onPress={() => setShowForm(false)}
                color="#01082D"
              />
            </View>
          </View>
        </Modal>
      </View>
      {/* Deuxième section : Zone de filtrage */}
      <View style={styles.roleContent}>
        <Text style={styles.roleTitle}>Filter Freelancers</Text>
        <Text style={[styles.roleText, { marginBottom: 20 }]}>
          Use the filters below to narrow down your search for the perfect
          freelancer.
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Open Filter Options</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour le formulaire de filtrage */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Freelancers</Text>
            <TextInput
              style={styles.input}
              placeholder="Skills (e.g., React, Laravel)"
              value={skills}
              onChangeText={setSkills}
            />
            <TextInput
              style={styles.input}
              placeholder="Budget Range (e.g., $500-$1000)"
              value={budgetRange}
              onChangeText={setBudgetRange}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Projects (e.g., >5)"
              keyboardType="numeric"
              value={projectsCount}
              onChangeText={setProjectsCount}
            />
            <View style={styles.buttonGroup}>
              <Button
                title="Filter"
                onPress={handleFilter}
                color= "#041D56"

              />
              <Button
                title="Close"
                onPress={() => setShowFilterModal(false)}
                color="#01082D"
              />
            </View>
          </View>
        </View>
      </Modal>
      
    </>
  ) : (
    <Text style={styles.roleText}>
      Rôle inconnu. Veuillez contacter l'assistance.
    </Text>
  )}
</View>

      </View>
    </ImageBackground>
  );
  
}

const styles = StyleSheet.create({
  globalHeader: {
    flexDirection: "column", // Placer l'icône au-dessus du texte
    alignItems: "center",
    marginTop: 40, // Ajuster l'espacement
    marginBottom: 20,
  },
  globalHeaderIcon: {
    color: "#266CA9",
    marginBottom: 5, // Espace entre l'icône et le texte
  },
  globalHeaderTitle: {
    color: "#266CA9",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top:20,
    left: 0,
    width:150,
    height: "100%",
    backgroundColor: "#ADE1FB",
    paddingVertical: 20,
    zIndex: 20,
    paddingTop:30,//outer de l'espace pour l'icône du menu
  },
  
  sidebarIcon: {
    color: "#266CA9",// de l'icône du menu
    marginLeft: 20,
    marginBottom:50,//spacement après l'icône du menu
  },
  
  sidebarHeader: {
    flexDirection: "column", // Placer l'icône et le texte en colonne
    alignItems: "center",
    marginBottom: 50,
  },
  
  headerIcon: {
    color: "#266CA9",//r de l'icône
    marginBottom: 2,// Espacement entre l'icône et le texte
  },
  
  sidebarTitle: {
    color: "#266CA9",// du texte
    fontSize: 20,
    fontWeight: "bold",
  },
  
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  navText: {
    marginLeft: 15,
    color: "#FFF",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  closeButton: {
    position: "absolute",
    top:0, // Positionne la flèche en haut de la barre latérale
    right: 10, // Aligne la flèche à droite
    zIndex: 20, // Assure que la flèche est visible
  },
  closeButtonText: {
    fontSize: 20,// Augmente la taille de la flèche
    color: "#FFF", // Change la couleur en blanc
    fontWeight: "bold", // Ajoute un style gras pour une meilleure visibilité
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  roleContent: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#041D56",
    marginBottom: 2,
  },
  roleText: {
    fontSize: 14,
    color: "#266CA9",
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center", // Centre verticalement
    alignItems: "center", // Centre horizontalement
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond sombre
  },
  formContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center", // S'assure que le modal reste centré
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#266CA9",
    marginBottom: 15,
    textAlign: "center", // Centre le titre
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  roleContent: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#266CA9",
    marginBottom: 10,
  },
  roleText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  filterButton: {
    backgroundColor: "#041D56",
    padding: 8,
    borderRadius: 0,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#266CA9",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  freelancerItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  freelancerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041D56',
  },
  freelancerSkills: {
    fontSize: 14,
    color: '#555',
  },
  
});

export default SidebarNav;
