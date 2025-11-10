import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

export const useSettings = (setIsMusicEnabled) => {
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const loadSettings = useCallback(async () => {
        try {
            // Charger la langue sauvegardée
            const savedLanguage = await AsyncStorage.getItem('@app_language');
            if (savedLanguage) {
                i18n.changeLanguage(savedLanguage);
                setCurrentLanguage(savedLanguage);
            }

            // Charger l'état de la musique
            const savedMusicState = await AsyncStorage.getItem('@music_enabled');
            if (savedMusicState !== null) {
                setIsMusicEnabled(savedMusicState === 'true');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        }
    }, [setIsMusicEnabled]);

    const changeLanguage = useCallback(async (language) => {
        try {
            i18n.changeLanguage(language);
            setCurrentLanguage(language);
            await AsyncStorage.setItem('@app_language', language);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la langue:', error);
        }
    }, []);

    const toggleMusic = useCallback(async (isMusicEnabled) => {
        try {
            const newMusicState = !isMusicEnabled;
            setIsMusicEnabled(newMusicState);
            await AsyncStorage.setItem('@music_enabled', newMusicState.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'état de la musique:', error);
        }
    }, [setIsMusicEnabled]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    return {
        currentLanguage,
        changeLanguage,
        toggleMusic
    };
};
