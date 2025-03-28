import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import GameScreen from './screens/GameScreen';
import TutorielScreen from './screens/TutorielScreen';
import SettingsScreen from './screens/SettingsScreen';

import i18n from './languages/i18n';

import LottieView from 'lottie-react-native';

const Stack = createStackNavigator();

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
  }, []);

  if (showWelcome) {
    return (
      <View style={styles.container}>

        <LottieView
          source={require('./assets/animation/splash_screen.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <View style={styles.overlay}>
          <Image source={require('./assets/icon.png')} style={styles.image} />
          <Text style={styles.title}>WordSurgery</Text>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={i18n.t('home')}
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            headerStyle: {
              backgroundColor: '#fefff1',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#e8663d',
          }}
        />
        <Stack.Screen
          name="Tutoriel"
          component={TutorielScreen}
          options={{
            headerStyle: {
              backgroundColor: '#fefff1',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#e8663d',
          }}
        />
        <Stack.Screen name={i18n.t('settings')} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    color: 'black',
  },
  animation: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
