import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';

const Claim = () => {
  const [form, setForm] = useState({
    sujet: '',
    description: '',
    user_id: 1, // Remplacez avec l'ID de l'utilisateur connecté
  });

  const [reclamations, setReclamations] = useState([]);

  // Récupérer les réclamations depuis l'API
  const fetchReclamations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reclamations');
      const data = await response.json();
      setReclamations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations', error);
    }
  };

  // Soumettre une nouvelle réclamation
  const submitClaim = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reclamations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Erreur lors de l’envoi de la réclamation.');

      // Réinitialiser le formulaire
      setForm({ sujet: '', description: '', user_id: 1 });
      await fetchReclamations();
    } catch (error) {
      console.error('Erreur lors de l’envoi', error);
    }
  };

  // Supprimer une réclamation
  const deleteReclamation = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reclamations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression de la réclamation.');

      await fetchReclamations();
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réclamations</Text>

      {/* Formulaire de réclamation */}
      <TextInput
        style={styles.input}
        placeholder="Sujet de la réclamation"
        value={form.sujet}
        onChangeText={(text) => setForm({ ...form, sujet: text })}
      />
      <TextInput
        style={styles.textarea}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
      />
      <Button title="Envoyer" onPress={submitClaim} />

      <View style={styles.hr} />

      {/* Liste des réclamations */}
      {reclamations.length ? (
        <FlatList
          data={reclamations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.sujet}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.cardUser}>
                Par : {item.user?.name || 'Utilisateur inconnu'}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteReclamation(item.id)}
              >
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noClaims}>Aucune réclamation trouvée.</Text>
      )}
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textarea: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardUser: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
  },
  noClaims: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default Claim;
