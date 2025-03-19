import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import i18n from '../languages/i18n';

function SettingsScreen({ navigation }) {

  // à améliorer:
  const changeLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity style={[styles.button]} onPress={changeLanguage}
      >
        <Text style={styles.buttonText}>{i18n.t('language')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button]} onPress={() => {
        // TODO Code pour changer le dictionnaire ici
      }}
      >
        <Text style={styles.buttonText}>{i18n.t('dictionnary')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: 250,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fdb441'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
