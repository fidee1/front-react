import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddProject = () => {
  const navigation = useNavigation();
  
  // États pour les champs du formulaire
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState('');
  
  // Validation des champs
  const [errors, setErrors] = useState({});
  
  // Fonction pour valider le formulaire
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    
    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
      isValid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!budget.trim()) {
      newErrors.budget = 'Budget is required';
      isValid = false;
    } else if (isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
      isValid = false;
    }
    
    if (!deadline.trim()) {
      newErrors.deadline = 'Deadline is required';
      isValid = false;
    }
    
    if (!skills.trim()) {
      newErrors.skills = 'Required skills are required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = () => {
    if (validateForm()) {
      // Ici, vous feriez normalement un appel API pour créer le projet
      // Pour l'instant, nous allons simplement afficher une alerte de succès
      
      const projectData = {
        name: projectName,
        description,
        budget: parseFloat(budget),
        deadline,
        skills,
        status: 'pending'
      };
      
      console.log('Submitting project:', projectData);
      
      Alert.alert(
        'Success',
        'Project created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };
  
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
          <Text style={styles.headerText}>Add New Project</Text>
        </View>
        
        <ScrollView style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              style={[styles.input, errors.projectName ? styles.inputError : null]}
              placeholder="Enter project name"
              value={projectName}
              onChangeText={setProjectName}
            />
            {errors.projectName && <Text style={styles.errorText}>{errors.projectName}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
              placeholder="Describe your project in detail"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget (TND)</Text>
            <TextInput
              style={[styles.input, errors.budget ? styles.inputError : null]}
              placeholder="Enter your budget"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />
            {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline</Text>
            <TextInput
              style={[styles.input, errors.deadline ? styles.inputError : null]}
              placeholder="YYYY-MM-DD"
              value={deadline}
              onChangeText={setDeadline}
            />
            {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Skills</Text>
            <TextInput
              style={[styles.input, errors.skills ? styles.inputError : null]}
              placeholder="e.g. React Native, PHP, Design"
              value={skills}
              onChangeText={setSkills}
            />
            {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F2573',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    backgroundColor: '#0F2573',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#266CA9',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#041D56',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ADE1FB',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#266CA9',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProject;
