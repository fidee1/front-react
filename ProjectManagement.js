import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const ProjectManagement = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        date: '2025-04-01',
        budget: 1500,
        status: 'in_progress',
        freelancer: 'John Doe',
        rating: null,
      },
      {
        id: 2,
        name: 'Mobile App UI',
        date: '2025-03-15',
        budget: 800,
        status: 'finished',
        freelancer: 'Jane Smith',
        rating: 4,
      },
      {
        id: 3,
        name: 'Logo Design',
        date: '2025-04-10',
        budget: 200,
        status: 'pending',
        freelancer: '',
        rating: null,
      },
    ];
    setProjects(mockProjects);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const deleteProject = (id) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setProjects(projects.filter((p) => p.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openRatingModal = (project) => {
    setSelectedProject(project);
    setTempRating(project.rating || 0);
    setRatingModalVisible(true);
  };

  const submitRating = () => {
    if (selectedProject) {
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, rating: tempRating };
        }
        return p;
      });
      setProjects(updatedProjects);
    }
    setRatingModalVisible(false);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending':
        return styles.statusPending;
      case 'in_progress':
        return styles.statusInProgress;
      case 'finished':
        return styles.statusFinished;
      default:
        return styles.statusDefault;
    }
  };

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectDate}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.projectDetails}>
        <Text style={styles.projectBudget}>${item.budget}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>
            {item.status === 'in_progress' ? 'In Progress' : 
             item.status === 'finished' ? 'Finished' : 'Pending'}
          </Text>
        </View>
      </View>
      
      {item.status !== 'pending' && (
        <Text style={styles.freelancerText}>Freelancer: {item.freelancer}</Text>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.viewButton]}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteProject(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        
        {item.status === 'finished' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.rateButton]}
            onPress={() => openRatingModal(item)}
          >
            <Text style={styles.buttonText}>
              {item.rating ? `${item.rating} ★` : 'Rate'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
          <Text style={styles.headerText}>Project Management</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#7D9FC7" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by project..."
              placeholderTextColor="#7D9FC7"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          
          <View style={styles.filterSelect}>
            <TextInput
              style={styles.selectInput}
              value={statusFilter}
              onChangeText={setStatusFilter}
              placeholder="All Status"
              placeholderTextColor="#7D9FC7"
            />
            <MaterialIcons name="arrow-drop-down" size={20} color="#7D9FC7" />
          </View>
        </View>
        
        {filteredProjects.length > 0 ? (
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={50} color="#266CA9" />
            <Text style={styles.emptyText}>No projects found</Text>
          </View>
        )}
        
        {/* Rating Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={ratingModalVisible}
          onRequestClose={() => setRatingModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Rate Freelancer</Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={styles.ratingText}>
                  How would you rate {selectedProject?.freelancer}?
                </Text>
                
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity 
                      key={star} 
                      onPress={() => setTempRating(star)}
                    >
                      <MaterialIcons 
                        name={star <= tempRating ? "star" : "star-border"} 
                        size={40} 
                        color="#266CA9" 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.closeButton]}
                  onPress={() => setRatingModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, styles.closeButtonText]}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={submitRating}
                >
                  <Text style={[styles.modalButtonText, styles.submitButtonText]}>Submit</Text>
                </TouchableOpacity>
              </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#F0F8FF',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: '#041D56',
    fontSize: 10,
  },
  filterSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    elevation: 2,
  },
  selectInput: {
    flex: 1,
    color: '#041D56',
    fontSize: 10,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#ADE1FB',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#266CA9',
    flex: 1,
  },
  projectDate: {
    fontSize: 13,
    color: '#266CA9',
    textAlign: 'right',
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectBudget: {
    fontSize: 16,
    color: '#266CA9',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusPending: {
    backgroundColor: '#E1F0FF',
    color: '#266CA9',
    borderWidth: 1,
    borderColor: '#ADE1FB',
  },
  statusInProgress: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  statusFinished: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
    borderWidth: 1,
    borderColor: '#28A745',
  },
  freelancerText: {
    color: '#266CA9',
    marginBottom: 10,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 1,
  },
  viewButton: {
    backgroundColor: '#266CA9',
  },
  deleteButton: {
    backgroundColor: '#041D56',
  },
  rateButton: {
    backgroundColor: '#0F2573',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#266CA9',
    fontSize: 16,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#E1F0FF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ADE1FB',
  },
  modalTitle: {
    color: '#041D56',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  ratingText: {
    color: '#041D56',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ADE1FB',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  closeButton: {
    borderWidth: 1,
    borderColor: '#266CA9',
  },
  submitButton: {
    backgroundColor: '#0F2573',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  closeButtonText: {
    color: '#266CA9',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default ProjectManagement;