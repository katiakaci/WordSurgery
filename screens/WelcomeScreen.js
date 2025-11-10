import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { Ionicons } from 'react-native-vector-icons';
import Settings from '../components/Settings';

function WelcomeScreen({ navigation, isMusicEnabled, setIsMusicEnabled }) {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  return (
    <View style={styles.container}>

      {/* Animation bulles background */}
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation} speed={1} />
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation2} speed={0.8} />
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation3} />

      {/* Titre et logo */}
      <Image source={require('../assets/Logo/Logo_WordSurgery.png')} style={styles.image} />

      {/* Bouton play */}
      <TouchableOpacity onPress={() => navigation.navigate('Game')}>
        <LottieView source={require('../assets/animation/playButton.json')} autoPlay loop style={tw`w-[50] h-[50]`} />
      </TouchableOpacity>

      {/* Boutons en bas */}
      <View style={styles.bottomButtonsContainer}>
        {/* Bouton pour ouvrir la fenêtre modale des paramètres */}
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.button}>
          <Ionicons name="settings" size={20} color="#d14b28" />
        </TouchableOpacity>

        {/* Bouton tutoriel */}
        <TouchableOpacity onPress={() => navigation.navigate('Tutoriel')} style={styles.button}>
          <Ionicons name="information-circle" size={20} color="#d14b28" />
        </TouchableOpacity>
      </View>

      {/* Fenêtre modale des paramètres */}
      <Settings
        isVisible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        isMusicEnabled={isMusicEnabled}
        setIsMusicEnabled={setIsMusicEnabled}
      />
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
    width: 250,
    height: 250,
    marginTop: 50
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '50%',
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
    width: '150%',
    height: '150%',
    position: 'absolute',
    top: -100,
    left: -45,
  },
  animation2: {
    width: '150%',
    height: '150%',
    position: 'absolute',
    top: -100,
    right: -110,
    transform: [{ rotate: '180deg' }],
  },
  animation3: {
    width: '150%',
    height: '150%',
    position: 'absolute',
    top: -100,
    right: -110,
    transform: [{ rotate: '80deg' }],
  },
});

export default WelcomeScreen;
