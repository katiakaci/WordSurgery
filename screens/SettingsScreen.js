import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity style={[styles.button]} onPress={() => {
        // TODO Code pour changer la langue ici
      }}
      >
        <Text style={styles.buttonText}>Langue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button]} onPress={() => {
        // TODO Code pour changer le dictionnaire ici
      }}
      >
        <Text style={styles.buttonText}>Changer de dictionnaire</Text>
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
