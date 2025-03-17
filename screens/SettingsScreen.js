import React from 'react';
import { View, Text, StatusBar, StyleSheet, ImageBackground } from 'react-native';

function SettingsScreen() {
  return (
    <>
        <Text style={styles.text}>Pour jouer, il faut ...</Text>
        <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
});

export default SettingsScreen;
