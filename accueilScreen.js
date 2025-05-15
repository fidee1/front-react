import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  Image,
  Button,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { logout } from "./authSlice";
import api from "./api";

function SidebarNav() {
  const [showForm, setShowForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [skills, setSkills] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [projectsCount, setProjectsCount] = useState("");
  const [freelancers, setFreelancers] = useState([
    { id: 1, name: "John D.", skills: "React, Node", rate: 50 },
    { id: 2, name: "Sarah M.", skills: "Design, UI/UX", rate: 45 },
    { id: 3, name: "Alex T.", skills: "Python, Django", rate: 60 },
    { id: 4, name: "Emma L.", skills: "iOS, Swift", rate: 55 },
    { id: 5, name: "Mike R.", skills: "Android, Kotlin", rate: 50 },
  ]);
  
  const handleFilter = () => {
    console.log("Skills:", skills);
    console.log("Budget Range:", budgetRange);
    console.log("Projects Count:", projectsCount);
    setShowFilterModal(false);
  };
  
  const handlePublishProject = () => {
    if (!projectTitle || !projectDescription || !projectBudget || !projectDeadline) {
      Alert.alert("Error", "All fields must be filled!");
    } else {
      Alert.alert("Success", "Your project has been published!");
      setProjectTitle("");
      setProjectDescription("");
      setProjectBudget("");
      setProjectDeadline("");
      setShowForm(false);
    }
  };

  const userRole = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
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
            dispatch(logout());
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
    { name: "Inbox", route: "Inbox", icon: "chatbubbles-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
  ];

  const clientNavItems = [
    { name: "Profil", route: "ProfilClient", icon: "person-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Project Management", route: "ProjectManagement", icon: "construct-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Project List", route: "projectlist", icon: "list-outline" },
    { name: "Inbox", route: "Inbox", icon: "chatbubbles-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
    { name: "Freelancers", route: "Freelancers", icon: "people-outline" }
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
    <View style={[styles.container, { backgroundColor: userRole === "freelancer" || userRole === "client" ? "#FFF" : "transparent" }]}>
      <View style={styles.mainContainer}>
        <View style={styles.globalHeader}>
      <Image
        source={require('./assets/images/logoo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <FontAwesome5 name="bars" size={28} color="#00000" />
        </TouchableOpacity>
  
        {isSidebarVisible && (
          <TouchableWithoutFeedback onPress={() => setIsSidebarVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
  
        {isSidebarVisible && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Image
              source={require('./assets/images/logoo.jpg')}
               style={styles.logo}
              resizeMode="contain"
              />
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
              
              {/* Liste horizontale des freelancers */}
              <View style={styles.freelancersSection}>
                <Text style={styles.sectionTitle}>Top Freelancers</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.freelancersScroll}
                >
                  {freelancers.map((freelancer) => (
                    <TouchableOpacity 
                      key={freelancer.id} 
                      style={styles.freelancerCard}
                    >
                      <View style={styles.avatar}>
                        <Ionicons name="person-circle-outline" size={40} color="#041D56" />
                      </View>
                      <Text style={styles.freelancerName}>{freelancer.name}</Text>
                      <Text style={styles.freelancerSkills}>{freelancer.skills}</Text>
                      <Text style={styles.freelancerRate}>${freelancer.rate}/hr</Text>
                    </TouchableOpacity>
                  ))}
                  
                  {/* Bouton More */}
                  <TouchableOpacity 
                    style={styles.moreButton}
                    onPress={() => navigation.navigate("Freelancers")}
                  >
                    <Text style={styles.moreText}>More</Text>
                    <Ionicons name="chevron-forward" size={20} color="#041D56" />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </>
          ) : (
            <Text style={styles.roleText}>
              Rôle inconnu. Veuillez contacter l'assistance.
            </Text>
          )}
        </View>

        {/* Barre latérale en bas pour le client */}
        {userRole === "client" && (
          <View style={styles.bottomSidebar}>
            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Inbox")}
            >
              <Ionicons name="chatbubbles-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Inbox</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("projectlist")}
            >
              <Ionicons name="list-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Freelancers")}
            >
              <Ionicons name="people-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Freelancers</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.centralButton} 
              onPress={() => setShowForm(true)}
            >
              <Ionicons name="add" size={32} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("ProjectManagement")}
            >
              <Ionicons name="construct-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Manage</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Invoices")}
            >
              <Ionicons name="cash-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Invoices</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Claim")}
            >
              <Ionicons name="library-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Claim</Text>
              
            </TouchableOpacity>
          </View>
        )}
  {userRole === "freelancer" && (
  <View style={styles.bottomSidebar}>
    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("ListOfOffers")}
    >
      <Ionicons name="briefcase-outline" size={20} color="#041D56" />
      <Text style={styles.bottomNavText}>Offers</Text>
    </TouchableOpacity>
    <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Claim")}
            >
              <Ionicons name="library-outline" size={20} color="#041D56" />
              <Text style={styles.bottomNavText}>Claim</Text>
            </TouchableOpacity>
    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("MyProject")}
    >
      <Ionicons name="folder-outline" size={20} color="#041D56" />
      <Text style={styles.bottomNavText}>Projects</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.centralButton} 
      onPress={() => navigation.navigate("Profile")}
    >
      <Ionicons name="person-outline" size={32} color="#FFF" />
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("Inbox")}
    >
      <Ionicons name="chatbubbles-outline" size={20} color="#041D56" />
      <Text style={styles.bottomNavText}>Inbox</Text>
    </TouchableOpacity>
    <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Invoices")}
            >
              <Ionicons name="cash-outline" size={20} color="#041D56" />
              <Text style={styles.bottomNavText}>Invoices</Text>
            </TouchableOpacity>
    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={18} color="#041D56" />
      <Text style={styles.bottomNavText}>Logout</Text>
    </TouchableOpacity>
    

            
  </View>
)}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
    paddingBottom: 70,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  globalHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#FFF",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 5,
    marginTop: -5,
  },
  
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: "99%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    zIndex: 20,
    paddingTop: 20,
  },
  sidebarHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF", // Fond blanc pour le header
  },
  logo: {
    width: 120,
    height: 80,
    marginTop: -10,
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#041D56", // Fond noir pour les items
    borderRadius: 8,
  },

  navText: {
    marginLeft: 15,
    color: "#FFFFFF", // Texte en blanc
    fontSize: 12,
    fontWeight: "500",
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
    top: 0,
    right: 10,
    zIndex: 20,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#00000",
    fontWeight: "bold",
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
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
    bottomSidebar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 6,  // Légèrement réduit
    paddingHorizontal: 5,
    height: 60,  // Hauteur totale réduite
  },
  
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 45,  // Largeur minimale réduite
    padding: 2,    // Padding intérieur réduit
  },
  
  centralButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#041D56',
    width: 50,      // Taille réduite
    height: 50,     // Taille réduite
    borderRadius: 25,
    marginTop: -25, // Ajusté en fonction de la nouvelle taille
    elevation: 4,   // Ombre légèrement réduite
  },
  
  bottomNavText: {
    fontSize: 9,    // Taille augmentée pour meilleure lisibilité (au lieu de 7)
    color: '#041D56',
    marginTop: 2,   // Espacement réduit
    textAlign: 'center',
    fontWeight: '500', // Ajouté pour améliorer la lisibilité
  },
  
  // Ajoutez ce style pour les icônes
  bottomNavIcon: {
    fontSize: 18,   // Taille réduite des icônes (standard: 20-24)
  },
  // Nouveaux styles pour la section freelancers
  freelancersSection: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#041D56',
    marginBottom: 10,
  },
  freelancersScroll: {
    paddingVertical: 5,
  },
  freelancerCard: {
    width: 120,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    marginBottom: 5,
  },
  freelancerName: {
    fontWeight: 'bold',
    color: '#041D56',
    fontSize: 14,
    textAlign: 'center',
  },
  freelancerSkills: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 3,
  },
  freelancerRate: {
    color: '#266CA9',
    fontSize: 12,
    fontWeight: 'bold',
  },
  moreButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moreText: {
    color: '#041D56',
    fontWeight: 'bold',
    marginRight: 5,
  },
  bottomSidebar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    position: "absolute", // Assure que la barre est positionnée de manière absolue
    bottom: 0, // La place au bas de l'écran
    width: "100%", // Étire la barre sur toute la largeur de l'écran
    zIndex: 10, // S'assure qu'elle reste au-dessus des autres éléments
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomNavText: {
    fontSize: 12,
    color: "#041D56",
    marginTop: 2,
    textAlign: "center",
  },
  centralButton: {
    width: 60,
    height: 60,
    backgroundColor: "#041D56",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
    bottom: 20, // Légèrement surélevé par rapport à la barre
  },
});

export default SidebarNav;