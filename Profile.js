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
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import api from "./api"; // Your Axios instance
import { AuthContext } from "./contexts/AuthContext";

export default function Profile({ navigation }) {
  const { user, login, logout } = useContext(AuthContext);
  const token = user?.token;
  const userData = user?.user;
  const userId = userData?._id;

  const SERVER_URL = "http://localhost:5000/";

  const [gender, setGender] = useState(userData?.gender || "");
  const [category, setCategory] = useState(userData?.category || "");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    userData?.profileImage
      ? SERVER_URL + userData.profileImage.replace(/\\/g, "/")
      : null
  );

  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    age: userData?.age ? String(userData.age) : "",
    height: userData?.height ? String(userData.height) : "",
    birthday: userData?.birthday ? userData.birthday.slice(0, 10) : "",
  });

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

        setProfileImage({
          uri: imageUri,
          fileName: asset.fileName || "profile.jpg",
          type: asset.type || "image/jpeg",
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.height ||
      !formData.birthday ||
      !gender ||
      !category
    ) {
      showToast("error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("gender", gender);
      data.append("age", Number(formData.age));
      data.append("height", Number(formData.height));
      data.append("birthday", formData.birthday);
      data.append("category", category);

      if (profileImage && typeof profileImage === "object") {
        data.append("profileImage", {
          uri: profileImage.uri,
          name: profileImage.fileName,
          type: profileImage.type,
        });
      }

      const response = await api.put(`/users/profile/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
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
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={selectImage} style={styles.imageWrapper}>
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
        </View>

        {/* Form Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Age"
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Height (cm)"
              keyboardType="numeric"
              value={formData.height}
              onChangeText={(text) =>
                setFormData({ ...formData, height: text })
              }
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Birthday (YYYY-MM-DD)"
            value={formData.birthday}
            onChangeText={(text) =>
              setFormData({ ...formData, birthday: text })
            }
          />
        </View>

        {/* Save Button */}
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
      </ScrollView>
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
  profileContainer: { alignItems: "center", marginBottom: 20 },
  imageWrapper: { position: "relative" },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#6A0DAD",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#6A0DAD",
    borderRadius: 15,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  saveButton: {
    backgroundColor: "#6A0DAD",
    padding: 16,
    borderRadius: 28,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
