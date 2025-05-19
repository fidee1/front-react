import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFreelancers } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Freelancers = () => {
  const navigation = useNavigation();
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  // Fonction pour charger les freelancers depuis l'API
  const loadFreelancers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test avec des données statiques
      const testData = [
        {
          id: 1,
          name: "John",
          lastName: "Doe",
          title: "Développeur React",
          hourlyRate: 50
        },
        {
          id: 2,
          name: "Jane",
          lastName: "Smith",
          title: "Designer UI/UX",
          hourlyRate: 45
        },
        {
          id: 3,
          name: "Alex",
          lastName: "Martin",
          title: "Développeur Backend",
          hourlyRate: 55
        },
        {
          id: 4,
          name: "Sarah",
          lastName: "Johnson",
          title: "Intégrateur Web",
          hourlyRate: 40
        }
      ];

      // Utiliser ces données de test
      setFreelancers(testData);
      setFilteredFreelancers(testData);
      setLoading(false);
      return; // Arrêter l'exécution ici pour ne pas appeler l'API
      
      // Vérification du token avant l'appel API
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('Aucun token d\'authentification trouvé');
        setError('Vous devez être connecté pour voir les freelancers. Veuillez vous reconnecter.');
        Alert.alert('Erreur d\'authentification', 'Veuillez vous reconnecter pour accéder à cette fonctionnalité.');
        return;
      }
      
      console.log('Appel API getFreelancers avec token:', token.substring(0, 15) + '...');
      const data = await getFreelancers();
      console.log('Données reçues:', JSON.stringify(data));
      
      // Vérification si des données ont été reçues
      if (!data) {
        console.log('Aucune donnée reçue de l\'API');
        setFreelancers([]);
        setFilteredFreelancers([]);
        return;
      }
      
      // Gestion des différentes structures possibles de réponse API
      let profilesData = data;
      
      // Si la réponse est un objet avec une propriété data (format Laravel API Resource)
      if (!Array.isArray(data) && data.data) {
        console.log('Format détecté: Laravel API Resource avec data wrapper');
        profilesData = data.data;
      }
      
      // Si la réponse est un objet avec une autre structure
      if (!Array.isArray(profilesData)) {
        console.log('Format non reconnu, conversion en tableau');
        profilesData = [profilesData];
      }
      
      console.log('Données à traiter:', JSON.stringify(profilesData));
      
      if (profilesData.length === 0) {
        console.log('Aucun freelancer trouvé dans la réponse API');
        setFreelancers([]);
        setFilteredFreelancers([]);
        return;
      }
      
      console.log('Premier élément de données:', JSON.stringify(profilesData[0]));
      
      // Transformation des données avec une gestion très flexible des structures
      const formattedData = profilesData.map(profile => {
        // Gestion de différentes structures possibles
        const user = profile.user || profile || {};
        
        // Extraction du nom avec gestion de différentes structures
        const name = user.name || user.nom || profile.name || profile.nom || '';
        const lastName = user.lastName || user.last_name || user.nom_famille || profile.lastName || profile.last_name || '';
        
        // Extraction du titre avec gestion de différentes structures
        const title = profile.titre || profile.title || user.titre || user.title || 'Freelancer';
        
        // Extraction du tarif avec gestion de différentes structures
        const hourlyRate = profile.tarif || profile.hourly_rate || profile.taux_horaire || 
                          user.tarif || user.hourly_rate || user.taux_horaire || 0;
        
        return {
          id: (profile.id || user.id || '').toString(),
          name: name,
          lastName: lastName,
          title: title,
          hourlyRate: hourlyRate
        };
      });
      
      console.log('Données formatées:', JSON.stringify(formattedData));
      
      setFreelancers(formattedData);
      setFilteredFreelancers(formattedData);
    } catch (err) {
      console.error('Erreur lors du chargement des freelancers:', err);
      
      // Gestion spécifique des erreurs d'authentification
      if (err.message === 'Unauthenticated.' || err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        Alert.alert('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.');
        // Suppression du token invalide
        AsyncStorage.removeItem('accessToken');
      } else {
        setError('Impossible de charger les freelancers: ' + (err.message || 'Erreur inconnue'));
        Alert.alert('Erreur', 'Impossible de charger les freelancers: ' + (err.message || 'Erreur inconnue'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les freelancers au montage du composant
  useEffect(() => {
    loadFreelancers();
  }, []);

  // Fonction pour filtrer les freelancers
  const applyFilters = () => {
    let filtered = [...freelancers];
    
    // Filtrer par compétences (sur le titre pour cette version simplifiée)
    if (skillFilter) {
      filtered = filtered.filter(freelancer => 
        freelancer.title.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    // Filtrer par tarif minimum
    if (minRate) {
      filtered = filtered.filter(freelancer => 
        freelancer.hourlyRate >= parseInt(minRate)
      );
    }
    
    // Filtrer par tarif maximum
    if (maxRate) {
      filtered = filtered.filter(freelancer => 
        freelancer.hourlyRate <= parseInt(maxRate)
      );
    }
    
    setFilteredFreelancers(filtered);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    setSkillFilter('');
    setMinRate('');
    setMaxRate('');
    setFilteredFreelancers(freelancers);
  };

  // Rendu d'un élément de la liste - Version simplifiée
  const renderFreelancerItem = ({ item }) => (
    <View style={styles.freelancerCard}>
      <Text style={styles.freelancerName}>{item.name} {item.lastName}</Text>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.rateText}>{item.hourlyRate} TND/h</Text>
    </View>
  );

  // Affichage d'une erreur
  if (error) {
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
            <Text style={styles.headerText}>Freelancers</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadFreelancers}>
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerText}>Freelancers</Text>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Section de filtrage */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Filter Freelancers</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Rechercher par compétences (React, PHP, etc.)"
              value={skillFilter}
              onChangeText={setSkillFilter}
            />
            
            <View style={styles.rateFilterContainer}>
              <TextInput
                style={[styles.input, styles.rateInput]}
                placeholder="Tarif min (TND)"
                value={minRate}
                onChangeText={setMinRate}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.rateInput]}
                placeholder="Tarif max (TND)"
                value={maxRate}
                onChangeText={setMaxRate}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.applyButton]} 
                onPress={applyFilters}
              >
                <Text style={styles.buttonText}>Appliquer filtres</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.clearButton]} 
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Résultats */}
          <Text style={styles.resultsCount}>
            {filteredFreelancers.length} freelancers trouvés
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#0F2573" style={styles.loader} />
          ) : filteredFreelancers.length > 0 ? (
            <FlatList
              data={filteredFreelancers}
              renderItem={renderFreelancerItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <Text style={styles.noResults}>
              Aucun freelancer ne correspond à vos critères
            </Text>
          )}
        </View>
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
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2573',
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  rateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateInput: {
    width: '48%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  applyButton: {
    backgroundColor: '#0F2573',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  retryButton: {
    backgroundColor: '#0F2573',
    marginTop: 15,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
    paddingLeft: 5,
  },
  freelancerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  freelancerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freelancerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  titleText: {
    fontSize: 15,
    color: '#5E548E',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#0F2573',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    color: '#495057',
  },
  skillsText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  rateText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  projectsText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 15,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6c757d',
    fontSize: 16,
  },
  loader: {
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Freelancers;
