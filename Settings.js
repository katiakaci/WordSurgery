import { useState } from 'react';
import i18n from './languages/i18n';
import { useColorScheme, Share } from 'react-native';
import { Linking } from 'react-native';

export default function settings() {
    const [modalVisible, setModalVisible] = useState(false);
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');

    const changeLanguage = () => {
        const currentLang = i18n.language;
        const newLang = currentLang === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    const changeDictionnary = () => {
        // TODO
        console.log('Changer dictionnaire');
    };

    const toggleMusic = () => {
        setIsMusicEnabled(!isMusicEnabled);
        console.log(isMusicEnabled ? 'Musique désactivée' : 'Musique activée');
    };

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
        console.log(isSoundEnabled ? 'Sons désactivés' : 'Sons activés');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        console.log(darkMode ? 'Mode clair activé' : 'Mode sombre activé');
    };

    const shareGame = async () => {
        try {
            await Share.share({
                message: 'Découvrez WordSurgery, un jeu passionnant ! Téléchargez-le ici : https://example.com',
            });
        } catch (error) {
            console.error('Erreur lors du partage :', error);
        }
    };

    const rateApp = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.example.wordSurgery');
    };

    return {
        modalVisible,
        setModalVisible,
        isMusicEnabled,
        isSoundEnabled,
        darkMode,
        changeLanguage,
        changeDictionnary,
        toggleMusic,
        toggleSound,
        toggleDarkMode,
        shareGame,
        rateApp
    };
}
