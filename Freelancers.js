import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  toLowerCase,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Ajout de MaterialIcons
import { getFreelancers } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { get_freelancers } from "./services/freelancer";

const Freelancers = () => {
  const navigation = useNavigation();
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await get_freelancers();
        console.log("res", res);
        setFreelancers(res);
        setFilteredFreelancers(res);
        setLoading(false);
        return; 
      } catch (err) {
        console.error("Erreur lors du chargement des freelancers:", err);

        
        if (
          err.message === "Unauthenticated." ||
          err.response?.status === 401
        ) {
          setError("Session expirée. Veuillez vous reconnecter.");
          Alert.alert(
            "Session expirée",
            "Votre session a expiré. Veuillez vous reconnecter."
          );
          
          AsyncStorage.removeItem("accessToken");
        } else {
          setError(
            "Impossible de charger les freelancers: " +
              (err.message || "Erreur inconnue")
          );
          Alert.alert(
            "Erreur",
            "Impossible de charger les freelancers: " +
              (err.message || "Erreur inconnue")
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, []);

  
  const applyFilters = () => {
  let filtered = [...freelancers];

  if (skillFilter) {
    filtered = filtered.filter((freelancer) => {
      const competences = freelancer.profile?.competences || '';
      return competences.toLowerCase().includes(skillFilter.toLowerCase());
    });
  }
  
  if (minRate) {
    filtered = filtered.filter(
      (freelancer) => freelancer.profile?.rating >= parseInt(minRate || 0)
    );
  }
  
  if (maxRate) {
    filtered = filtered.filter(
      (freelancer) => freelancer.profile?.rating <= parseInt(maxRate || Infinity)
    );
  }

  setFilteredFreelancers(filtered);
};
  const clearFilters = () => {
    setSkillFilter("");
    setMinRate("");
    setMaxRate("");
    setFilteredFreelancers(freelancers);
  };
  const renderFreelancerItem = ({ item }) => (
  <View style={styles.freelancerCard}>
    <Text style={styles.freelancerName}>
      {item.name} {item.lastName}
    </Text>
    <Text style={styles.titleText}>{item.profile?.titre}</Text>
    <Text style={styles.competencesText}>{item.profile?.competences} </Text>
    <Text style={styles.rateText}>{item.profile?.tarif} TND/h</Text>
    
    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.chatButton]}
        onPress={() => navigation.navigate('Inbox', { freelancerId: item.id })}>
        <MaterialIcons name="chat" size={20} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.profileButton]}
        onPress={() => navigation.navigate('Profile', { freelancerId: item.id })}>
        <MaterialIcons name="person" size={20} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Freelancers</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={loadFreelancers}
            >
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Freelancers</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Section de filtrage */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Filter Freelancers</Text>

            <TextInput
              style={styles.input}
              placeholder="Search by skills (React, PHP, etc.)" // Translated
              value={skillFilter}
              onChangeText={setSkillFilter}
            />

          

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.buttonText}>Apply Filters</Text> //
                Translated
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Reset</Text> // Translated
              </TouchableOpacity>
            </View>
          </View>

          {/* Résultats */}
          <Text style={styles.resultsCount}>
            {filteredFreelancers.length} freelancers trouvés
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0F2573"
              style={styles.loader}
            />
          ) : filteredFreelancers.length > 0 ? (
            <FlatList
              data={filteredFreelancers}
              renderItem={renderFreelancerItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <Text style={styles.noResults}>
              Aucun freelancer ne correspond à vos critères
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F2573",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  header: {
    backgroundColor: "#0F2573",
    flexDirection: "row",
    alignItems: "center", // Vertically center items
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 5, // Added padding to shift content down slightly
    height: 80, // User specified height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: -100,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  filterSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F2573",
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  rateFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rateInput: {
    width: "48%",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  applyButton: {
    backgroundColor: "#0F2573",
  },
  clearButton: {
    backgroundColor: "#6c757d",
  },
  retryButton: {
    backgroundColor: "#0F2573",
    marginTop: 15,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultsCount: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 10,
    paddingLeft: 5,
  },
  freelancerCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  freelancerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  freelancerName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F2573",
  },
  titleText: {
    fontSize: 15,
    color: "#5E548E",
    marginBottom: 8,
  },
  competencesText: {
    fontSize: 15,
    color: "#5E548E",
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButton: {
    backgroundColor: "#0F2573",
  },
  profileButton: {
    backgroundColor: "#266CA9",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    color: "#0F2573",
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    color: "#495057",
  },
  skillsText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 5,
  },
  rateText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 5,
  },
  projectsText: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 15,
  },
  noResults: {
    textAlign: "center",
    marginTop: 30,
    color: "#6c757d",
    fontSize: 16,
  },
  loader: {
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Freelancers;