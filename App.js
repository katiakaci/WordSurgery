// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { Node } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Hangman from './src/hangman'

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>CACAAAAAAAAAA up App.js to start working on your !!! !</Text>
    //   <StatusBar style="auto" />
    // </View>
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Hangman />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
