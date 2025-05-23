import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { update_profile } from "./api";

const ProfilClient = ({ route }) => {
  const navigation = useNavigation();
  const isExternalView = route?.params?.isExternalView || false;

  const [profile, setProfile] = useState({
    id: "",
    companyName: "",
    companyDescription: "",
    clientNeeds: "",
    rating: 0,
    email: "",
    phone: "",
    location: "",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log("Contenu brut de AsyncStorage au démarrage :", storedUser);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Utilisateur chargé depuis AsyncStorage :", parsedUser);
          setProfile(parsedUser);
        } else {
          console.log("Aucun utilisateur trouvé dans AsyncStorage");
        }
      } catch (error) {
        console.log(
          "Erreur lors du chargement de l'utilisateur depuis AsyncStorage :",
          error
        );
      } finally {
        console.log("Chargement terminé");
      }
    })();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulation de chargement des données
        setTimeout(() => {
          setEditedProfile({
            companyName: "Tech Solutions Inc.",
            companyDescription:
              "We provide innovative tech solutions for businesses of all sizes.",
            clientNeeds: "Looking for experienced React Native developers",
            rating: 4,
            email: "contact@techsolutions.com",
            phone: "+1 555-123-4567",
            location: "Tunis, Tunisia",
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to change your profile image"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      console.log("editedProfile ", editedProfile);
      const res = update_profile(editedProfile);
      console.log("api update profile ", res);

      setProfile(editedProfile);

      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data");
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    navigation.navigate("Inbox", {
      recipientId: freelance.id,
      recipientName: `${freelance.user.name} ${freelance.user.lastName}`,
      isFreelancer: true,
    });
  };

  const renderStars = (rating, editable = false) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <MaterialIcons
          key={i}
          name={i < rating ? "star" : "star-border"}
          size={24}
          color={i < rating ? "#FFD700" : "#ccc"}
          onPress={
            editable
              ? () => {
                  setEditedProfile({ ...editedProfile, rating: i + 1 });
                }
              : null
          }
        />
      ));
  };

  const renderField = (label, value, isLast = false) => (
    <View style={[styles.formGroup, isLast && { marginBottom: 0 }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.fieldValue}>{value || "Not specified"}</Text>
    </View>
  );

  if (isLoading) {
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
            <Text style={styles.headerText}>Client Profile</Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text>Loading profile...</Text>
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
          <Text style={styles.headerText}>Client Profile</Text>
        </View>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons
                      name="add-a-photo"
                      size={40}
                      color="#5E548E"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.ratingContainer}>
                {renderStars(profile.rating)}
              </View>
            </View>

            {renderField("Company Name", profile.profile.companyName)}
            {renderField("Email", profile.email)}
            {renderField("Phone", profile.profile.phone)}
            {renderField("Location", profile.profile.location)}
            {renderField(
              "Company Description",
              profile.profile.companyDescription
            )}
            {renderField("Client Needs", profile.profile.clientNeeds, true)}

            {!isExternalView && (
              <Button
                mode="contained"
                onPress={() => {
                  setEditedProfile(profile);
                  setModalVisible(true);
                }}
                style={styles.editButton}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
              >
                Edit Profile
              </Button>
            )}

            {isExternalView && (
              <Button
                mode="contained"
                onPress={handleStartChat}
                style={styles.chatButton}
                labelStyle={styles.buttonLabel}
                icon="message"
              >
                Send Message
              </Button>
            )}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Company Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.companyName}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, companyName: text })
                  }
                  placeholder="Enter company name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.email}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, email: text })
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.phone}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, phone: text })
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.location}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, location: text })
                  }
                  placeholder="Enter location"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Company Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedProfile.companyDescription}
                  onChangeText={(text) =>
                    setEditedProfile({
                      ...editedProfile,
                      companyDescription: text,
                    })
                  }
                  placeholder="Describe your company"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Client Needs</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedProfile.clientNeeds}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, clientNeeds: text })
                  }
                  placeholder="Describe your needs"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(editedProfile.rating, true)}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={updateProfile}
                style={styles.saveButton}
                labelStyle={styles.buttonLabel}
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </View>
          </View>
        </Modal>
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
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  editButton: {
    borderRadius: 8,
    backgroundColor: "#0F2573",
    marginTop: 20,
    paddingVertical: 6,
  },
  chatButton: {
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    marginTop: 10,
    paddingVertical: 6,
  },
  buttonLabel: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F2573",
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    marginRight: 10,
    borderColor: "#0F2573",
  },
  cancelButtonLabel: {
    color: "#0F2573",
  },
  saveButton: {
    backgroundColor: "#0F2573",
    minWidth: 120,
  },
});

export default ProfilClient;
