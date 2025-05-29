import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const palette = {
  LIGHT_BLUE: "#ADE1FB",
  MEDIUM_BLUE: "#266CA9", 
  DARK_BLUE: "#0F2573",
  DARKER_BLUE: "#041D56",
  DARKEST_BLUE: "#01082D"
};

const colors = {
  primary: palette.MEDIUM_BLUE,
  secondary: palette.DARK_BLUE,
  accent: palette.LIGHT_BLUE,
  dark: palette.DARKEST_BLUE,
  light: "#FFFFFF",
  background: "#FFFFFF",
};

export default function Claim() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    sujet: '', // Changé de "subject" à "sujet" pour correspondre au backend
    description: '',
    user_id: 1, // Remplace par l'ID de l'utilisateur authentifié
  });
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token || '63|T2DGkn3YxaaoyJf0oB3YKRRfDAybmzCAbmovdHF5c982ab70'; // Utilise un token par défaut si aucun n'est trouvé
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const submitClaim = async () => {
    if (!form.sujet || !form.description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch('http://192.168.215.109:8080/api/reclamations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Submission failed! Status: ${response.status}, Response: ${text}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Log pour déboguer

      setForm({ ...form, sujet: '', description: '' });
      Alert.alert('Success', 'Claim submitted successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to submit claim: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerText}>Claims</Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Claim Form */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Submit a Claim</Text>
              
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the subject of your claim"
                placeholderTextColor={palette.LIGHT_BLUE}
                value={form.sujet} // Changé de "subject" à "sujet"
                onChangeText={(text) => setForm({ ...form, sujet: text })} // Changé ici
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholder="Provide more details about your claim"
                placeholderTextColor={palette.LIGHT_BLUE}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />

              <Button
                mode="contained"
                onPress={submitClaim}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
                labelStyle={styles.buttonLabel}
              >
                Submit Claim
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.DARK_BLUE,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.DARK_BLUE,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: palette.LIGHT_BLUE,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: palette.MEDIUM_BLUE,
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});