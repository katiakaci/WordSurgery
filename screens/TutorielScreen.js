import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';

function TutorielScreen() {
  return (
    <View style={styles.container}>
      <Text>Pour jouer, il faut ...</Text>
      <StatusBar style="auto" />
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
});

export default TutorielScreen;
