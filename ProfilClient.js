import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Modal, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ProfilClient = ({ navigation }) => {  // Ajout de navigation dans les props
  const [profile, setProfile] = useState({
    companyName: '',
    companyDescription: '',
    clientNeeds: '',
    rating: 0
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const openEditProfileModal = () => {
    setEditedProfile({ ...profile });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveProfile = () => {
    setProfile({ ...editedProfile });
    setModalVisible(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={24}
          color={i <= rating ? '#FFD700' : '#ccc'}
          onPress={() => {
            setEditedProfile({...editedProfile, rating: i});
          }}
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec bouton de retour et titre */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0F2573" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>👤 Client Profile</Text>
        <View style={styles.headerSpacer} /> {/* Pour centrer le titre */}
      </View>

      {/* Client Information Card */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        
        {/* Photo de profil centrée avec option de modification */}
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholder}>
              <MaterialIcons name="add-a-photo" size={40} color="#5E548E" />
            </TouchableOpacity>
          )}
          
          {/* Évaluation par étoiles */}
          <View style={styles.ratingContainer}>
            {renderStars(profile.rating)}
          </View>
        </View>

        {/* Champs de saisie */}
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={profile.companyName}
              placeholder="Not specified"
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Company Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.companyDescription}
              placeholder="Not specified"
              multiline
              numberOfLines={5}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Client Needs</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.clientNeeds}
              placeholder="Not specified"
              multiline
              numberOfLines={5}
              editable={false}
            />
          </View>
        </View>

        {/* Bouton en bas de la carte */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={openEditProfileModal}
            style={styles.editButton}
            labelStyle={styles.buttonLabel}
          >
            {profile.companyName ? 'Modify Profile' : 'Create Profile'}
          </Button>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{profile.companyName ? 'Edit Profile' : 'Create Profile'}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.companyName}
                onChangeText={(text) => setEditedProfile({...editedProfile, companyName: text})}
                placeholder="Enter your company name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Company Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.companyDescription}
                onChangeText={(text) => setEditedProfile({...editedProfile, companyDescription: text})}
                placeholder="Enter a description of your company"
                multiline
                numberOfLines={5}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Needs</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.clientNeeds}
                onChangeText={(text) => setEditedProfile({...editedProfile, clientNeeds: text})}
                placeholder="Enter your needs"
                multiline
                numberOfLines={5}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button 
              mode="outlined" 
              onPress={closeModal}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonLabel}
              color="#041D56"
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={saveProfile}
              style={styles.saveButton}
              labelStyle={styles.buttonLabel}
            >
              Save
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 24, // Même largeur que le bouton de retour pour centrer le titre
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F2573',
    textAlign: 'center',
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#5E548E',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  formContainer: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editButton: {
    borderRadius: 20,
    backgroundColor: '#0F2573',
    width: '60%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  modalContent: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    marginRight: 10,
    borderColor: '#0F2573',
  },
  cancelButtonLabel: {
    color: '#041D56',
  },
  saveButton: {
    backgroundColor: '#0F2573',
  },
  buttonLabel: {
    color: 'white',
  },
});

export default ProfilClient;