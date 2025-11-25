import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAudio = () => {
    const [sound, setSound] = useState(null);
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // Charger les paramètres de musique
    useEffect(() => {
        const loadMusicSettings = async () => {
            try {
                const savedMusicState = await AsyncStorage.getItem('@music_enabled');
                if (savedMusicState !== null) {
                    setIsMusicEnabled(savedMusicState === 'true');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des paramètres:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadMusicSettings();
    }, []);

    // Gérer la lecture/arrêt de la musique
    useEffect(() => {
        if (!isLoaded) return;

        const manageSound = async () => {
            try {
                if (isMusicEnabled) {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        require('../assets/music.mp3'),
                        { shouldPlay: true, isLooping: true }
                    );
                    setSound(newSound);
                } else if (sound) {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                    setSound(null);
                }
            } catch (error) {
                console.error('Erreur de lecture audio:', error);
            }
        };

        manageSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [isMusicEnabled, isLoaded]);

    return { isMusicEnabled, setIsMusicEnabled, isLoaded };
};
