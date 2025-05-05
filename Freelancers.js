import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Freelancers = ({ navigation }) => {
  const [freelancers, setFreelancers] = useState([
    {
      id: 1,
      name: 'John Doe',
      skills: 'React, Node.js, MongoDB',
      hourlyRate: 50,
      completedProjects: 12,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Jane Smith',
      skills: 'Laravel, PHP, MySQL',
      hourlyRate: 45,
      completedProjects: 8,
      rating: 4.5
    },
    {
      id: 3,
      name: 'Alex Johnson',
      skills: 'React Native, Firebase',
      hourlyRate: 60,
      completedProjects: 15,
      rating: 4.9
    },
    {
      id: 4,
      name: 'Sarah Williams',
      skills: 'Python, Django, Data Science',
      hourlyRate: 70,
      completedProjects: 20,
      rating: 5.0
    },
    {
      id: 5,
      name: 'Mike Brown',
      skills: 'Angular, TypeScript, AWS',
      hourlyRate: 55,
      completedProjects: 10,
      rating: 4.7
    }
  ]);
  
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  useEffect(() => {
    setFilteredFreelancers(freelancers);
  }, []);

  const applyFilters = () => {
    setLoading(true);
    
    let results = [...freelancers];
    
    // Filter by skills
    if (skillFilter) {
      results = results.filter(freelancer => 
        freelancer.skills.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    // Filter by minimum rate
    if (minRate) {
      const min = parseFloat(minRate);
      results = results.filter(freelancer => freelancer.hourlyRate >= min);
    }
    
    // Filter by maximum rate
    if (maxRate) {
      const max = parseFloat(maxRate);
      results = results.filter(freelancer => freelancer.hourlyRate <= max);
    }
    
    setFilteredFreelancers(results);
    setLoading(false);
  };

  const clearFilters = () => {
    setSkillFilter('');
    setMinRate('');
    setMaxRate('');
    setFilteredFreelancers(freelancers);
  };

  const renderFreelancerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.freelancerCard}
      onPress={() => navigation.navigate('FreelancerProfile', { freelancer: item })}
    >
      <View style={styles.freelancerHeader}>
        <Text style={styles.freelancerName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.skillsText}><Text style={styles.label}>Skills:</Text> {item.skills}</Text>
      <Text style={styles.rateText}><Text style={styles.label}>Rate:</Text> ${item.hourlyRate}/hour</Text>
      <Text style={styles.projectsText}><Text style={styles.label}>Projects:</Text> {item.completedProjects}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filter Freelancers</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Search by skills (React, PHP, etc.)"
          value={skillFilter}
          onChangeText={setSkillFilter}
        />
        
        <View style={styles.rateFilterContainer}>
          <TextInput
            style={[styles.input, styles.rateInput]}
            placeholder="Min rate ($)"
            keyboardType="numeric"
            value={minRate}
            onChangeText={setMinRate}
          />
          <TextInput
            style={[styles.input, styles.rateInput]}
            placeholder="Max rate ($)"
            keyboardType="numeric"
            value={maxRate}
            onChangeText={setMaxRate}
          />
        </View>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.applyButton]}
            onPress={applyFilters}
          >
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]}
            onPress={clearFilters}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resultsCount}>
        {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#041D56" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredFreelancers}
          renderItem={renderFreelancerItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noResults}>No freelancers match your filters</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#041D56',
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  rateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateInput: {
    width: '48%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
  },
  applyButton: {
    backgroundColor: '#041D56',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
    paddingLeft: 5,
  },
  freelancerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  freelancerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freelancerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#041D56',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#041D56',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    color: '#495057',
  },
  skillsText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  rateText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
  },
  projectsText: {
    fontSize: 14,
    color: '#495057',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6c757d',
    fontSize: 16,
  },
  loader: {
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default Freelancers;