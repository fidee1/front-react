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
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import api from "./api";
import { AuthContext } from "./contexts/AuthContext";

export default function Profile({ navigation }) {
  const { user, login, logout } = useContext(AuthContext);
  const token = user?.token;
  const userData = user?.user;
  const userId = userData?._id;

  const SERVER_URL = "http://localhost:5000/";

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage
      ? SERVER_URL + userData.profileImage.replace(/\\/g, "/")
      : null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    competences: userData?.competences || "",
    experience: userData?.experience || "",
    portfolio: userData?.portfolio || "",
    tarif: userData?.tarif || "",
  });

  const [editFormData, setEditFormData] = useState({ ...formData });

  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel) {
        showToast("info", "Image selection canceled");
      } else if (response.errorMessage) {
        showToast("error", "Error selecting image");
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        let imageUri = asset.uri;
        if (Platform.OS === "android" && !imageUri.startsWith("file://")) {
          imageUri = "file://" + imageUri;
        }

        setPreviewPhoto({
          uri: imageUri,
          fileName: asset.fileName || "profile.jpg",
          type: asset.type || "image/jpeg",
        });
      }
    });
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
      !editFormData.portfolio ||
      !editFormData.tarif
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
      setFormData({ ...editFormData });
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

  const completedProjects = 3; // Vous devrez récupérer cette valeur depuis votre API

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Hi, {formData.fullName || "User"}
        </Text>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" size={24} color="white" />
        </TouchableOpacity>
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
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Icon name="photo-camera" size={22} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formData.experience || "0"}+</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedProjects}</Text>
              <Text style={styles.statLabel}>Projects Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${formData.tarif || "0"}/hr</Text>
              <Text style={styles.statLabel}>Hourly Rate</Text>
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.infoContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color="#6A0DAD" />
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              <Text style={styles.infoValue}>{formData.fullName}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                <Icon name="email" size={16} color="#6A0DAD" /> {formData.email}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Skills:</Text>
              <View style={styles.skillsContainer}>
                {formData.competences?.split(",").map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Portfolio:</Text>
              <Text style={styles.infoValue}>{formData.portfolio}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => {
              setEditFormData({ ...formData });
              setShowEditModal(true);
            }}
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Icon name="close" size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Email", key: "email" },
                { label: "Skills (comma separated)", key: "competences" },
                { label: "Experience (years)", key: "experience" },
                { label: "Portfolio", key: "portfolio" },
                { label: "Hourly Rate ($)", key: "tarif" },
              ].map((field) => (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editFormData[field.key]}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, [field.key]: text })
                    }
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>
            <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
              <Icon name="close" size={24} color="#6A0DAD" />
            </TouchableOpacity>
          </View>

          <View style={styles.photoModalContent}>
            <View style={styles.avatarPreview}>
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

            <TouchableOpacity 
              style={styles.photoButton}
              onPress={selectImage}
            >
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>

            <View style={styles.photoTips}>
              <Text style={styles.tipsTitle}>Photo Guidelines</Text>
              <View style={styles.tipItem}>
                <FontAwesome name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Use high-quality images</Text>
              </View>
              <View style={styles.tipItem}>
                <FontAwesome name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Face should be clearly visible</Text>
              </View>
              <View style={styles.tipItem}>
                <FontAwesome name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Square images work best</Text>
              </View>
              <View style={styles.tipItem}>
                <FontAwesome name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Max file size: 5MB</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, !previewPhoto && styles.disabledButton]}
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
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    backgroundColor: "#6A0DAD",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  
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
    borderColor: "#6A0DAD",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#6A0DAD",
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
    backgroundColor: "rgba(239, 246, 255, 0.7)",
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
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
    color: "#1E293B",
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#334155",
    fontSize: 14,
  },
  infoValue: {
    color: "#475569",
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
    backgroundColor: "#6A0DAD",
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
    backgroundColor: "#6A0DAD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    shadowColor: "#6A0DAD",
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
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
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
    color: "#334155",
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F8FAFC",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#6A0DAD",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6A0DAD",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#6A0DAD",
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
    borderColor: "#6A0DAD",
    marginBottom: 20,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  photoButton: {
    backgroundColor: "#E0E7FF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  photoButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "600",
  },
  photoTips: {
    width: "100%",
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipText: {
    color: "#475569",
    fontSize: 14,
    marginLeft: 10,
  },
});