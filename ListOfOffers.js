import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { get_available_projects } from "./services/project";
import { useSelector } from "react-redux";

const ListOfOffers = ({ navigation }) => {
  const userConnected = useSelector((state) => state.auth?.user) || {};

  const [maxBudget, setMaxBudget] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("Oldest First");
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await get_available_projects();
        setProjects(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
        Alert.alert("Error", "Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleApplyProject = (id) => {
    setSelectedProjectId(id);
    setModalVisible(true);
  };

  const handleSendMotivation = () => {
    console.log("Motivation for project", selectedProjectId, ":", motivation);
    setModalVisible(false);
    setMotivation("");
  };

  const renderProjectCard = (project) => (
    <View key={project.id} style={styles.card}>
      <Text style={styles.cardTitle}>{project.titre}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Skills:</Text>
        <Text style={styles.cardValue}>
          {Array.isArray(project.skills)
            ? project.skills.join(", ")
            : typeof project.skills === "string"
            ? project.skills.startsWith("[")
              ? JSON.parse(project.skills).join(", ")
              : project.skills
            : project.skills}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Budget:</Text>
        <Text style={styles.cardValue}>{project.budget}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Deadline:</Text>
        <Text style={styles.cardValue}>{project.date_limite}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.actionButton,
          userConnected.applications.some((app) => app.id == project.id)
            ? styles.appliedButton
            : styles.applyButton,
        ]}
        disabled={userConnected.applications.some(
          (app) => app.id == project.id
        )}
        onPress={() => handleApplyProject(project.id)}
      >
        <Text style={styles.actionButtonText}>
          {userConnected.applications.some((app) => app.id == project.id)
            ? "Already Applied"
            : "Apply"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor="#0F2573"
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Projects</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Budget (TD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter max budget"
            keyboardType="numeric"
            value={maxBudget}
            onChangeText={setMaxBudget}
          />

          <Text style={styles.filterLabel}>Deadline Before</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={deadline ? styles.dateText : styles.placeholderText}>
              {deadline ? deadline.toLocaleDateString("fr-FR") : "jj/mm/aaaa"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.filterLabel}>Skills</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter required skills"
            value={selectedCategory}
            onChangeText={setSelectedCategory}
          />

          <View style={styles.sortButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === "Oldest First" && styles.activeSortButton,
              ]}
              onPress={() => setSortBy("Oldest First")}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === "Oldest First" && styles.activeSortButtonText,
                ]}
              >
                Oldest First
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === "Newest First" && styles.activeSortButton,
              ]}
              onPress={() => setSortBy("Newest First")}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === "Newest First" && styles.activeSortButtonText,
                ]}
              >
                Newest First
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>{projects.map(renderProjectCard)}</View>
        <Text style={styles.footer}>© 2025</Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Motivation</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Why are you applying for this project?"
              value={motivation}
              onChangeText={setMotivation}
              multiline
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSend]}
                onPress={handleSendMotivation}
              >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F2573",
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 70,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  filtersContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  listContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 5,
  },
  cardValue: {
    fontSize: 14,
    color: "#333",
  },
  cardValueChip: {
    fontSize: 12,
    color: "#007bff",
    backgroundColor: "#e7f3ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#e7f3ff",
  },
  appliedButton: {
    backgroundColor: "#d4edda",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    padding: 10,
    height: 80,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: "#e7f3ff",
  },
  modalButtonSend: {
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#003366",
    fontWeight: "bold",
  },
  sortButtonsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 10,
  paddingVertical: 10,
  backgroundColor: "#ffffff",
  borderRadius: 8,
  paddingHorizontal: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, // Pour Android
},
sortButton: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderWidth: 1,
  borderColor: "#ced4da",
  borderRadius: 5,
  alignItems: "center",
  marginHorizontal: 5,
  backgroundColor: "#f8f9fa",
},
activeSortButton: {
  backgroundColor: "#007bff",
  borderColor: "#0056b3",
},
sortButtonText: {
  fontSize: 14,
  color: "#333",
},
activeSortButtonText: {
  color: "#ffffff",
  fontWeight: "600",
},
});

export default ListOfOffers;
