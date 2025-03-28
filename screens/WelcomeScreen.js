import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import tw from 'twrnc'

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.image} />
      <Text style={styles.title}>{i18n.t('welcome')}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Game')}>
        {/* <Text style={[styles.buttonText, { fontSize: 10 }]}>{i18n.t('new game')}</Text> */}
        <LottieView
          source={require('../assets/animation/playButton.json')}
          autoPlay
          loop
          style={tw`w-[30] h-[30]`}
        />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#9be69d' }]} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>{i18n.t('new game')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#fe73c5' }]} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>{i18n.t('continue')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ffe270' }]} onPress={() => navigation.navigate('Tutoriel')}>
        <Text style={styles.buttonText}>{i18n.t('tutoriel')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#fd9468' }]} onPress={() => navigation.navigate(i18n.t('settings'))}>
        <Text style={styles.buttonText}>{i18n.t('settings')}</Text>
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
