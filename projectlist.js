import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native"; // Added StatusBar, Platform
import { Badge } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { get_projects_with_proposals } from "./services/project";
import { update_status_application } from "./services/application";

const projectlist = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await get_projects_with_proposals();
        setProjects(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
        Alert.alert("Error", "Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleAcceptProposal = async (proposal) => {
    console.log("Accepted Proposal:", proposal.id);
    const res = await update_status_application(proposal.id, {
      statut: "accepted",
    });
    console.log("res update status application", res);
    window.location.reload();
  };
  const handleRefuseProposal = async (proposal) => {
    console.log("Refused Proposal:", proposal.id);
    const res = await update_status_application(proposal.id, {
      statut: "refuse",
    });
    console.log("res update status application", res);
    window.location.reload();
  };

  // getStatusColor updated for new statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "Available": // Changed from 'Open'
        return "#28a745"; // success green
      case "In Progress":
        return "#ffc107"; // warning yellow
      case "Affected": // Changed from 'Closed'
        return "#6c757d"; // secondary gray
      default:
        return "#007bff"; // primary blue
    }
  };

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.titre}</Text>
        <Badge
          value={item.budget} // Displays the new status text directly
          status="success" // This prop might not be needed if using custom background
          badgeStyle={{ backgroundColor: getStatusColor(item.status) }}
          textStyle={{ color: "white" }}
        />
      </View>
      <View style={styles.projectActions}>
        <Text style={styles.proposalsText}>
          {item.proposals_count} proposals
        </Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => openModal(item)}
        >
          <Text style={styles.buttonText}>View Proposals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProposalItem = ({ item, index }) => (
    <View style={styles.proposalCard} key={index}>
      <Text style={styles.freelancerName}>
        {item.freelancer.name} {item.freelancer.lastName}
      </Text>
      <Text style={styles.proposalText}>
        <Text style={styles.label}>Message:</Text> {item.motivation}
      </Text>
      <Text style={styles.proposalText}>
        <Text style={styles.label}>Tarif:</Text>
        {item.freelancer.profile.tarif}
      </Text>
      <View style={styles.proposalButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptProposal(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.refuseButton]}
          onPress={() => handleRefuseProposal(item)}
        >
          <Text style={styles.buttonText}>refuse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>My Posted Projects</Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <Modal
          visible={showModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowModal(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)}
                  style={styles.modalBackButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#0F2573" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  Proposals for {selectedProject?.titre}
                </Text>
              </View>
              {selectedProject?.proposals_count ? (
                <FlatList
                  data={selectedProject.applications}
                  renderItem={renderProposalItem}
                  keyExtractor={(item, index) => index.toString()}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.modalContent}
                />
              ) : (
                <View style={styles.noProposalsContainer}>
                  <Text style={styles.noProposalsText}>
                    No proposals received yet.
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  header: {
    backgroundColor: "#0F2573",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 5,
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  projectItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "500",
  },
  projectActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proposalsText: {
    color: "#666",
  },
  viewButton: {
    backgroundColor: "#0F2573",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  modalBackButton: {
    marginRight: 10,
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  proposalCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#0F2573",
  },
  freelancerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  proposalText: {
    marginBottom: 6,
    color: "#555",
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  proposalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#0F2573",
  },
  chatButton: {
    backgroundColor: "#0F2573",
  },
  refuseButton: {
    backgroundColor: "#0F2573",
  },
  noProposalsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default projectlist;
