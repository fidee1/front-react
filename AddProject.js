import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { add_project } from "./services/project";

const initialProjectState = {
  titre: "",
  description: "",
  skills: [],
  budget: "",
  date_limite: "",
};

const AddProject = () => {
  const navigation = useNavigation();
  const [project, setProject] = useState(initialProjectState);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!project.titre.trim()) {
      newErrors.titre = "Project name is required";
      isValid = false;
    }

    if (!project.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!project.budget.trim()) {
      newErrors.budget = "Budget is required";
      isValid = false;
    } else if (isNaN(parseFloat(project.budget)) || parseFloat(project.budget) <= 0) {
      newErrors.budget = "Budget must be a positive number";
      isValid = false;
    }

    if (!project.date_limite.trim()) {
      newErrors.date_limite = "Deadline is required";
      isValid = false;
    }

    if (project.skills.length === 0) {
      newErrors.skills = "Required skills are required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Submitting project:", project);
      const res = await add_project(project)
      
      Alert.alert("Success", "Project created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
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
              style={[styles.input, errors.titre ? styles.inputError : null]}
              placeholder="Enter project name"
              value={project.titre}
              onChangeText={(text) => handleInputChange("titre", text)}
            />
            {errors.titre && (
              <Text style={styles.errorText}>{errors.titre}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description ? styles.inputError : null,
              ]}
              placeholder="Describe your project in detail"
              multiline
              numberOfLines={4}
              value={project.description}
              onChangeText={(text) => handleInputChange("description", text)}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Budget (TND)</Text>
            <TextInput
              style={[styles.input, errors.budget ? styles.inputError : null]}
              placeholder="Enter your budget"
              keyboardType="numeric"
              value={project.budget}
              onChangeText={(text) => handleInputChange("budget", text)}
            />
            {errors.budget && (
              <Text style={styles.errorText}>{errors.budget}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deadline</Text>
            <TextInput
              style={[
                styles.input,
                errors.date_limite ? styles.inputError : null,
              ]}
              placeholder="YYYY-MM-DD"
              value={project.date_limite}
              onChangeText={(text) => handleInputChange("date_limite", text)}
            />
            {errors.date_limite && (
              <Text style={styles.errorText}>{errors.date_limite}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Skills</Text>
            <TextInput
              style={[styles.input, errors.skills ? styles.inputError : null]}
              placeholder="e.g. React Native, PHP, Design"
              value={project.skills.join(", ")}
              onChangeText={(text) =>
                handleInputChange(
                  "skills",
                  text.split(",").map((skill) => skill.trim())
                )
              }
            />
            {errors.skills && (
              <Text style={styles.errorText}>{errors.skills}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
