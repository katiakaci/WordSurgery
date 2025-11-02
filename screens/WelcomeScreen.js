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
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation} />
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation2} />

      {/* Titre et logo */}
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>WordSurgery</Text>

      {/* Bouton play */}
      <TouchableOpacity onPress={() => navigation.navigate('Game')}>
        <LottieView source={require('../assets/animation/playButton.json')} autoPlay loop style={tw`w-[50] h-[50]`} />
      </TouchableOpacity>

      {/* Boutons en bas */}
      <View style={styles.bottomButtonsContainer}>
        {/* Bouton pour ouvrir la fenêtre modale des paramètres */}
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.button}>
          <Ionicons name="settings" size={20} color="#fdb441" />
        </TouchableOpacity>

        {/* Bouton tutoriel */}
        <TouchableOpacity onPress={() => navigation.navigate('Tutoriel')} style={styles.button}>
          <Ionicons name="information-circle" size={20} color="#fdb441" />
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5
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
