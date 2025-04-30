import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('./assets/images/lo.jpg')}
      style={styles.background}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Assure que l'image couvre tout l'écran
  },
});

export default SplashScreen;
