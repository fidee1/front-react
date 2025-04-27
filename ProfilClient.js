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
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import api from "./api";
import { AuthContext } from "./contexts/AuthContext";

export default function Profile({ navigation }) {
  const { user, login } = useContext(AuthContext);
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

  const [editFormData, setEditFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
  });

  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const handleSubmit = async () => {
    if (!editFormData.fullName || !editFormData.email) {
      showToast("error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = { ...editFormData };
      const response = await api.put(`/profile/${userId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("success", "Profile updated successfully!");
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
        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("./assets/avatar-placeholder.png")
            }
            style={[styles.profileImage, { borderColor: colors.primary }]}
          />
        </View>

        {/* Profile Information */}
        <View style={styles.infoContainer}>
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

          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]} 
            onPress={handleSubmit}
          >
            <Icon name="edit" size={18} color="white" />
            <Text style={styles.editButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: "white",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  infoContainer: {
    padding: 20,
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: { fontWeight: "bold" },
  infoValue: {},
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    marginLeft: 5,
  },
});
