import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform, // Import Platform for potential OS-specific adjustments
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios

// --- Configuration ---
const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API base URL

// --- Authentication Hook Placeholder ---
// In a real app, this would come from Context, Redux, Zustand, or AsyncStorage
const useAuth = () => {
  // Replace with actual authentication state logic
  const [token, setToken] = useState('YOUR_DUMMY_TOKEN'); // Replace with real token
  const [appliedProjects, setAppliedProjects] = useState([]);

  const fetchAppliedProjects = useCallback(async (authToken) => {
    if (!authToken) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/my-applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const projectIds = res.data.map(app => app.project_id);
      setAppliedProjects(projectIds);
    } catch (error) {
      console.error('Failed to load applied projects:', error);
      // Handle error appropriately in UI if needed
    }
  }, []);

  const addAppliedProject = (projectId) => {
    setAppliedProjects(prev => [...new Set([...prev, projectId])]);
  };

  // Fetch applied projects when the token changes (e.g., on login)
  useEffect(() => {
    fetchAppliedProjects(token);
  }, [token, fetchAppliedProjects]);

  return { token, appliedProjects, addAppliedProject, fetchAppliedProjects };
};

// --- Main Screen Component ---
const AvailableProjectsScreen = () => {
  const { token, appliedProjects, addAppliedProject } = useAuth();

  // State variables
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({ maxBudget: '', deadline: '', category: '' });
  const [sortAsc, setSortAsc] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'

  // --- Data Fetching ---
  const fetchProjects = useCallback(async () => {
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const openProjects = res.data.filter(project => project.statut === 'open');

      setOffers(openProjects.map(project => ({
        ...project,
        // Ensure date_limite is a Date object for proper comparison/sorting
        date_limite: project.date_limite ? new Date(project.date_limite) : null,
      })));

      // Extract unique categories
      setCategories([...new Set(openProjects.map(p => p.categorie).filter(Boolean))]);

    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please check your connection or API endpoint.');
      if (err.response) {
        console.error('API Error Response:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Fetch projects when the component mounts or token changes

  // --- Filtering and Sorting Logic ---
  const filteredOffers = useMemo(() => {
    let result = offers.filter(offer => {
      const matchesBudget = !filters.maxBudget || !offer.budget || parseFloat(offer.budget) <= parseFloat(filters.maxBudget);
      
      let matchesDeadline = true;
      if (filters.deadline && offer.date_limite) {
          try {
              // Basic YYYY-MM-DD validation
              if (/^\d{4}-\d{2}-\d{2}$/.test(filters.deadline)) {
                  const filterDate = new Date(filters.deadline);
                  // Set filterDate to the end of the day for inclusive comparison
                  filterDate.setHours(23, 59, 59, 999);
                  matchesDeadline = offer.date_limite <= filterDate;
              } else {
                  // Invalid date format entered, ignore filter or show warning
                  matchesDeadline = true; // Or set to false if strict validation needed
              }
          } catch (e) {
              matchesDeadline = true; // Ignore invalid date format
          }
      }

      const matchesCategory = !filters.category || offer.categorie === filters.category;
      return matchesBudget && matchesDeadline && matchesCategory;
    });

    result.sort((a, b) => {
      const dateA = a.date_limite || 0; // Handle null dates
      const dateB = b.date_limite || 0;
      if (!dateA && !dateB) return 0;
      if (!dateA) return sortAsc ? 1 : -1; // Null dates go last when ascending
      if (!dateB) return sortAsc ? -1 : 1; // Null dates go last when ascending
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [offers, filters, sortAsc]);

  // --- Event Handlers ---
  const handleApply = (projectId) => {
    setSelectedProjectId(projectId);
    setMotivation('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjectId(null);
    setMotivation('');
  };

  const displayAlert = (message, type = 'success') => {
      setAlertMessage(message);
      setAlertType(type);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
  }

  const handleSubmitApplication = async () => {
    if (!motivation.trim()) {
      Alert.alert('Motivation Required', 'Please enter your motivation.');
      return;
    }
    if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
    }

    setSubmitting(true);
    setError(null); // Clear previous errors

    try {
      await axios.post(`${API_BASE_URL}/applications`, {
        project_id: selectedProjectId,
        motivation: motivation,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      addAppliedProject(selectedProjectId); // Update local state via auth context/store
      handleCloseModal();
      displayAlert('Successfully applied to the project!');

    } catch (err) {
      console.error('Failed to apply:', err);
      let errorMessage = 'Error submitting application.';
      if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
      } else if (err.message) {
          errorMessage = err.message;
      }
      // Display error in modal or as an alert
      Alert.alert('Submission Error', errorMessage);
      // Optionally display error using the alert banner
      // displayAlert(errorMessage, 'error'); 
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return 'N/A';
    try {
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  // --- Render Functions ---
  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      {/* Budget Input */}
      <View style={styles.filterItem}>
        <Text style={styles.label}>Budget Max (TND)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1000"
          keyboardType="numeric"
          value={filters.maxBudget}
          onChangeText={(text) => setFilters({ ...filters, maxBudget: text.replace(/[^0-9]/g, '') })}
        />
      </View>
      {/* Deadline Picker - Basic Text Input */} 
      <View style={styles.filterItem}>
        <Text style={styles.label}>Deadline Before</Text>
        {/* Consider using a dedicated DatePicker library for better UX */}
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={filters.deadline}
          onChangeText={(text) => setFilters({ ...filters, deadline: text })}
          maxLength={10} // Basic format enforcement
        />
      </View>
      {/* Category Picker */}
      <View style={styles.filterItem}>
        <Text style={styles.label}>Category</Text>
        {/* Wrap Picker in a View for consistent styling if needed */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filters.category}
            style={styles.picker}
            onValueChange={(itemValue) => setFilters({ ...filters, category: itemValue })}
            prompt="Select Category"
          >
            <Picker.Item label="All Categories" value="" />
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>
      {/* Sort Button */}
      <View style={styles.filterItem}>
         <Text style={styles.label}>Sort by Deadline</Text>
         <TouchableOpacity style={styles.sortButton} onPress={() => setSortAsc(!sortAsc)}>
            <Text style={styles.sortButtonText}>{sortAsc ? 'Oldest First' : 'Newest First'}</Text>
         </TouchableOpacity>
      </View>
    </View>
  );

  const renderOfferItem = ({ item }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>{item.titre || 'No Title'}</Text>
      <View style={styles.offerRow}>
         <Text style={styles.offerLabel}>Category:</Text>
         <Text style={styles.categoryBadge}>{item.categorie ?? 'N/A'}</Text>
      </View>
      <View style={styles.offerRow}>
         <Text style={styles.offerLabel}>Budget:</Text>
         <Text>{item.budget ? `${item.budget} TND` : 'N/A'}</Text>
      </View>
       <View style={styles.offerRow}>
         <Text style={styles.offerLabel}>Deadline:</Text>
         <Text>{formatDate(item.date_limite)}</Text>
      </View>

      {appliedProjects.includes(item.id) ? (
        <View style={styles.appliedContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#28a745" />
            <Text style={styles.appliedBadge}>Already Applied</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(item.id)}>
          <Ionicons name="paper-plane-outline" size={16} color="#fff" />
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Projects</Text>
      </View>

      {/* Alert Message Banner */} 
      {showAlert && (
        <View style={[styles.alertBanner, alertType === 'success' ? styles.alertSuccess : styles.alertError]}>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <TouchableOpacity onPress={() => setShowAlert(false)} style={styles.alertCloseButton}>
              <Ionicons name="close-circle" size={20} color={alertType === 'success' ? '#155724' : '#721c24'} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ListHeaderComponent={renderFilterBar}
        data={filteredOffers}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0F2573" />
            ) : (
              <Text style={styles.emptyListText}>
                {error ? error : 'No projects match your filters.'}
              </Text>
            )}
          </View>
        )}
        refreshing={loading} // Add pull-to-refresh indicator
        onRefresh={fetchProjects} // Add pull-to-refresh functionality
      />

      {/* Motivation Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal} // Allows closing with back button on Android
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPressOut={handleCloseModal} // Close modal on overlay touch
        >
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}> 
            <Text style={styles.modalTitle}>Motivation</Text>
            <TextInput
              style={styles.motivationInput}
              placeholder="Why are you applying for this project? (Be specific and concise)"
              multiline
              value={motivation}
              onChangeText={setMotivation}
              autoFocus={true}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCloseModal} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmitApplication} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" size="small"/> : <Text style={styles.submitButtonText}>Send Application</Text>}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles --- (Refined for React Native)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F2573', // Match header color for top area
  },
  header: {
    backgroundColor: '#0F2573',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 15, // Adjust for Android status bar
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterBar: {
    padding: 15,
    backgroundColor: '#f8f9fa', // Lighter background for filters
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterItem: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#343a40',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Adjust padding for platform
    backgroundColor: '#fff',
    fontSize: 14,
  },
  pickerContainer: {
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 5,
      backgroundColor: '#fff',
      overflow: 'hidden', // Helps with border radius on Android
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 50, // iOS height is intrinsic
    width: '100%',
    // No border here, applied to container
  },
   sortButton: {
      backgroundColor: '#5bc0de',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      alignItems: 'center',
   },
   sortButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
   },
  listContainer: {
    flex: 1,
    backgroundColor: '#F4F7FC', // Main content background
  },
  offerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F2573',
    marginBottom: 10,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  offerLabel: {
    fontWeight: '500',
    marginRight: 8,
    color: '#495057',
    fontSize: 14,
  },
  categoryBadge: {
    backgroundColor: '#e0f3ff', // Lighter info badge
    color: '#0c5460', // Darker info text
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    overflow: 'hidden',
  },
  appliedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#e9f7ec', // Success light background
      borderRadius: 5,
      alignSelf: 'flex-start', // Prevent stretching full width
  },
  appliedBadge: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  applyButton: {
    backgroundColor: '#0F2573',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 12,
  },
  applyButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyListText: {
      fontSize: 16,
      color: '#6c757d',
      textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Add padding to prevent modal touching edges
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0F2573',
  },
  motivationInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa', // Lighter cancel button
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  cancelButtonText: {
      color: '#495057',
      fontWeight: '500',
      fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0F2573',
    marginLeft: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Alert Banner Styles
  alertBanner: {
    padding: 12,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  alertError: {
     backgroundColor: '#f8d7da',
     borderColor: '#f5c6cb',
  },
  alertText: {
    flex: 1, // Allow text to wrap
    marginRight: 10,
    color: '#155724', // Default success text color
    // Error text color can be set dynamically or via separate style
  },
  alertCloseButton: {
      padding: 5,
  },
});

export default AvailableProjectsScreen;

