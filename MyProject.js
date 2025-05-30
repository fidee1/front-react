import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Badge, Button } from 'react-native-paper';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { get_projects_freelancer } from "./services/project";

const MyProject = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchProjects = async () => {
    try {
      setRefreshing(true);
      const res = await get_projects_freelancer();
      console.log("API Response:", res);
      
      // Transformez les données si nécessaire pour correspondre à votre structure frontend
      const formattedProjects = res.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        client: project.client?.name || 'Unknown Client', // Accédez au nom du client via la relation
        deadline: project.date_limite,
        status: 'accepted', // Tous les projets retournés sont "accepted"
        completionDate: project.completed_at // Adaptez selon votre champ de complétion
      }));
      
      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert("Error", "Failed to fetch projects.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Projets en cours (tous les projets retournés sont considérés comme en cours)
  const ongoingProjects = projects;

  // Projets complétés (vous devrez adapter selon votre logique métier)
  const completedProjects = [];

  const renderProjectItem = ({ item }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.badgeContainer}>
            <Badge style={styles.badgeAccepted}>
              Accepted
            </Badge>
          </View>
          
          <View style={styles.projectInfo}>
            <Text style={styles.infoText}><Text style={styles.infoLabel}>Client:</Text> {item.client}</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Deadline:</Text> {item.deadline}
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button 
            mode="contained" 
            style={styles.viewButton}
            labelStyle={styles.buttonLabel}
            onPress={() => viewProjectDetails(item.id)}
          >
            View Details
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Projects</Text>
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#0F2573" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Projects</Text>
      </View>

      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchProjects}
            colors={['#0F2573']}
          />
        }
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Accepted Projects</Text>
          {ongoingProjects.length > 0 ? (
            <FlatList
              data={ongoingProjects}
              renderItem={renderProjectItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="folder-open" size={40} color="#ccc" />
              <Text style={styles.noProjectsText}>No projects found</Text>
              <Text style={styles.noProjectsSubText}>Projects where you're accepted will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F2573',
    marginBottom: 10,
  },
  projectCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0F2573',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    marginRight: 12,
  },
  badgeAccepted: {
    backgroundColor: '#FFB400',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  projectInfo: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#0F2573',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#0F2573',
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 20,
  },
  noProjectsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noProjectsSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default MyProject;