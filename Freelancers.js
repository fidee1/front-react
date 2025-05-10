import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Freelancers = ({ navigation }) => {
  const [freelancers, setFreelancers] = useState([
    {
      id: '1',
      title: 'Senior React Native Developer',
      skills: 'React Native, JavaScript, Firebase, Redux',
      experience: '5 years of mobile development experience',
      portfolio: 'https://github.com/johndoe',
      rating: 4,
      hourlyRate: 50,
      completedProjects: 12,
      user: {
        id: '101',
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+216 12 345 678',
        location: 'Tunis, Tunisia'
      }
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      skills: 'Figma, Adobe XD, Prototyping, User Research',
      experience: '3 years of interface design experience',
      portfolio: 'https://behance.net/janesmith',
      rating: 4.5,
      hourlyRate: 45,
      completedProjects: 8,
      user: {
        id: '102',
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+216 98 765 432',
        location: 'Sfax, Tunisia'
      }
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      skills: 'Node.js, Express, MongoDB, React',
      experience: '4 years of web development experience',
      portfolio: 'https://github.com/alexj',
      rating: 4.8,
      hourlyRate: 60,
      completedProjects: 15,
      user: {
        id: '103',
        name: 'Alex',
        lastName: 'Johnson',
        email: 'alex.j@example.com',
        phone: '+216 55 444 333',
        location: 'Sousse, Tunisia'
      }
    }
  ]);

  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  useEffect(() => {
    setFilteredFreelancers(freelancers);
  }, [freelancers]);

  const applyFilters = () => {
    setLoading(true);
    
    let results = [...freelancers];
    
    if (skillFilter) {
      results = results.filter(freelancer => 
        freelancer.skills.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    if (minRate) {
      const min = parseFloat(minRate);
      results = results.filter(freelancer => freelancer.hourlyRate >= min);
    }
    
    if (maxRate) {
      const max = parseFloat(maxRate);
      results = results.filter(freelancer => freelancer.hourlyRate <= max);
    }
    
    setTimeout(() => {
      setFilteredFreelancers(results);
      setLoading(false);
    }, 500);
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
      onPress={() => navigation.navigate('Profile', { 
        freelancerId: item.id,
        isExternalView: true
      })}
    >
      <View style={styles.freelancerHeader}>
        <Text style={styles.freelancerName}>{item.user.name} {item.user.lastName}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.skillsText}><Text style={styles.label}>Skills:</Text> {item.skills}</Text>
      <Text style={styles.rateText}><Text style={styles.label}>Hourly Rate:</Text> {item.hourlyRate} TND</Text>
      <Text style={styles.projectsText}><Text style={styles.label}>Completed Projects:</Text> {item.completedProjects}</Text>
      <Text style={styles.locationText}><Ionicons name="location-outline" size={14} /> {item.user.location}</Text>
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
            placeholder="Min rate (TND)"
            keyboardType="numeric"
            value={minRate}
            onChangeText={setMinRate}
          />
          <TextInput
            style={[styles.input, styles.rateInput]}
            placeholder="Max rate (TND)"
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
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resultsCount}>
        {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0F2573" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredFreelancers}
          renderItem={renderFreelancerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noResults}>No freelancers match your criteria</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
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
    color: '#0F2573',
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
    backgroundColor: '#0F2573',
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
    color: '#0F2573',
  },
  titleText: {
    fontSize: 15,
    color: '#5E548E',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#0F2573',
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
    marginBottom: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
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