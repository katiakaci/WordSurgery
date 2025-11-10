import { Share, Linking } from 'react-native';

const APP_URL = 'https://play.google.com/store/apps/details?id=com.katiakaci.WordSurgery';

export const shareGame = async () => {
    try {
        await Share.share({
            message: `Découvrez WordSurgery, un jeu passionnant! Téléchargez-le ici : ${APP_URL}`,
        });
    } catch (error) {
        console.error('Erreur lors du partage :', error);
    }
};

export const rateApp = () => {
    Linking.openURL(APP_URL);
};
