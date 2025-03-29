import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { Ionicons } from 'react-native-vector-icons';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <LottieView
        source={require('../assets/animation/HomePage.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <LottieView
        source={require('../assets/animation/HomePage.json')}
        autoPlay
        loop
        style={styles.animation2}
      />

      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>{"WordSurgery"}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Game')}>
        <LottieView
          source={require('../assets/animation/playButton.json')}
          autoPlay
          loop
          style={tw`w-[50] h-[50]`}
        />
      </TouchableOpacity>

      {/* Boutons en bas */}
      <View style={styles.bottomButtonsContainer}>
        {/* Bouton pour Paramètres */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.button}>
          <Ionicons name="settings" size={20} color="#e8663d" />
        </TouchableOpacity>

        {/* Bouton pour Tutoriel */}
        <TouchableOpacity onPress={() => navigation.navigate('Tutoriel')} style={styles.button}>
          <Ionicons name="information-circle" size={20} color="#e8663d" />
        </TouchableOpacity>
      </View>
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
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animation: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: -45,
    left: 0,
  },
  animation2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: -110,
  },
});

export default WelcomeScreen;
