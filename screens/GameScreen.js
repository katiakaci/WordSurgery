import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import RandomWord from '../components/RandomWord';
import i18n from '../languages/i18n';

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
    backgroundColor: '#fefff1',
  },
});

export default GameScreen;
