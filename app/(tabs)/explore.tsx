import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Explore</Text>
      </View>
      <Text style={styles.text}>This app includes example code to help you get started.</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images</Text>
        <Text style={styles.text}>You can use different image resolutions for various screen densities.</Text>
        <Image style={styles.image} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Fonts</Text>
        <Text style={styles.text}>You can load custom fonts in your project.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
});
