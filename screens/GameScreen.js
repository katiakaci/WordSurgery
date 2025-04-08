import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import RandomWord from '../components/RandomWord';

function GameScreen() {
  return (
    <View style={styles.container}>
      <RandomWord />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default GameScreen;
