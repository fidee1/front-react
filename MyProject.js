import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Card, Badge, Button } from 'react-native-paper';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const MyProject = () => {
  const [projects] = useState([
    { id: 1, title: 'Web Design for E-Commerce', description: 'Building a responsive website.', client: 'Client A', deadline: '2025-05-15', status: 'in-progress', completionDate: '' },
    { id: 2, title: 'Mobile App Development', description: 'Developing a fitness app.', client: 'Client B', deadline: '2025-06-01', status: 'completed', completionDate: '2025-04-20' },
    { id: 3, title: 'Logo Design', description: 'Creating a brand identity.', client: 'Client C', deadline: '2025-05-10', status: 'in-progress', completionDate: '' },
  ]);

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const ongoingProjects = projects.filter(project => project.status === 'in-progress');
  const completedProjects = projects.filter(project => project.status === 'completed');

  const viewProjectDetails = (id) => {
    console.log('Viewing project', id);
  };

  const openRatingModal = (project) => {
    setSelectedProject(project);
    setRating(0);
    setComment('');
    setRatingModalVisible(true);
  };

  const submitRating = () => {
    console.log('Submitted rating:', {
      projectId: selectedProject.id,
      client: selectedProject.client,
      rating: rating,
      comment: comment,
    });
    setRatingModalVisible(false);
  };

  const renderProjectItem = ({ item }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        
        <View style={styles.badgeContainer}>
          <Badge style={item.status === 'in-progress' ? styles.badgeInProgress : styles.badgeCompleted}>
            {item.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </Badge>
        </View>
        
        <View style={styles.projectInfo}>
          <Text><Text style={styles.infoLabel}>Client:</Text> {item.client}</Text>
          <Text>
            <Text style={styles.infoLabel}>
              {item.status === 'in-progress' ? 'Deadline:' : 'Completed:'}
            </Text> {item.status === 'in-progress' ? item.deadline : item.completionDate}
          </Text>
        </View>
        
        <Button 
          mode="contained" 
          style={styles.viewButton}
          labelStyle={styles.buttonLabel}
          onPress={() => viewProjectDetails(item.id)}
        >
          View Details
        </Button>
        
        {item.status === 'completed' && (
          <Button 
            mode="contained" 
            style={styles.rateButton}
            labelStyle={styles.buttonLabel}
            onPress={() => openRatingModal(item)}
          >
            Rate Client
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
        <Badge style={styles.ongoingBadge}>
          {ongoingProjects.length} Ongoing Projects
        </Badge>
      </View>

      {/* Ongoing Projects */}
      <Text style={styles.sectionTitle}>Ongoing Projects</Text>
      {ongoingProjects.length > 0 ? (
        <FlatList
          data={ongoingProjects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noProjectsText}>No ongoing projects</Text>
      )}

      {/* Completed Projects */}
      <Text style={styles.sectionTitle}>Completed Projects</Text>
      {completedProjects.length > 0 ? (
        <FlatList
          data={completedProjects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noProjectsText}>No completed projects</Text>
      )}

      {/* Rating Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Client - {selectedProject?.client}</Text>
            
            <Text style={styles.ratingQuestion}>How was your experience with this client?</Text>
            
            <View style={styles.starRating}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  {i <= rating ? (
                    <AntDesign name="star" size={32} color="#FFD700" />
                  ) : (
                    <AntDesign name="staro" size={32} color="#FFD700" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.commentLabel}>Comment</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Write your feedback..."
              value={comment}
              onChangeText={setComment}
            />
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                style={styles.cancelButton}
                labelStyle={styles.buttonLabel}
                onPress={() => setRatingModalVisible(false)}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                style={styles.submitButton}
                labelStyle={styles.buttonLabel}
                onPress={submitRating}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F2573',
  },
  ongoingBadge: {
    backgroundColor: '#0F2573',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F2573',
    marginBottom: 12,
    marginTop: 16,
  },
  noProjectsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'rgba(15, 37, 115, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  badgeInProgress: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFB400',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeCompleted: {
    alignSelf: 'flex-start',
    backgroundColor: '#28A745',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#0F2573',
    borderRadius: 8,
    marginBottom: 8,
  },
  rateButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0F2573',
  },
  ratingQuestion: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  commentLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#0F2573',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#0F2573',
  },
});

export default MyProject;