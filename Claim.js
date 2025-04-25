import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Card, Button } from 'react-native-paper';

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
  const [form, setForm] = useState({
    subject: '',
    description: '',
    user_id: 1, // Replace with authenticated user's ID
  });
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('http://127.0.0.1:8000/api/claims');
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load claims');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async () => {
    if (!form.subject || !form.description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Submission failed');

      setForm({ ...form, subject: '', description: '' });
      await fetchClaims();
      Alert.alert('Success', 'Claim submitted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit claim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClaim = async (id) => {
    try {
      setLoading(true);
      await fetch(`http://127.0.0.1:8000/api/claims/${id}`, {
        method: 'DELETE',
      });
      await fetchClaims();
      Alert.alert('Success', 'Claim deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete claim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={palette.DARK_BLUE} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Title
            title="📝 Submit a Claim"
            titleStyle={styles.headerTitle}
            style={styles.headerContent}
          />
        </Card>

        {/* Claim Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the subject of your claim"
              placeholderTextColor={palette.LIGHT_BLUE}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
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

        {/* Claims List */}
        {claims.length > 0 && (
          <View style={styles.claimsContainer}>
            <Text style={styles.sectionTitle}>📂 Your Claim History</Text>
            
            {claims.map((claim) => (
              <Card key={claim.id} style={styles.claimCard}>
                <Card.Content>
                  <View style={styles.claimHeader}>
                    <Text style={styles.claimSubject}>{claim.subject}</Text>
                    <Button
                      mode="text"
                      onPress={() => deleteClaim(claim.id)}
                      textColor={palette.LIGHT_BLUE}
                      style={styles.deleteButton}
                    >
                      Delete
                    </Button>
                  </View>
                  
                  <Text style={styles.claimDescription}>{claim.description}</Text>
                  <Text style={styles.claimUser}>
                    👤 {claim.user?.name || 'Unknown User'}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.LIGHT_BLUE,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: palette.DARK_BLUE,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerContent: {
    backgroundColor: palette.DARK_BLUE,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: 'white',
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
  claimsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.DARK_BLUE,
    marginBottom: 16,
  },
  claimCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: palette.LIGHT_BLUE,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.DARK_BLUE,
    flex: 1,
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  claimDescription: {
    fontSize: 14,
    color: palette.MEDIUM_BLUE,
    marginBottom: 8,
  },
  claimUser: {
    fontSize: 12,
    color: palette.LIGHT_BLUE,
    fontStyle: 'italic',
  },
});