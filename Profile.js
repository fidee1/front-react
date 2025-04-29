import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, Dimensions } from 'react-native';
import { Modal, TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [freelancer, setFreelancer] = useState({
    name: 'Sarah Lee',
    title: 'Full Stack Developer',
    photo: 'https://via.placeholder.com/150',
    rate: 35,
    skills: ['Vue.js', 'Laravel', 'Tailwind CSS', 'Docker'],
    experience: ['3 years at DevTech Solutions', 'Freelance projects on Upwork and Fiverr'],
    portfolio: [
      { title: 'E-commerce App', link: 'https://project1.example.com' },
      { title: 'Portfolio Website', link: 'https://project2.example.com' },
    ],
  });

  const [edited, setEdited] = useState({ ...freelancer });

  const openModal = () => {
    setEdited({ ...freelancer });
    setSkillsInput(freelancer.skills.join(', '));
    setVisible(true);
  };

  const saveChanges = () => {
    setFreelancer({
      ...edited,
      skills: skillsInput.split(',').map(s => s.trim()),
    });
    setVisible(false);
  };

  const handleInputChange = (field, value) => {
    setEdited(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEdited(prev => ({
        ...prev,
        photo: result.assets[0].uri
      }));
    }
  };

  const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Don't know how to open this URL: ${url}`);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>👤 Profile</Text>

      {/* Profile Card - Main container */}
      <ScrollView style={styles.fullScreenCard}>
        {/* Modify Button */}
        <TouchableOpacity style={styles.modifyBtn} onPress={openModal}>
          <Text style={styles.modifyBtnText}>✏️ Modify Profile</Text>
        </TouchableOpacity>

        {/* Profile Content */}
        <View style={styles.profileContent}>
          {/* Top Section with Photo and Basic Info */}
          <View style={styles.topSection}>
            <Image source={{ uri: freelancer.photo }} style={styles.profilePhoto} />
            <Text style={styles.name}>{freelancer.name}</Text>
            <Text style={styles.title}>{freelancer.title}</Text>
            <View style={styles.rateBadge}>
              <Text style={styles.rateBadgeText}>💰 {freelancer.rate} $/h</Text>
            </View>
          </View>

          {/* Bottom Section with Details */}
          <View style={styles.bottomSection}>
            {/* Skills Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧠 Skills</Text>
              <View style={styles.skillsContainer}>
                {freelancer.skills.map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Experience Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💼 Experience</Text>
              <View style={styles.list}>
                {freelancer.experience.map((exp, index) => (
                  <Text key={index} style={styles.listItem}>• {exp}</Text>
                ))}
              </View>
            </View>

            {/* Portfolio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🖼️ Portfolio</Text>
              <View style={styles.list}>
                {freelancer.portfolio.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => openLink(item.link)}>
                    <Text style={styles.listItem}>
                      <Text style={styles.portfolioTitle}>{item.title}</Text> - <Text style={styles.link}>View</Text>
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Modify Profile</Text>
        
        <TextInput
          label="Name"
          value={edited.name}
          onChangeText={(text) => handleInputChange('name', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Title"
          value={edited.title}
          onChangeText={(text) => handleInputChange('title', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Rate ($/h)"
          value={String(edited.rate)}
          onChangeText={(text) => handleInputChange('rate', text)}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        
        <TextInput
          label="Skills (comma-separated)"
          value={skillsInput}
          onChangeText={setSkillsInput}
          style={styles.input}
          mode="outlined"
        />
        
        <Button 
          mode="outlined" 
          onPress={pickImage}
          style={styles.imageButton}
        >
          Change Photo
        </Button>
        
        <View style={styles.modalButtons}>
          <Button 
            mode="contained" 
            onPress={saveChanges}
            style={styles.saveButton}
          >
            Save
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => setVisible(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    padding: 25,
  },
  pageTitle: {
    fontSize:16,
    fontWeight: 'bold',
    color: '#0F2573',
    marginBottom: 16,
    textAlign: 'center',
  },
  fullScreenCard: {
    backgroundColor: '#E1F0FF',
    borderRadius: 16,
    shadowColor: '#0F2573',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    flex: 1,
  },
  modifyBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0F2573',
  },
  modifyBtnText: {
    color: '#0F2573',
    fontSize: 14,
  },
  profileContent: {
    padding: 16,
    paddingTop: 50, // Space for the modify button
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomSection: {
    width: '100%',
  },
  profilePhoto: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    borderWidth: 3,
    borderColor: '#0F2573',
    marginBottom: 16,
  },
  name: {
    color: '#0F2573',
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    color: '#5E548E',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  rateBadge: {
    backgroundColor: '#0F2573',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  rateBadgeText: {
    color: 'white',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2573',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#D1E0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#0F2573',
    fontSize: 14,
  },
  list: {
    marginLeft: 8,
  },
  listItem: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  portfolioTitle: {
    fontWeight: 'bold',
  },
  link: {
    color: '#0F2573',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0F2573',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  imageButton: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#0F2573',
  },
  cancelButton: {
    marginLeft: 8,
  },
});

export default Profile;