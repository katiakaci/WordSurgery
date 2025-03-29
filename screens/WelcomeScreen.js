import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { Ionicons } from 'react-native-vector-icons';
import i18n from '../languages/i18n';
import settings from '../Settings';

function WelcomeScreen({ navigation }) {
  const {
    modalVisible,
    setModalVisible,
    isMusicEnabled,
    isSoundEnabled,
    darkMode,
    changeLanguage,
    changeDictionnary,
    toggleMusic,
    toggleSound,
    toggleDarkMode,
    shareGame,
    rateApp
  } = settings();

  return (
    <View style={styles.container}>

      {/* Animation bulles background */}
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation} />
      <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation2} />

      {/* Titre et logo */}
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>{i18n.t('wordSurgery')}</Text>

      {/* Bouton play */}
      <TouchableOpacity onPress={() => navigation.navigate('Game')}>
        <LottieView source={require('../assets/animation/playButton.json')} autoPlay loop style={tw`w-[50] h-[50]`} />
      </TouchableOpacity>

      {/* Boutons en bas */}
      <View style={styles.bottomButtonsContainer}>
        {/* Bouton pour ouvrir la fenêtre modale des paramètres */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Ionicons name="settings" size={20} color="#fdb441" />
        </TouchableOpacity>

        {/* Bouton tutoriel */}
        <TouchableOpacity onPress={() => navigation.navigate('Tutoriel')} style={styles.button}>
          <Ionicons name="information-circle" size={20} color="#fdb441" />
        </TouchableOpacity>
      </View>

      {/* Fenêtre modale des paramètres */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{i18n.t('settings')}</Text>

            {/* Changer la langue */}
            <TouchableOpacity style={styles.modalButton} onPress={changeLanguage}>
              <Text style={styles.modalButtonText}>{i18n.t('language')}</Text>
            </TouchableOpacity>

            {/* Changer le dictionnaire */}
            <TouchableOpacity style={styles.modalButton} onPress={changeDictionnary}>
              <Text style={styles.modalButtonText}>{i18n.t('dictionnary')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={toggleMusic}>
              <Text style={styles.modalButtonText}>{isMusicEnabled ? 'Désactiver la musique' : 'Activer la musique'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={toggleSound}>
              <Text style={styles.modalButtonText}>{isSoundEnabled ? 'Désactiver les sons' : 'Activer les sons'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={toggleDarkMode}>
              <Text style={styles.modalButtonText}>{darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={shareGame}>
              <Text style={styles.modalButtonText}>Partager le jeu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={rateApp}>
              <Text style={styles.modalButtonText}>Noter l'application</Text>
            </TouchableOpacity>

            {/* Bouton de fermeture */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fdb441',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
});

export default WelcomeScreen;
