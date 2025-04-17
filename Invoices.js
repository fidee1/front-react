import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // pour les icônes

const Invoices = () => {
  const [invoices] = useState([
    { id: 'INV001', date: '2025-04-01', amount: 150.00, status: 'Payée' },
    { id: 'INV002', date: '2025-03-20', amount: 300.00, status: 'En attente' },
    { id: 'INV003', date: '2025-02-15', amount: 200.00, status: 'Payée' },
    { id: 'INV004', date: '2025-01-10', amount: 450.00, status: 'Annulée' },
    { id: 'INV005', date: '2024-12-05', amount: 175.50, status: 'Payée' },
  ]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Payée': 'green',
      'En attente': 'orange',
      'Annulée': 'red',
    };
    return statusColors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Payée': 'check-circle',
      'En attente': 'hourglass-empty',
      'Annulée': 'cancel',
    };
    return statusIcons[status] || 'info';
  };

  const downloadInvoice = (invoice) => {
    // Implémentation réelle du téléchargement
    Alert.alert('Téléchargement', `Téléchargement de la facture: ${invoice.id}`);
  };

  const viewDetails = (invoice) => {
    // Implémentation de la navigation vers les détails de la facture
    Alert.alert('Détails', `Voir détails de: ${invoice.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Factures</Text>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.id}</Text>
            <Text>{formatDate(item.date)}</Text>
            <Text style={styles.amount}>{item.amount.toFixed(2)} €</Text>

            <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <MaterialIcons name={getStatusIcon(item.status)} size={20} color="white" />
              {item.status}
            </Badge>

            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => downloadInvoice(item)} style={styles.button}>
                <Text style={styles.buttonText}>Télécharger</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => viewDetails(item)} style={styles.button}>
                <Text style={styles.buttonText}>Détails</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonGroup: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Invoices;
