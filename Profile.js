import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform, // <-- Platform est déjà importé ici
  Modal,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
// Supprimez cette ligne en double : import { Platform } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import api from "./api";
import { AuthContext } from "./contexts/AuthContext";

export default function Profile({ navigation }) {
  const { user, login, logout } = useContext(AuthContext);
  const token = user?.token;
  const userData = user?.user;
  const userId = userData?._id;

  const SERVER_URL = "http://localhost:5000/";

  const palette = {
    LIGHT_BLUE: "#ADE1FB",
    MEDIUM_BLUE: "#266CA9", 
    DARK_BLUE: "#0F2573",
    DARKER_BLUE: "#041D56",
    DARKEST_BLUE: "#01082D"
  };

  const colors = {
    primary: palette.MEDIUM_BLUE,
    secondary: palette.DARK_BLUE,
    accent: palette.LIGHT_BLUE,
    dark: palette.DARKEST_BLUE,
    light: "#FFFFFF",
    background: "#FFFFFF",
  };

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage
      ? SERVER_URL + userData.profileImage.replace(/\\/g, "/")
      : null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    competences: userData?.competences || "",
    experience: userData?.experience || "0",
    projectsDone: userData?.projectsDone || "0",
    tarif: userData?.tarif || "0",
    portfolio: userData?.portfolio || "",
  });

  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const selectImage = async () => {
    // Demande la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast("error", "Permission to access gallery was denied");
      return;
    }
  
    // Ouvre la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1], // Format carré (optionnel)
    });
  
    if (!result.canceled && result.assets) {
      setPreviewPhoto({
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || "profile.jpg",
        type: result.assets[0].type || "image/jpeg",
      });
    }
  };

  const takePhoto = async () => {
    // Demande la permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast("error", "Permission to access camera was denied");
      return;
    }
  
    // Ouvre l'appareil photo
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1], // Format carré (optionnel)
    });
  
    if (!result.canceled && result.assets) {
      setPreviewPhoto({
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || "photo.jpg",
        type: result.assets[0].type || "image/jpeg",
      });
    }
  };

  const savePhoto = () => {
    if (previewPhoto) {
      setProfileImage(previewPhoto);
      setPreviewPhoto(null);
      setShowPhotoModal(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !editFormData.fullName ||
      !editFormData.email ||
      !editFormData.competences ||
      !editFormData.experience ||
      !editFormData.projectsDone ||
      !editFormData.tarif ||
      !editFormData.portfolio
    ) {
      showToast("error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(editFormData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (profileImage && typeof profileImage === "object") {
        data.append("profileImage", {
          uri: profileImage.uri,
          name: profileImage.fileName,
          type: profileImage.type,
        });
      }

      const response = await api.put(`/profile/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("success", "Profile updated successfully!");
      setShowEditModal(false);

      const { updatedUser } = response.data;
      if (updatedUser) {
        login({ token, user: updatedUser });
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      showToast("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Hi, {editFormData.fullName || "User"}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image and Stats */}
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            onPress={() => setShowPhotoModal(true)} 
            style={styles.imageWrapper}
          >
            <Image
              source={
                profileImage
                  ? typeof profileImage === "object"
                    ? { uri: profileImage.uri }
                    : { uri: profileImage }
                  : require("./assets/avatar-placeholder.png")
              }
              style={[styles.profileImage, { borderColor: colors.primary }]}
            />
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
              <Icon name="photo-camera" size={22} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{editFormData.experience || "0"}+</Text>
              <Text style={[styles.statLabel, { color: colors.dark }]}>Years Experience</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{editFormData.projectsDone || "0"}</Text>
              <Text style={[styles.statLabel, { color: colors.dark }]}>Projects Done</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>${editFormData.tarif || "0"}/hr</Text>
              <Text style={[styles.statLabel, { color: colors.dark }]}>Hourly Rate</Text>
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.infoContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.dark }]}>Professional Information</Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.dark }]}>Full Name:</Text>
              <Text style={[styles.infoValue, { color: colors.dark }]}>{editFormData.fullName}</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.dark }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: colors.dark }]}>{editFormData.email}</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
           <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.dark }]}>Skills:</Text>
            <Text style={[styles.infoValue, { color: colors.dark }]}>
              {editFormData.competences?.replace(/,/g, ", ")}  {/* Ajoute un espace après les virgules */}
            </Text>
           </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.light, borderColor: colors.accent, borderWidth: 1 }]}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.dark }]}>My Projects:</Text>
              <Text style={[styles.infoValue, { color: colors.dark }]}>{editFormData.portfolio}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]} 
            onPress={() => setShowEditModal(true)}
          >
            <Icon name="edit" size={18} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.light }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.accent }]}>
            <Text style={[styles.modalTitle, { color: colors.dark }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Icon name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personal Information</Text>
              
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Email", key: "email" },
                { label: "Skills (comma separated)", key: "competences" },
                { label: "Experience (years)", key: "experience" },
                { label: "Projects Done", key: "projectsDone" },
                { label: "Hourly Rate ($)", key: "tarif" },
                { label: "My Projects", key: "portfolio" },
              ].map((field) => (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.dark }]}>{field.label}</Text>
                  <TextInput
                    style={[styles.modalInput, { 
                      backgroundColor: colors.light,
                      borderColor: colors.accent,
                      borderWidth: 1,
                      color: colors.dark
                    }]}
                    value={editFormData[field.key]}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, [field.key]: text })
                    }
                    keyboardType={field.key === 'experience' || field.key === 'projectsDone' || field.key === 'tarif' ? 'numeric' : 'default'}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.accent }]}>
            <TouchableOpacity 
              style={[styles.cancelButton, { 
                borderColor: colors.primary,
                backgroundColor: colors.light
              }]}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Photo Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPhotoModal}
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.light }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.accent }]}>
            <Text style={[styles.modalTitle, { color: colors.dark }]}>Change Profile Photo</Text>
            <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
              <Icon name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.photoModalContent}>
            <View style={[styles.avatarPreview, { borderColor: colors.primary }]}>
              <Image
                source={
                  previewPhoto
                    ? { uri: previewPhoto.uri }
                    : profileImage
                    ? typeof profileImage === "object"
                      ? { uri: profileImage.uri }
                      : { uri: profileImage }
                    : require("./assets/avatar-placeholder.png")
                }
                style={styles.previewImage}
              />
            </View>

            <View style={styles.photoOptions}>
              <TouchableOpacity 
                style={[styles.photoOptionButton, { 
                  backgroundColor: colors.light,
                  borderColor: colors.primary,
                  borderWidth: 1
                }]}
                onPress={selectImage}
              >
                <Icon name="photo-library" size={24} color={colors.primary} />
                <Text style={[styles.photoOptionText, { color: colors.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.photoOptionButton, { 
                  backgroundColor: colors.light,
                  borderColor: colors.primary,
                  borderWidth: 1
                }]}
                onPress={takePhoto}
              >
                <Icon name="photo-camera" size={24} color={colors.primary} />
                <Text style={[styles.photoOptionText, { color: colors.primary }]}>Take Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.photoTips}>
              <Text style={[styles.tipsTitle, { color: colors.dark }]}>Photo Guidelines</Text>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" />
                <Text style={[styles.tipText, { color: colors.dark }]}>Use high-quality images</Text>
              </View>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" />
                <Text style={[styles.tipText, { color: colors.dark }]}>Face should be clearly visible</Text>
              </View>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" />
                <Text style={[styles.tipText, { color: colors.dark }]}>Square images work best</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { backgroundColor: colors.primary },
                !previewPhoto && styles.disabledButton
              ]}
              onPress={savePhoto}
              disabled={!previewPhoto}
            >
              <Text style={styles.saveButtonText}>Save Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  headerTitle: { 
    color: "white", 
    fontSize: 20, 
    fontWeight: "600",
  },
  content: { 
    padding: 20,
    paddingTop: 10,
  },
  
  // Profile Section
  profileContainer: { 
    alignItems: "center", 
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 15,
    padding: 5,
  },
  
  // Stats Section
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  
  // Info Section
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  infoCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    flexShrink: 1,
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    justifyContent: "flex-end",
  },
  skillBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 3,
  },
  skillText: {
    color: "white",
    fontSize: 12,
  },
  
  // Edit Button
  editButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  
  // Modals
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  modalInput: {
    borderRadius: 8,
    padding: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  
  // Photo Modal
  photoModalContent: {
    padding: 20,
    alignItems: "center",
  },
  avatarPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  photoOptions: {
    width: "100%",
    marginBottom: 20,
  },
  photoOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  photoOptionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  photoTips: {
    width: "100%",
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 10,
  },
});