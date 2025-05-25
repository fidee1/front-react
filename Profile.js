import React, { useEffect, useState } from "react";
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
import { Button, Badge } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { update_profile } from "./api";

const Profile = () => {
  const navigation = useNavigation();
  const authState = useSelector((state) => state.auth);
  const user = authState?.user || {};
  console.log("user ", user);

  const [profileImage, setProfileImage] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [profile, setProfile] = useState(user);

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [skillsInput, setSkillsInput] = React.useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          // Simulate delay
          setTimeout(() => {
            setProfile(JSON.parse(storedUser));
            console.log("profile ", JSON.parse(storedUser));
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // const updatedUser = { ...user, profileImageUri: result.assets[0].uri };
      // dispatch(setUser(updatedUser));
      // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfileData = {
        ...user,
        ...editedProfile,
        competences: skillsInput,
        // profileImageUri: profileImage, // Persist profile image if needed
      };

      const res = await update_profile(updatedProfileData);
      console.log("api update profile ", res);

      //  dispatch(setUser(res.user));
      await AsyncStorage.setItem("user", JSON.stringify(res));
      setProfile(res.user);

      setModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error("Save profile error:", error);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <MaterialIcons
          key={i}
          name={i < rating ? "star" : "star-border"}
          size={24}
          color={i < rating ? "#FFD700" : "#ccc"}
        />
      ));
  };

  const skillsList = skillsInput
    .split(",")
    .filter((skill) => skill.trim() !== "");

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
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.profileCard}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
            >
              <Text>✏ Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : user.profileImageUri ? (
                  <Image
                    source={{ uri: user.profileImageUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons name="person" size={40} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.name}>
                {user.name} {user.lastName}
              </Text>
              <Text style={styles.profession}>{user.profile?.titre}</Text>
              <View style={styles.rating}>
                {renderStars(editedProfile.note)}
              </View>
              <Badge style={styles.rateBadge}>
                💰 {editedProfile.tarif} TND/h
              </Badge>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧠 Skills</Text>
              <View style={styles.skillsContainer}>
                {skillsList.map((skill, index) => (
                  <Badge key={index} style={styles.skillBadge}>
                    {skill.trim()}
                  </Badge>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💼 Experience</Text>
              <Text style={styles.sectionContent}>
                {editedProfile.profile?.experience || "No experience added"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🖼 Portfolio</Text>
              <Text style={styles.sectionContent}>
                {editedProfile.portfolio || "No portfolio added"}
              </Text>
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.label}>Profession</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.profile?.titre}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, titre: text })
                }
                placeholder="Your profession"
              />

              <Text style={styles.label}>Hourly Rate (TND)</Text>
               <TextInput
                style={styles.input}
                value={editedProfile.profile?.tarif}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, titre: text })
                }
                placeholder="Hourly Rate"
              />

              <Text style={styles.label}>Skills (comma separated)</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={skillsInput}
                onChangeText={setSkillsInput}
                multiline
                placeholder="React Native, JavaScript, etc."
              />

              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={editedProfile.profile?.experience}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, experience: text })
                }
                multiline
                placeholder="Describe your experience"
              />

              <Text style={styles.label}>Portfolio URL</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.profile?.portfolio}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, portfolio: text })
                }
                placeholder="Your portfolio link"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.saveButton}
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
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  editButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0F2573",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  profession: {
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  rating: {
    flexDirection: "row",
    marginBottom: 10,
  },
  rateBadge: {
    backgroundColor: "#0F2573",
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0F2573",
  },
  sectionContent: {
    color: "#333",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  skillBadge: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: "#0F2573",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    padding: 16,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: "#0F2573",
  },
});

export default Profile;
