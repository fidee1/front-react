import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.title}>Welcome!</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 1: Try it</Text>
        <Text>
          Edit the main file to see changes. Press {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })} to open developer tools.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 2: Explore</Text>
        <Text>Tap the Explore tab to learn more about what's included in this starter app.</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 3: Get a fresh start</Text>
        <Text>When you're ready, reset the project to start fresh.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#A1CEDC',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reactLogo: {
    width: 150,
    height: 100,
  },
});
