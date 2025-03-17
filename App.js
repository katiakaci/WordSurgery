import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import GameScreen from './screens/GameScreen';
import TutorielScreen from './screens/TutorielScreen';

const Stack = createStackNavigator();

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
        <Image source={require('./assets/icon.png')} style={styles.image} />
        <Text style={styles.title}>WordPress</Text>
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
});
