import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState, useEffect } from 'react';
import RandomWord from './RandomWord';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/app_icon.png')} style={styles.image} />
      <Text style={styles.title}>Bienvenue sur WordPress !</Text>
      <Button title="Nouvelle partie" onPress={() => navigation.navigate('Game')} />
      <Button title="Continuer" onPress={() => navigation.navigate('Game')} />
      <Button title="Tutoriel" onPress={() => navigation.navigate('Tutoriel')} />
    </View>
  );
}

function GameScreen() {
  return (
    <View style={styles.container}>
      <RandomWord />
      <StatusBar style="auto" />
    </View>
  );
}

function TutorielScreen() {
  return (
    <View style={styles.container}>
      <Text>Pour jouer, il faut bkabakbkabkaa</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  }, []);

  if (showWelcome) {
    return (
      <View style={styles.container}>
        <Image source={require('./assets/app_icon.png')} style={styles.image} />
        <Text style={styles.title}>Accueil</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="WordPress" component={WelcomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Tutoriel" component={TutorielScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
  link: {
    fontSize: 18,
    color: 'blue',
    marginTop: 20,
  },
});
