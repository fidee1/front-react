import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Card } from 'react-native-paper';

const MyProject = () => {
  // Palette de couleurs
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

  // Sample projects data
  const projects = [
    {
      id: 1,
      name: 'E-commerce Website',
      date: '2025-04-15',
      budget: 2000,
      status: 'In Progress',
      freelancer: { name: 'John Doe' },
    },
    {
      id: 2,
      name: 'Mobile App Development',
      date: '2025-03-10',
      budget: 3000,
      status: 'Finished',
      freelancer: { name: 'Lisa Smith' },
    },
    {
      id: 3,
      name: 'SEO Optimization',
      date: '2025-01-20',
      budget: 1500,
      status: 'Pending',
      freelancer: null,
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return colors.primary;
      case 'In Progress': return colors.primary;
      case 'Finished': return colors.primary;
      default: return colors.dark;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const renderProjectItem = ({ item }) => (
    <Card style={[styles.projectCard, { borderColor: colors.accent }]}>
      <Card.Content>
        <Text style={[styles.projectName, { color: colors.dark }]}>{item.name}</Text>
        <Text style={[styles.projectInfo, { color: colors.secondary }]}>Date: {formatDate(item.date)}</Text>
        <Text style={[styles.projectInfo, { color: colors.secondary }]}>Budget: ${item.budget}</Text>
        <Text style={[styles.projectInfo, { color: colors.secondary }]}>
          Status: <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
        </Text>
        
        {(item.status === 'In Progress' || item.status === 'Finished') && (
          <>
            <Text style={[styles.projectInfo, { color: colors.secondary }]}>
              Freelancer: <Text style={styles.freelancerName}>{item.freelancer?.name || 'N/A'}</Text>
            </Text>
            <TouchableOpacity 
              style={[styles.viewButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.viewButtonText}>View Project Details</Text>
            </TouchableOpacity>
          </>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: colors.dark }]}>Your Projects</Text>
        
        {projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>You don't have any projects yet.</Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40, // Déplace tous les éléments vers le bas
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30, // Plus d'espace sous le titre
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 30,
  },
  projectCard: {
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  projectInfo: {
    fontSize: 15,
    marginBottom: 8,
  },
  freelancerName: {
    fontWeight: '600',
    color: '#01082D',
  },
  viewButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, // Déplace le message vide vers le bas
  },
  emptyText: {
    fontSize: 17,
  },
});
export default MyProject;