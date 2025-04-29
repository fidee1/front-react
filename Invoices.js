import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Card, Button } from 'react-native-elements';

const Invoices = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { type: 'Visa', last4: '4242', expiry: '12/26', amount: 150.0 },
    { type: 'MasterCard', last4: '1234', expiry: '09/25', amount: 75.5 }
  ]);

  const [newMethod, setNewMethod] = useState({
    type: '',
    last4: '',
    expiry: '',
    amount: ''
  });

  const addPaymentMethod = () => {
    if (newMethod.type && newMethod.last4 && newMethod.expiry && newMethod.amount > 0) {
      setPaymentMethods([...paymentMethods, { ...newMethod, amount: parseFloat(newMethod.amount) }]);
      setNewMethod({ type: '', last4: '', expiry: '', amount: '' });
    } else {
      Alert.alert('Error', 'Please fill all fields with valid values');
    }
  };

  const removeMethod = (index) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            const updatedMethods = [...paymentMethods];
            updatedMethods.splice(index, 1);
            setPaymentMethods(updatedMethods);
          }
        }
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Secure Payment Management</Text>

      {/* Payment Methods */}
      <View style={styles.cardGrid}>
        {paymentMethods.map((method, index) => (
          <Card key={index} containerStyle={styles.paymentCard}>
            <Card.Title style={styles.cardTitle}>{method.type} **** {method.last4}</Card.Title>
            <Card.Divider />
            <Text style={styles.cardText}>Expiry: {method.expiry}</Text>
            <Text style={styles.cardText}>Amount: {formatCurrency(method.amount)}</Text>
            <Button
              title="Remove"
              type="outline"
              buttonStyle={styles.removeButton}
              titleStyle={styles.removeButtonText}
              onPress={() => removeMethod(index)}
            />
          </Card>
        ))}
      </View>

      {/* Add New Method Form */}
      <View style={styles.addMethodForm}>
        <Card containerStyle={styles.formCard}>
          <Card.Title style={styles.formTitle}>Add New Payment Method</Card.Title>
          <Card.Divider />
          
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Card Type (e.g. Visa)"
              value={newMethod.type}
              onChangeText={(text) => setNewMethod({...newMethod, type: text})}
            />
          </View>
          
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Last 4 Digits"
              value={newMethod.last4}
              onChangeText={(text) => setNewMethod({...newMethod, last4: text})}
              maxLength={4}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={newMethod.expiry}
              onChangeText={(text) => setNewMethod({...newMethod, expiry: text})}
            />
          </View>
          
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Amount (TND)"
              value={newMethod.amount}
              onChangeText={(text) => setNewMethod({...newMethod, amount: text})}
              keyboardType="numeric"
            />
          </View>
          
          <Button
            title="Add Method"
            buttonStyle={styles.addButton}
            onPress={addPaymentMethod}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    padding: 16,
  },
  pageTitle: {
    color: '#0F2573',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardGrid: {
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: '#E1F0FF',
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    color: '#0F2573',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
  },
  cardText: {
    color: '#5E548E',
    marginBottom: 8,
  },
  removeButton: {
    borderColor: '#dc3545',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#dc3545',
  },
  addMethodForm: {
    marginTop: 20,
    marginBottom: 40,
  },
  formCard: {
    borderRadius: 16,
    borderColor: '#D6BEDA',
    borderWidth: 1,
  },
  formTitle: {
    color: '#0F2573',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formRow: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D6BEDA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0F2573',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
});

export default Invoices;