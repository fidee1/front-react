import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar // Import StatusBar
  // SafeAreaView n'est plus utilisé comme conteneur principal ici
} from 'react-native';
// Import Ionicons
import { Ionicons } from '@expo/vector-icons';
// Assurez-vous que @expo/vector-icons est installé: expo install @expo/vector-icons

// Pour le sélecteur de date, vous pourriez utiliser @react-native-community/datetimepicker
// import DateTimePicker from '@react-native-community/datetimepicker';
// Pour le sélecteur de catégorie, vous pourriez utiliser @react-native-picker/picker
// import { Picker } from '@react-native-picker/picker';

// Le composant reçoit maintenant la prop 'navigation' de React Navigation
const ListOfOffers = ({ navigation }) => {
  const [maxBudget, setMaxBudget] = useState('');
  const [deadline, setDeadline] = useState(null); // Ou new Date()
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Oldest First');

  // Données factices pour la liste des projets
  const projects = [
    {
      id: 1,
      titre: 'application éducatif',
      Skills: 'laravel,flutter',
      budget: '700 TND',
      deadline: '1 janv. 1970',
      status: 'Apply',
    },
    {
      id: 2,
      titre: 'Développement d\'une application mobile',
      Skills: 'symphony,react native',
      budget: '2000 TND',
      deadline: '4 mai 2025',
      status: 'Already Applied',
    },
    // Ajoutez d'autres projets ici si nécessaire
  ];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === 'ios');
    setDeadline(currentDate);
  };

  const renderProjectCard = (project) => (
    <View key={project.id} style={styles.card}>
      <Text style={styles.cardTitle}>{project.titre}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Skills:</Text>
        <Text style={styles.cardValueChip}>{project.Skills}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Budget:</Text>
        <Text style={styles.cardValue}>{project.budget}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Deadline:</Text>
        <Text style={styles.cardValue}>{project.deadline}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.actionButton,
          project.status === 'Already Applied'
            ? styles.appliedButton
            : styles.applyButton,
        ]}
        disabled={project.status === 'Already Applied'}
      >
        <Text style={styles.actionButtonText}>{project.status}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // Utilisation d'une View standard comme conteneur principal
    <View style={styles.screenContainer}>
      {/* Configuration de la barre de statut pour être au-dessus */}
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} // Icônes sombres sur iOS (fond clair), claires sur Android (fond bleu)
        backgroundColor="#0F2573" // Garde le fond bleu pour Android pour la continuité visuelle demandée initialement
        // translucent={false} // Assure que l'entête ne va pas derrière
      />
      {/* En-tête avec bouton icône */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Projects</Text>
      </View>

      {/* Contenu scrollable */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Budget (TD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter max budget"
            keyboardType="numeric"
            value={maxBudget}
            onChangeText={setMaxBudget}
          />

          <Text style={styles.filterLabel}>Deadline Before</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={deadline ? styles.dateText : styles.placeholderText}>
              {deadline ? deadline.toLocaleDateString('fr-FR') : 'jj/mm/aaaa'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.filterLabel}>Skills</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerText}>{selectedCategory}</Text>
          </View>

          <Text style={styles.filterLabel}>Sort by Deadline</Text>
          <View style={styles.sortButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'Oldest First' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('Oldest First')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'Oldest First' && styles.sortButtonTextActive,
                ]}
              >
                Oldest First
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'Newest First' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('Newest First')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'Newest First' && styles.sortButtonTextActive,
                ]}
              >
                Newest First
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          {projects.map(renderProjectCard)}
        </View>

        <Text style={styles.footer}>© 2025</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { // Conteneur principal standard View
    flex: 1,
    backgroundColor: '#f0f2f5', // Fond général de l'écran (pour le contenu scrollable)
    // Le paddingTop pour Android est géré par la StatusBar non-translucide
    // ou pourrait être ajouté ici si StatusBar est translucide.
  },
  // safeArea n'est plus utilisé
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2573',
    paddingVertical: 12,
    paddingHorizontal: 15,
    height:70,
    paddingTop: Platform.OS === 'ios' ? (StatusBar.currentHeight || 0) + 12 : 12,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'left',
  },
  contentContainer: {
    // Le fond est déjà défini dans screenContainer, mais on peut le spécifier ici si besoin
    // backgroundColor: '#f0f2f5',
    paddingHorizontal: 15,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
    justifyContent: 'center',
    minHeight: 40,
  },
  placeholderText: {
    color: '#adb5bd',
  },
  dateText: {
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pickerText: {
    fontSize: 14,
    color: '#000',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  sortButtonActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  sortButtonText: {
    color: '#007bff',
    fontSize: 14,
  },
  sortButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
    marginRight: 5,
    minWidth: 70,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  cardValueChip: {
    fontSize: 12,
    color: '#007bff',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  applyButton: {
    backgroundColor: '#e7f3ff',
    borderColor: '#007bff',
    borderWidth: 1,
  },
  appliedButton: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default ListOfOffers;

