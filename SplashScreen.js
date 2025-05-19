import React from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('./assets/images/fond6.jpg')} // Image de fond
      style={styles.background}
      resizeMode="cover" // Assure que l'image de fond couvre tout l'écran
    >
      <View style={styles.overlay}> {/* Conteneur pour le logo, centré sur le fond */}
        <Image
          source={require('./assets/images/logoo1.png')} // Logo
          style={styles.logo}
          resizeMode="contain" // Assure que toute l'image du logo est visible
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    // Ce conteneur est déjà centré par le style 'background'
    // Pas besoin de flex: 1 ici, car il ne contient que le logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Ajustez la taille du logo selon vos besoins
    height: 200, // Ajustez la taille du logo selon vos besoins
    // Si votre logo a des dimensions spécifiques, vous pouvez les définir ici
    // Par exemple, si logoo.png fait 250x150 pixels:
    // width: 250,
    // height: 150,
  },
});

export default SplashScreen;

