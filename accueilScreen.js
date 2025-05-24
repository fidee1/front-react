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
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import { Platform, StatusBar } from 'react-native';
const screenHeight = Dimensions.get('window').height;
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 10 : 10;
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
    { id: 5, name: "Mike R.", skills: "Android, Kotlin", rate: 50},
  ]);
  
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
    { name: "Project Management", route: "ProjectManagement", icon: "construct-outline" },
    { name: "Invoices", route: "Invoices", icon: "cash-outline" },
    { name: "Claim", route: "Claim", icon: "library-outline" },
    { name: "Project List", route: "projectlist", icon: "list-outline" },
    { name: "Inbox", route: "Inbox", icon: "chatbubbles-outline" },
    { name: "Freelancers", route: "Freelancers", icon: "people-outline" },
    { name: "Logout", route: "Logout", icon: "log-out-outline", onPress: handleLogout },
  ];

  const navItems = userRole === "freelancer" ? freelancerNavItems : clientNavItems;

  useEffect(() => {
    const updateAccueilScreenData = async () => {
      if (token && user?.id) {
        try {
                    const response = await api.get(
            `/accueilScreen/${user.id}`,
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
        source={require('./assets/images/logoo1.png')}
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
              source={require('./assets/images/logoo1.png')}
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
  <View style={[styles.roleContent, styles.freelancerTheme]}>
    <Text style={styles.roleTitle}>
      {user?.name ? `Welcome ${user.name},` : 'Welcome,'} Super Freelancer! 👋
    </Text>
    <Text style={styles.motivationText}>
      Your next great opportunity starts here! Find projects that perfectly match your unique skills.
    </Text>
    <View style={styles.featuresContainer}>
      {[
        '💼 Manage proposals & projects',
        '📝 Track invoices ',
        '📬 Never miss an update',
        '⭐ Showcase your best work'
      ].map((feature, index) => (
        <Text key={index} style={styles.featureItem}>
          {feature}
        </Text>
      ))}
    </View>
    <View style={styles.specialFeatureContainer}>
      <Text style={styles.specialFeatureText}>
        🔍 Explore thousands of IT projects in all domains:
      </Text>
      <Text style={styles.domainsList}>
        Web Development • Mobile Apps • AI/ML • Cybersecurity • Cloud Computing • DevOps
      </Text>
      
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => navigation.navigate('ListOfOffers')}
      >
        <Text style={styles.searchButtonText}>
          🚀 Search Projects Now
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)   : userRole === "client" ? (
  <View style={[styles.roleContent, styles.clientTheme]}>
    <Text style={styles.roleTitle}>
      {user?.company ? `Welcome ${user.company},` : 'Welcome, Valued Client!'} 👔
    </Text>
    <Text style={styles.motivationText}>
      Find the perfect talent to bring your vision to life!
    </Text>

    <View style={styles.featuresContainer}>
      {[
        '📈 Manage projects & budgets',
        '🔍 Find top-rated freelancers',
        '🔒 Secure payment system',
        '🚀 Launch projects faster'
      ].map((feature, index) => (
        <Text key={index} style={styles.featureItem}>
          {feature}
        </Text>
      ))}
    </View>

    <View style={styles.specialFeatureContainer}>
      <Text style={styles.specialFeatureText}>
        🌟 Access top talent across all domains:
      </Text>
      <Text style={styles.domainsList}>
        Full-Stack Developers • Mobile Experts • AI Specialists • Cybersecurity Pros • Cloud Architects
      </Text>
      
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => navigation.navigate('Freelancers')}
      >
        <Text style={styles.searchButtonText}>
          🔎 Search Freelancers Now
        </Text>
      </TouchableOpacity>
    </View>
  </View>
): (
            <Text style={styles.roleText}>
              Rôle inconnu. Veuillez contacter l'assistance.
            </Text>
          )}
        </View>

        {/* Barre latérale en bas pour le client */}
        {userRole === "client" && (
  <View style={[styles.bottomSidebar]}>
    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("Inbox")}
    >
      <Ionicons name="chatbubbles-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Inbox
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("projectlist")}
    >
      <Ionicons name="list-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10}]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Projects
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("Freelancers")}
    >
      <Ionicons name="people-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Freelancers
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
  style={styles.centralButton} 
  onPress={() => navigation.navigate("AddProject")} // Modifié ici
>
  <Ionicons name="add" size={24} color="#FFF" />
</TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("ProjectManagement")}
    >
      <Ionicons name="construct-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Manage
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("Invoices")}
    >
      <Ionicons name="cash-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Invoices
      </Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem}
      onPress={() => navigation.navigate("Claim")}
    >
      <Ionicons name="library-outline" size={16} color="#041D56" />
      <Text 
        style={[styles.bottomNavText, { fontSize: 10 }]}
        numberOfLines={1}
        adjustsFontSizeToFit={false}
      >
        Claim
      </Text>
    </TouchableOpacity>
  </View>
)}
  {userRole === "freelancer" && (
  <View style={styles.bottomSidebar}>
    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("ListOfOffers")}
    >
      <Ionicons name="briefcase-outline" size={18} color="#041D56" />
      <Text style={styles.bottomNavText}>Offers</Text>
    </TouchableOpacity>
    <TouchableOpacity 
              style={styles.bottomNavItem} 
              onPress={() => navigation.navigate("Claim")}
            >
              <Ionicons name="library-outline" size={18} color="#041D56" />
              <Text style={styles.bottomNavText}>Claim</Text>
            </TouchableOpacity>
    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("MyProject")}
    >
      <Ionicons name="folder-outline" size={18} color="#041D56" />
      <Text style={styles.bottomNavText}>Projects</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.centralButton} 
      onPress={() => navigation.navigate("Profile")}
    >
      <Ionicons name="person-outline" size={25} color="#FFF" />
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.bottomNavItem} 
      onPress={() => navigation.navigate("Inbox")}
    >
      <Ionicons name="chatbubbles-outline" size={18} color="#041D56" />
      <Text style={styles.bottomNavText}>Inbox</Text>
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
    height: "95.2%",
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
    height: 100,
    marginTop: 10,
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
    top: 15,
    right: 10,
    zIndex: 20,
  },
  closeButtonText: {
    fontSize: 30,
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
    bottom: statusBarHeight + 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 5,
    height: 60,
    zIndex: 100,
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  
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
    fontSize: 8, // Taille fixe en pixels
    color: "#041D56",
    marginTop: 2,
    textAlign: "center",
    includeFontPadding: false, // Essential
    textAlignVertical: 'center', // Pour Android
    allowFontScaling: false, // Bloque l'ajustement automatique
    lineHeight: 10, // Doit être légèrement > que fontSize
    fontWeight: 'normal', // Évitez 'bold' qui prend plus de place
  },
  
  // Style à appliquer sur le conteneur parent si nécessaire
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Hauteur fixe
    paddingVertical: 0, // Supprime tout padding vertical
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
    shadowObpacity: 0.1,
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
  paddingVertical: 12,
  position: "absolute",
  bottom: Platform.select({
    android: Dimensions.get('window').height * 0.06,
    default: Dimensions.get('window').height * 0.03
  }),
  width: Dimensions.get('window').width, // Largeur exacte de l'écran
  height: 60, // Hauteur fixe pour plus de fiabilité
  zIndex: 10,
  borderTopWidth: 1,
  borderTopColor: "#E0E0E0",
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 3,
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
  roleContent: {
    padding: 10,
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: -25,
  },
  freelancerTheme: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  clientTheme: {
  backgroundColor: '#F3FCF7',
  borderLeftWidth: 4,
  borderLeftColor: '#10B981',
},
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 1,
    marginTop: 10,
  },
  featureItem: {
    fontSize: 15,
    color: '#475569',
    marginVertical: 4,
    lineHeight: 24,
  },
  specialFeatureContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 10,
  },
  specialFeatureText: {
    fontSize: 16,
    color: '#1E40AF',
    marginBottom: 8,
    fontWeight: '500',
  },
  domainsList: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SidebarNav;