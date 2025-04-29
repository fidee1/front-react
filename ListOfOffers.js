import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { DataTable, Card } from 'react-native-paper';

const ListOfOffers = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const offers = [
    { title: 'Develop a Task Management System', category: 'Software Engineering', budget: '4000', deadline: '2025-05-20' },
    { title: 'Create a Machine Learning Model', category: 'Artificial Intelligence', budget: '5300', deadline: '2025-05-18' },
    { title: 'Build a Secure API with Laravel', category: 'Backend Development', budget: '3400', deadline: '2025-05-22' },
    { title: 'Web Scraping Bot for Market Data', category: 'Data Science', budget: '2700', deadline: '2025-05-25' },
  ];

  const handleAction = (offerTitle, action) => {
    setAlertMessage(`You ${action} the project: ${offerTitle}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0F2573" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Title 
            title="Available Projects for Freelancers" 
            titleStyle={styles.cardTitle}
            style={styles.cardHeader}
          />
          
          <Card.Content style={styles.cardContent}>
            {showAlert && (
              <View style={styles.alert}>
                <Text style={styles.alertText}>{alertMessage}</Text>
              </View>
            )}
            
            <DataTable style={styles.dataTable}>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={styles.headerCell}>#</DataTable.Title>
                <DataTable.Title style={styles.headerCell}>Project</DataTable.Title>
                <DataTable.Title numeric style={styles.headerCell}>Budget</DataTable.Title>
                <DataTable.Title style={styles.headerCell}>Action</DataTable.Title>
              </DataTable.Header>

              {offers.map((offer, index) => (
                <DataTable.Row key={index} style={styles.tableRow}>
                  <DataTable.Cell style={styles.cell}>{index + 1}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <View style={styles.projectInfo}>
                      <Text style={styles.offerTitle} numberOfLines={2}>{offer.title}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.offerCategory}>{offer.category}</Text>
                      </View>
                      <Text style={styles.offerDeadline}>⏱ {offer.deadline}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.cell}>{offer.budget} TND</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity 
                        style={[styles.button, styles.acceptButton]}
                        onPress={() => handleAction(offer.title, 'accepted')}
                      >
                        <Text style={styles.buttonText}>✓ Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.button, styles.rejectButton]}
                        onPress={() => handleAction(offer.title, 'rejected')}
                      >
                        <Text style={styles.buttonText}>✗ Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    padding: 10,
    paddingTop: 60,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  cardHeader: {
    backgroundColor: '#0F2573',
    paddingVertical: 16,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingHorizontal: 0,
  },
  dataTable: {
    marginTop: 8,
  },
  tableHeader: {
    backgroundColor: '#0F2573',
    height: 40,
  },
  headerCell: {
    justifyContent: 'center',
  },
  tableRow: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#BE95C4',
    minHeight: 100,
  },
  cell: {
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  projectInfo: {
    flex: 1,
  },
  offerTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#0F2573',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  offerCategory: {
    color: 'white',
    fontSize: 10,
  },
  offerDeadline: {
    fontSize: 10,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
  },
  button: {
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alert: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    margin: 8,
    marginBottom: 16,
  },
  alertText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ListOfOffers;