import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { Button, Badge } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const Profile = ({ navigation, route }) => {
  const isExternalView = route.params?.isExternalView || false;
  const [freelance, setFreelance] = useState({
    id: 'freelance456',
    user_id: '',
    titre: 'Senior React Native Developer',
    competences: 'React Native, JavaScript, Firebase, Redux',
    experience: '5 years of experience in mobile development',
    portfolio: 'https://github.com/example',
    note: 4,
    user: {
      name: 'John',
      lastName: 'Doe'
    }
  });

  const [editedProfile, setEditedProfile] = useState({ ...freelance });
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulation de chargement des données
        setTimeout(() => {
          setFreelance({
            id: 'freelance456',
            user_id: 'user789',
            titre: 'Senior React Native Developer',
            competences: 'React Native, JavaScript, Firebase, Redux',
            experience: '5 years of experience in mobile development',
            portfolio: 'https://github.com/example',
            note: 4,
            user: {
              name: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+1 555-987-6543',
              location: 'Sfax, Tunisia'
            }
          });
          setEditedProfile({
            titre: 'Senior React Native Developer',
            competences: 'React Native, JavaScript, Firebase, Redux',
            experience: '5 years of experience in mobile development',
            portfolio: 'https://github.com/example',
            note: 4,
            user: {
              name: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+1 555-987-6543',
              location: 'Sfax, Tunisia'
            }
          });
          setSkillsInput('React Native, JavaScript, Firebase, Redux');
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile image');
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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      setTimeout(() => {
        const updatedProfile = {
          ...editedProfile,
          competences: skillsInput
        };
        setFreelance(updatedProfile);
        setModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    navigation.navigate('Inbox', { 
      recipientId: freelance.id,
      recipientName: `${freelance.user.name} ${freelance.user.lastName}`,
      isFreelancer: true
    });
  };

  const renderStars = (rating, editable = false) => {
    return Array(5).fill(0).map((_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={24}
        color={i < rating ? '#FFD700' : '#ccc'}
        onPress={editable ? () => {
          setEditedProfile({...editedProfile, note: i + 1});
        } : null}
      />
    ));
  };

  const skillsList = freelance.competences ? freelance.competences.split(',').map(skill => skill.trim()) : [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0F2573" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>👤 Freelancer Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.profileCard}>
        {!isExternalView && (
          <TouchableOpacity onPress={() => {
            setEditedProfile(freelance);
            setSkillsInput(freelance.competences);
            setModalVisible(true);
          }} style={styles.modifyButton}>
            <Text>✏ Modify Profile</Text>
          </TouchableOpacity>
        )}

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="add-a-photo" size={40} color="#5E548E" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.name}>
            {freelance.user.name} {freelance.user.lastName}
          </Text>
          <Text style={styles.title}>{freelance.titre}</Text>
          
          <Badge style={styles.rateBadge}>💰 {freelance.note} TND/h</Badge>
          
          <View style={styles.ratingContainer}>
            {renderStars(freelance.note)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 Skills</Text>
          <View style={styles.skillsContainer}>
            {skillsList.map((skill, index) => (
              <Badge key={index} style={styles.skillBadge}>
                {skill}
              </Badge>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Email</Text>
          <Text style={styles.fieldValue}>{freelance.user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Phone</Text>
          <Text style={styles.fieldValue}>{freelance.user.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location</Text>
          <Text style={styles.fieldValue}>{freelance.user.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Experience</Text>
          <Text style={styles.fieldValue}>{freelance.experience}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🖼 Portfolio</Text>
          <Text style={styles.fieldValue}>{freelance.portfolio}</Text>
        </View>

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
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.titre}
                onChangeText={(text) => setEditedProfile({...editedProfile, titre: text})}
                placeholder="Enter your title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rate (TND/h)</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.note.toString()}
                onChangeText={(text) => setEditedProfile({...editedProfile, note: parseInt(text) || 0})}
                placeholder="Enter your rate"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Skills (comma separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={skillsInput}
                onChangeText={setSkillsInput}
                placeholder="React Native, JavaScript, etc."
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.user.email}
                onChangeText={(text) => setEditedProfile({
                  ...editedProfile,
                  user: {...editedProfile.user, email: text}
                })}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.user.phone}
                onChangeText={(text) => setEditedProfile({
                  ...editedProfile,
                  user: {...editedProfile.user, phone: text}
                })}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.user.location}
                onChangeText={(text) => setEditedProfile({
                  ...editedProfile,
                  user: {...editedProfile.user, location: text}
                })}
                placeholder="Enter your location"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.experience}
                onChangeText={(text) => setEditedProfile({...editedProfile, experience: text})}
                placeholder="Describe your experience"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Portfolio</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.portfolio}
                onChangeText={(text) => setEditedProfile({...editedProfile, portfolio: text})}
                placeholder="Enter portfolio URL"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                {renderStars(editedProfile.note, true)}
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
              onPress={handleSaveProfile}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F2573',
    flex: 1,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  modifyButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F2573',
    marginTop: 10,
  },
  title: {
    color: '#5E548E',
    fontSize: 16,
    marginBottom: 5,
  },
  rateBadge: {
    backgroundColor: '#0F2573',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5E548E',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#0F2573',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatButton: {
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginTop: 10,
    paddingVertical: 6,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  cancelButton: {
    marginRight: 10,
    borderColor: '#0F2573',
  },
  cancelButtonLabel: {
    color: '#0F2573',
  },
  saveButton: {
    backgroundColor: '#0F2573',
    minWidth: 120,
  },
});

export default Profile;