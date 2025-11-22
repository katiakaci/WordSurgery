import { StyleSheet, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';
import WelcomeScreen from './screens/WelcomeScreen';
import GameScreen from './screens/GameScreen';
import TutorielScreen from './screens/TutorielScreen';
import i18n from './languages/i18n';
import LottieView from 'lottie-react-native';
const Stack = createStackNavigator();

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sound, setSound] = useState();
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const loadMusicSettings = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const savedMusicState = await AsyncStorage.getItem('@music_enabled');
        if (savedMusicState !== null) {
          setIsMusicEnabled(savedMusicState === 'true');
        }
        setSettingsLoaded(true);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        setSettingsLoaded(true);
      }
    };
    loadMusicSettings();
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    const loadSound = async () => {
      try {
        if (isMusicEnabled) {
          // Si la musique est activée, on la charge et on la joue
          const { sound } = await Audio.Sound.createAsync(
            require('./assets/music.mp3'),
            { shouldPlay: true, isLooping: true }
          );
          console.log('Audio loaded', sound);
          setSound(sound);
        } else {
          // Si la musique est désactivée, on la décharge
          if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        }
      } catch (error) {
        console.error('Erreur de lecture audio:', error);
      }
    };

    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isMusicEnabled, settingsLoaded]);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 1600);
  }, []);

  if (showWelcome) {
    return (
      <View style={styles.container}>
        <LottieView source={require('./assets/animation/splash_screen.json')} autoPlay loop style={styles.animation} />
        <View style={styles.overlay}>
          <Image source={require('./assets/Logo/Logo_WordSurgery.png')} style={styles.image} />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Accueil"
          options={{ headerShown: false }}
        >
          {(props) => <WelcomeScreen {...props} isMusicEnabled={isMusicEnabled} setIsMusicEnabled={setIsMusicEnabled} />}
        </Stack.Screen>

        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tutoriel"
          component={TutorielScreen}
          options={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fdb441',
          }}
        />
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
