import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NotFoundScreen({ navigation  }:any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
  },
});
