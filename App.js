import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import RandomWord from './RandomWord';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {showWelcome ? (
        <View style={styles.welcomeContainer}>
          <Image source={require('./assets/app_icon.png')} style={styles.image} />
          <Text style={styles.title}>WordPress</Text>
        </View>
      ) : (
        <>
          <RandomWord />
          <StatusBar style="auto" />
        </>
      )}
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
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
