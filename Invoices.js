import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ActivityIndicator, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Utilisation du picker de la communauté
import { Card, Title, Paragraph, Button, Badge } from 'react-native-paper'; // Utilisation de react-native-paper pour les composants UI
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Simuler l'état Redux pour le développement
const mockAuthStore = {
  role: 'freelancer', // ou 'client'
  token: 'fake-jwt-token',
  user: { id: 1, name: 'Freelancer', lastName: 'Test'}
};

// Simuler les appels API pour le développement
const mockPaymentsData = [
  {
    id: 1,
    client: { id: 2, name: 'Client', lastName: 'Un' },
    freelancer: { id: 1, name: 'Freelancer', lastName: 'Test' },
    montant: 150,
    statut: 'on hold',
    created_at: '2024-05-10T10:00:00.000Z',
  },
  {
    id: 2,
    client: { id: 3, name: 'Client', lastName: 'Deux' },
    freelancer: { id: 1, name: 'Freelancer', lastName: 'Test' },
    montant: 200,
    statut: 'finished',
    created_at: '2024-05-08T14:30:00.000Z',
  },
  {
    id: 3,
    client: { id: 1, name: 'Client', lastName: 'Trois' }, // Cas où le freelancer est le client (pour tester l'affichage)
    freelancer: { id: 4, name: 'Autre', lastName: 'Freelancer' },
    montant: 300,
    statut: 'cancelled',
    created_at: '2024-05-01T09:15:00.000Z',
  },
];

const fetchPaymentsAPI = async (token) => {
  console.log('Fetching payments with token:', token);
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Retourner les données simulées
  return mockPaymentsData;
};

const updatePaymentStatusAPI = async (paymentId, newStatus, token) => {
  console.log(`Updating payment ${paymentId} to ${newStatus} with token: ${token}`);
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simuler une réponse de succès
  // Dans une vraie application, vous mettriez à jour les données et les retourneriez ou confirmez le succès
  const paymentIndex = mockPaymentsData.findIndex(p => p.id === paymentId);
  if (paymentIndex !== -1) {
    mockPaymentsData[paymentIndex].statut = newStatus;
  }
  return { success: true }; 
};

const Invoices = () => {
  const navigation = useNavigation();
  // const authStore = useSelector((state) => state.auth); // Récupérer depuis Redux
  const authStore = mockAuthStore; // Utilisation du mock pour le développement
  const role = authStore.role;
  const token = authStore.token;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadPayments = useCallback(async () => {
    if (!token) {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // const response = await axios.get('http://127.0.0.1:8000/api/payments/history', { headers: { Authorization: `Bearer ${token}` } });
      // setPayments(response.data);
      const data = await fetchPaymentsAPI(token);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'historique des paiements.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  }, [loadPayments]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'finished':
        return '#4CAF50'; // Vert
      case 'on hold':
        return '#FFC107'; // Jaune/Orange
      case 'cancelled':
        return '#F44336'; // Rouge
      default:
        return '#607D8B'; // Gris
    }
  };

  const openStatusModal = (payment) => {
    setSelectedPayment(payment);
    setSelectedStatus(payment.statut); // Pré-remplir avec le statut actuel
    setModalVisible(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedPayment || !selectedStatus) {
      Alert.alert('Erreur', 'Veuillez sélectionner un statut.');
      return;
    }
    setLoading(true);
    try {
      // await axios.put(`http://127.0.0.1:8000/api/payments/${selectedPayment.id}/status`, 
      //   { statut: selectedStatus }, 
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      await updatePaymentStatusAPI(selectedPayment.id, selectedStatus, token);
      Alert.alert('Succès', 'Statut mis à jour avec succès!');
      setModalVisible(false);
      loadPayments(); // Recharger les paiements pour voir la mise à jour
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.itemHeader}>
            <Title style={styles.itemTitle}>
                {role === 'freelancer' ? `${item.client.lastName} ${item.client.name}` : `${item.freelancer.lastName} ${item.freelancer.name}`}
            </Title>
            <Badge style={{ backgroundColor: getStatusColor(item.statut), color: 'white', paddingHorizontal: 10}}>{item.statut}</Badge>
        </View>
        <Paragraph style={styles.amountText}>{item.montant} TND</Paragraph>
        <Paragraph style={styles.dateText}>Date: {formatDate(item.created_at)}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        {/* Le bouton "Close" dans le code Vue semble être pour changer le statut */} 
        {/* Uniquement les freelancers peuvent changer le statut ? Ou les deux ? Supposons que le freelancer peut le faire */} 
        {role === 'freelancer' && (item.statut === 'on hold' || item.statut === 'pending') && (
            <Button mode="contained" onPress={() => openStatusModal(item)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>
                Changer Statut
            </Button>
        )}
         {/* Si le client peut aussi annuler, ajouter une condition ici */} 
      </Card.Actions>
    </Card>
  );

  if (loading && payments.length === 0) {
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
            <Text style={styles.headerText}>Invoices</Text>
          </View>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0F2573" />
            <Text>Chargement des paiements...</Text>
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
          <Text style={styles.headerText}>Invoices</Text>
        </View>
        
        <View style={styles.contentContainer}>
          {payments.length === 0 && !loading ? (
            <View style={styles.centered}>
                <Text style={styles.noPaymentsText}>Aucun paiement trouvé.</Text>
            </View>
          ) : (
            <FlatList
              data={payments}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContentContainer}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0F2573"]}/>}
            />
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredViewModal}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Changer le statut du paiement</Text>
              {selectedPayment && (
                  <Text style={styles.modalInfo}>Paiement ID: {selectedPayment.id}</Text>
              )}
              <View style={styles.pickerContainer}>
                  <Picker
                  selectedValue={selectedStatus}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  dropdownIconColor="#0F2573"
                  >
                  <Picker.Item label="-- Choisir un statut --" value="" enabled={false} style={{color: 'grey'}} />
                  <Picker.Item label="Annulé" value="cancelled" />
                  <Picker.Item label="Terminé" value="finished" />
                  {/* Ajouter d'autres statuts si nécessaire, par exemple 'on hold' si on peut y revenir */} 
                  </Picker>
              </View>
              
              <View style={styles.modalButtonsContainer}>
                <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalButton} labelStyle={{color: "#0F2573"}}>
                  Annuler
                </Button>
                <Button mode="contained" onPress={handleSaveStatus} style={[styles.modalButton, styles.saveButtonModal]} labelStyle={{color: "white"}} loading={loading} disabled={loading}>
                  Sauvegarder
                </Button>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPaymentsText: {
    fontSize: 18,
    color: '#666',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    elevation: 3, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Permet au titre de se réduire si nécessaire
  },
  amountText: {
    fontSize: 16,
    color: '#0F2573',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 8, 
    paddingBottom: 8,
  },
  actionButton: {
    backgroundColor: '#0F2573',
  },
  actionButtonLabel: {
    color: 'white',
  },
  // Styles de la Modale
  centeredViewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'stretch', // Étire les enfants horizontalement
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Largeur de la modale
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  modalInfo: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    borderColor: '#0F2573',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden', // Pour que le borderRadius s'applique bien au Picker sur Android
  },
  picker: {
    width: '100%',
    height: 50, // Hauteur fixe pour le conteneur du Picker
    color: '#0F2573',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espacer les boutons
    marginTop: 10,
  },
  modalButton: {
    flex: 1, // Pour que les boutons prennent une largeur égale
    marginHorizontal: 5, // Petit espace entre les boutons
    borderColor: '#0F2573',
  },
  saveButtonModal: {
    backgroundColor: '#0F2573',
  },
});

export default Invoices;
