import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";

const offers = [
  {
    id: "1",
    title: "Web Development Project",
    description: "A challenging web development project using React Native.",
    state: "Open",
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Create a mobile app for a healthcare startup.",
    state: "Closed",
  },
];

export default function ListOfOffers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOffers, setFilteredOffers] = useState(offers);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [motivationText, setMotivationText] = useState("");

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = offers.filter((offer) =>
      offer.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  const openModal = (offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOffer(null);
    setMotivationText("");
  };

  const submitApplication = () => {
    console.log("Motivation:", motivationText);
    console.log("Applying for:", selectedOffer.title);
    closeModal();
  };

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.title}>Title: {item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View>
          <Text
            style={[
              styles.badge,
              item.state === "Open" ? styles.badgeOpen : styles.badgeClosed,
            ]}
          >
            {item.state}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => openModal(item)}
      >
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Offers</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for projects..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Apply for Project: {selectedOffer?.title}
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your motivation here..."
              value={motivationText}
              onChangeText={setMotivationText}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={closeModal} color="#dc3545" />
              <Button title="Submit" onPress={submitApplication} color="#0d6efd" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContainer: {
    paddingBottom: 16,
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeOpen: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  badgeClosed: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  textArea: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
