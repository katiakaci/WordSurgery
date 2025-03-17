import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>Bienvenue sur WordSurgery !</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#9be69d' }]} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>Nouvelle partie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#fe73c5' }]} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ffe270' }]} onPress={() => navigation.navigate('Tutoriel')}>
        <Text style={styles.buttonText}>Tutoriel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#fd9468' }]} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Paramètres</Text>
      </TouchableOpacity>
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
  button: {
    margin: 10,
    width: 250,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default WelcomeScreen;
