import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, TouchableOpacity, Image, Alert } from 'react-native';
import { Button, Badge } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/registerActions'; // clearUser import kept for now
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const authState = useSelector((state) => state.auth);
  const user = authState?.user || {};
  const token = authState?.token;
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState({
    titre: '',
    competences: '',
    experience: '',
    portfolio: '',
    note: 0
  });
  const [skillsInput, setSkillsInput] = React.useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setEditedProfile({
          titre: userData.titre || '',
          competences: userData.competences || '',
          experience: userData.experience || '',
          portfolio: userData.portfolio || '',
          note: userData.note || 0
        });
        setSkillsInput(userData.competences || '');
        // if (userData.profileImageUri) setProfileImage(userData.profileImageUri); // Consider loading initial profile image
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile image');
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

      dispatch(setUser(updatedProfileData));
      await AsyncStorage.setItem('user', JSON.stringify(updatedProfileData));
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Save profile error:', error);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={24}
        color={i < rating ? '#FFD700' : '#ccc'}
      />
    ));
  };

  const skillsList = skillsInput.split(',').filter(skill => skill.trim() !== '');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#0F2573" />
        </TouchableOpacity>
        <Text style={styles.title}>👤 Profile</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for balance */} 
      </View>

      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text>✏ Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              user.profileImageUri ? (
                <Image source={{ uri: user.profileImageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons name="person" size={40} color="#fff" />
                </View>
              )
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{user.name} {user.lastName}</Text>
          <Text style={styles.profession}>{editedProfile.titre}</Text>
          <View style={styles.rating}>
            {renderStars(editedProfile.note)}
          </View>
          <Badge style={styles.rateBadge}>💰 {editedProfile.note} TND/h</Badge>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 Skills</Text>
          <View style={styles.skillsContainer}>
            {skillsList.map((skill, index) => (
              <Badge key={index} style={styles.skillBadge}>{skill.trim()}</Badge>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Experience</Text>
          <Text style={styles.sectionContent}>{editedProfile.experience || 'No experience added'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🖼 Portfolio</Text>
          <Text style={styles.sectionContent}>
            {editedProfile.portfolio || 'No portfolio added'}
          </Text>
        </View>
      </View>

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
              value={editedProfile.titre}
              onChangeText={(text) => setEditedProfile({...editedProfile, titre: text})}
              placeholder="Your profession"
            />

            <Text style={styles.label}>Hourly Rate (TND)</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.note.toString()}
              onChangeText={(text) => setEditedProfile({...editedProfile, note: Number(text) || 0})}
              keyboardType="numeric"
              placeholder="Your hourly rate"
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
              value={editedProfile.experience}
              onChangeText={(text) => setEditedProfile({...editedProfile, experience: text})}
              multiline
              placeholder="Describe your experience"
            />

            <Text style={styles.label}>Portfolio URL</Text>
            <TextInput
              style={styles.input}
              value={editedProfile.portfolio}
              onChangeText={(text) => setEditedProfile({...editedProfile, portfolio: text})}
              placeholder="Your portfolio link"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSaveProfile} style={styles.saveButton}>
              Save Changes
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  profileHeader: {
    alignItems: 'center',
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
    backgroundColor: '#0F2573',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  profession: {
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rateBadge: {
    backgroundColor: '#0F2573',
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0F2573',
  },
  sectionContent: {
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skillBadge: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#0F2573',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#0F2573',
  },
});

export default Profile;
