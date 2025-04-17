import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Badge } from 'react-native-paper';  // Badge from react-native-paper

const MyProject = () => {  // Nom de l'interface modifié ici
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Fetch projects data from the API
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'orange';
      case 'Completed':
        return 'green';
      case 'Pending':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const viewDetails = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Projects</Text>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text style={styles.clientName}>{item.client_name}</Text>
            <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status}
            </Badge>
            <TouchableOpacity onPress={() => viewDetails(item)} style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for project details */}
      {selectedProject && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Project Details</Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Title: </Text>{selectedProject.title}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Description: </Text>{selectedProject.description}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Status: </Text>{selectedProject.status}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.bold}>Client: </Text>{selectedProject.client_name}
            </Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  projectCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  viewButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default MyProject;  // export du composant avec le nom "MyProject"
