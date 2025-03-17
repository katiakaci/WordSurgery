import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import RandomWord from '../RandomWord';

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
    // paddingHorizontal: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fefff1',
  },
});

export default GameScreen;
