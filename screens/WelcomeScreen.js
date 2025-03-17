import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>Bienvenue sur WordPress !</Text>
      <Button title="Nouvelle partie" onPress={() => navigation.navigate('Game')} />
      <Button title="Continuer" onPress={() => navigation.navigate('Game')} />
      <Button title="Tutoriel" onPress={() => navigation.navigate('Tutoriel')} />
      <Button title="Paramètres" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default WelcomeScreen;
