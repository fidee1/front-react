import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Assurez-vous que cette bibliothèque est installée

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('./assets/images/sp.jpg')}
      style={styles.background}
    >
      <View style={styles.contentContainer}>
        <FontAwesome5 name="laptop-code" size={50} color="#000000" solid />
        <Text style={styles.title}>Freelancy</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Assure que l'image couvre tout l'écran
    justifyContent: 'center',
    alignItems: 'center', // Centre le contenu sur l'écran
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Ombre légère pour le texte
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default SplashScreen;
