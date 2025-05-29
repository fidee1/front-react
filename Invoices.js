import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { add_invoice, get_invoices } from "./services/invoice";
import { get_projects_freelancer } from "./services/project";
import { get_clients } from "./services/client";

const Invoices = () => {
  const userRole = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    montant: "",
    description: "",
    date_limite: "",
    client_id: "",
  });

  const isClient = userRole === "client";

  const renderStatus = (status) => {
    let statusStyle, statusText;

    if (status === "Paid") {
      statusStyle = styles.statusPaid;
      statusText = "Paid";
    } else if (status === "Unpaid") {
      statusStyle = styles.statusUnpaid;
      statusText = "Unpaid";
    } else {
      statusStyle = styles.statusPending;
      statusText = "Pending";
    }

    return <Text style={[styles.status, statusStyle]}>{statusText}</Text>;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await get_invoices();
        console.log("res", res);
        setData(res);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await get_clients();
        setClients(res);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await get_projects_freelancer();
        setProjects(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
    fetchClients();
    fetchInvoices();
  }, []);

  const handleAddInvoice = () => {
    // Logic to handle adding a new invoice (e.g., form submission)
    console.log("Invoice added:", formData);

    const res = add_invoice(formData);
    console.log("res add invoice", res);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar barStyle="light-content" backgroundColor="#0F2573" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Invoices</Text>
      </View>

      {/* Invoice List */}
      <ScrollView style={styles.scrollView}>
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.projectName}>{item.project.titre}</Text>
              <Text style={styles.amount}>{item.montant}</Text>
            </View>

            {/* Display Client or Freelancer Name */}
            <View style={styles.cardRow}>
              <Text style={styles.label}>
                {isClient ? "Freelancer:" : "Client:"}
              </Text>
              <Text style={styles.value}>
                {isClient ? item.freelancer.name : item.client.name}
              </Text>
            </View>

            {/* Status and Deadline */}
            <View style={styles.cardRow}>
              <Text style={styles.label}>Status:</Text>
              {renderStatus(item.statut)}
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.label}>Deadline:</Text>
              <Text style={styles.value}>{item.date_limite}</Text>
            </View>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>View Details</Text>
              <MaterialIcons name="chevron-right" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Invoice Button (Visible uniquement pour les freelances) */}
      {!isClient && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Invoice</Text>
        </TouchableOpacity>
      )}

      {/* Add Invoice Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Invoice</Text>
            {/* Project Picker */}
            <Text style={styles.label}>Select Project:</Text>
            <Picker
              selectedValue={formData.project_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, project_id: value }))
              }
              style={styles.picker}
            >
              <Picker.Item label="-- Select Project --" value="" />
              {projects.map((project) => (
                <Picker.Item
                  key={project.id}
                  label={project.titre}
                  value={project.id}
                />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="e.g. 200"
              keyboardType="numeric"
              value={formData.montant}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, montant: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="jj/mm/aaaa"
              value={formData.date_limite}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, date_limite: text }))
              }
            />
            {/* Client Picker */}
            <Text style={styles.label}>Select Client:</Text>
            <Picker
              selectedValue={formData.client_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, client_id: value }))
              }
              style={styles.picker}
            >
              <Picker.Item label="-- Select Client --" value="" />
              {clients.map((client) => (
                <Picker.Item
                  key={client.id}
                  label={client.name}
                  value={client.id}
                />
              ))}
            </Picker>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Submit" onPress={handleAddInvoice} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F2573",
    height: 70,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
    color: "#333",
  },
  montant: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#777",
    width: 100,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  statusPaid: {
    backgroundColor: "#e6f7ee",
    color: "#28a745",
  },
  statusUnpaid: {
    backgroundColor: "#feeae9",
    color: "#dc3545",
  },
  statusPending: {
    backgroundColor: "#fff3cd",
    color: "#ffc107",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  actionText: {
    color: "#4a90e2",
    fontWeight: "600",
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default Invoices;
