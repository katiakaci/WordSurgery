import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import i18n from '../languages/i18n';
import { useColorScheme, Share, Linking } from 'react-native';
import Flag from 'react-native-flags';

export default function Settings({ isVisible, onClose }) {
    const [settingsModalVisible, setSettingsModalVisible] = useState(isVisible);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        setSettingsModalVisible(isVisible);
    }, [isVisible]);

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setCurrentLanguage(language);
    };

    const closeLanguageModal = () => {
        setLanguageModalVisible(false);
        setSettingsModalVisible(true);
    };

    const changeDictionnary = () => {
        // TODO
        console.log('Changer dictionnaire');
    };

    const toggleMusic = () => {
        setIsMusicEnabled(!isMusicEnabled);
        console.log(isMusicEnabled ? 'Musique désactivée' : 'Musique activée');
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

    return (
        <Modal animationType="fade" transparent visible={settingsModalVisible} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{i18n.t('settings')}</Text>

                    {/* Changer la langue */}
                    <TouchableOpacity style={styles.modalButton} onPress={() => setLanguageModalVisible(true)}>
                        <Ionicons name="language" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('language')}</Text>
                    </TouchableOpacity>

                    {/* Changer le dictionnaire */}
                    <TouchableOpacity style={styles.modalButton} onPress={changeDictionnary}>
                        <Ionicons name="book" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('dictionnary')}</Text>
                    </TouchableOpacity>

                    {/* Activer/désactiver la musique */}
                    <TouchableOpacity style={styles.modalButton} onPress={toggleMusic}>
                        <Ionicons name={isMusicEnabled ? "volume-high" : "volume-mute"} size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{isMusicEnabled ? 'Désactiver la musique' : 'Activer la musique'}</Text>
                    </TouchableOpacity>

                    {/* Activer/désactiver le mode sombre */}
                    <TouchableOpacity style={styles.modalButton} onPress={toggleDarkMode}>
                        <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{darkMode ? 'Désactiver le mode sombre' : 'Activer le mode sombre'}</Text>
                    </TouchableOpacity>

                    {/* Partager le jeu */}
                    <TouchableOpacity style={styles.modalButton} onPress={shareGame}>
                        <Ionicons name="share-social" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>Partager le jeu</Text>
                    </TouchableOpacity>

                    {/* Noter l'application */}
                    <TouchableOpacity style={styles.modalButton} onPress={rateApp}>
                        <Ionicons name="star" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>Noter l'application</Text>
                    </TouchableOpacity>

                    {/* Bouton de fermeture */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Fenêtre modale de sélection de langue */}
            <Modal animationType="fade" transparent visible={languageModalVisible} onRequestClose={closeLanguageModal}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{i18n.t('language')}</Text>

                        {/* Francais */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'fr' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('fr')}
                        >
                            <Flag code="FR" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Français</Text>
                        </TouchableOpacity>

                        {/* Anglais */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'en' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('en')}
                        >
                            <Flag code="GB" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>English</Text>
                        </TouchableOpacity>

                        {/* Espagnol */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'es' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('es')}
                        >
                            <Flag code="ES" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Español</Text>
                        </TouchableOpacity>

                        {/* Russe */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'ru' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('ru')}
                        >
                            <Flag code="RU" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Русский</Text>
                        </TouchableOpacity>

                        {/* Arabe */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'ar' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('ar')}
                        >
                            <Flag code="SA" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>عربي</Text>
                        </TouchableOpacity>

                        {/* Japonais */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'ja' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('ja')}
                        >
                            <Flag code="JP" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>日本語</Text>
                        </TouchableOpacity>


                        {/* Portugais */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'pt' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('pt')}
                        >
                            <Flag code="PT" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Português</Text>
                        </TouchableOpacity>

                        {/* Italien */}
                        <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'it' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('it')}
                        >
                            <Flag code="IT" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Italiano</Text>
                        </TouchableOpacity>

                        {/* Bouton de fermeture */}
                        <TouchableOpacity onPress={closeLanguageModal} style={styles.closeButton}>
                            <Ionicons name="close" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#fdb441',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        flexDirection: 'row',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
    },
    icon: {
        marginRight: 10,
    },
    flagIcon: {
        width: 30,
        height: 20,
        marginRight: 10,
    },
});