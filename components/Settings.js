import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import i18n from '../languages/i18n';
import { useColorScheme, Share, Linking } from 'react-native';
import Flag from 'react-native-flags';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({ isVisible, onClose, isMusicEnabled, setIsMusicEnabled }) {
    const [settingsModalVisible, setSettingsModalVisible] = useState(isVisible);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputUrl, setInputUrl] = useState('');
    const [timerModalVisible, setTimerModalVisible] = useState(false);
    const [inputSeconds, setInputSeconds] = useState('');

    useEffect(() => {
        setSettingsModalVisible(isVisible);
    }, [isVisible]);

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setCurrentLanguage(language);
    };

    const changeDictionnary = () => {
        setModalVisible(true);
        console.log('Changer dictionnaire');
    };

    const toggleMusic = () => {
        setIsMusicEnabled(!isMusicEnabled);
    };

    const toggleDarkMode = () => {
        // TODO
        setDarkMode(!darkMode);
        console.log(darkMode ? 'Mode clair activé' : 'Mode sombre activé');
    };

    const shareGame = async () => {
        try {
            await Share.share({
                message: 'Découvrez WordSurgery, un jeu passionnant! Téléchargez-le ici : https://play.google.com/store/apps/details?id=com.katiakaci.WordSurgery.',
            });
        } catch (error) {
            console.error('Erreur lors du partage :', error);
        }
    };

    const rateApp = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.katiakaci.WordSurgery');
    };

    // const validateAndSaveUrl = async () => {
    //     try {
    //         const response = await fetch(inputUrl);
    //         const data = await response.json();

    //         // On accepte aussi une réponse avec 1 seul mot
    //         const isValid = (
    //             (Array.isArray(data) && data.length >= 1 && typeof data[0] === 'string') ||
    //             (typeof data === 'string') // au cas où certains renvoient juste "mot"
    //         );

    //         if (isValid) {
    //             await AsyncStorage.setItem('@custom_dict_url_' + i18n.language, inputUrl);
    //             Alert.alert(i18n.t('success'), i18n.t('dictionary_saved'));
    //             setModalVisible(false);
    //         } else {
    //             Alert.alert(i18n.t('error'), i18n.t('invalid_word_returned'));
    //         }
    //     } catch (e) {
    //         Alert.alert(i18n.t('error'), i18n.t('invalid_url'));
    //         console.log("Erreur validation URL dictionnaire :", e);
    //     }
    // };

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
                    {/* <TouchableOpacity style={styles.modalButton} onPress={changeDictionnary}>
                        <Ionicons name="book" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('dictionnary')}</Text>
                    </TouchableOpacity> */}

                    {/* Activer/désactiver la musique */}
                    <TouchableOpacity style={styles.modalButton} onPress={toggleMusic}>
                        <Ionicons name={isMusicEnabled ? "volume-high" : "volume-mute"} size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{isMusicEnabled ? i18n.t('disableMusic') : i18n.t('enableMusic')}</Text>
                    </TouchableOpacity>

                    {/* Modifier le timer */}
                    <TouchableOpacity style={styles.modalButton} onPress={() => setTimerModalVisible(true)}>
                        <Ionicons name="time" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('edit_timer')}</Text>
                    </TouchableOpacity>

                    {/* Activer/désactiver le mode sombre */}
                    {/* <TouchableOpacity style={styles.modalButton} onPress={toggleDarkMode}>
                        <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{darkMode ? i18n.t('disableDarkMode') : i18n.t('enableDarkMode')}</Text>
                    </TouchableOpacity> */}

                    {/* Partager le jeu */}
                    <TouchableOpacity style={styles.modalButton} onPress={shareGame}>
                        <Ionicons name="share-social" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('shareApp')}</Text>
                    </TouchableOpacity>

                    {/* Noter l'application */}
                    <TouchableOpacity style={styles.modalButton} onPress={rateApp}>
                        <Ionicons name="star" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.modalButtonText}>{i18n.t('rateApp')}</Text>
                    </TouchableOpacity>

                    {/* Bouton de fermeture */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Fenêtre modale de sélection de langue */}
            <Modal animationType="fade" transparent visible={languageModalVisible} onRequestClose={() => setLanguageModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
                        <Text style={styles.modalTitle}>{i18n.t('language')}</Text>

                        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
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
                            {/* <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'ru' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('ru')}
                        >
                            <Flag code="RU" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>Русский</Text>
                        </TouchableOpacity> */}

                            {/* Arabe */}
                            {/* <TouchableOpacity
                            style={[styles.modalButton, currentLanguage === 'ar' && { backgroundColor: '#9be69d' }]}
                            onPress={() => changeLanguage('ar')}
                        >
                            <Flag code="SA" style={styles.flagIcon} />
                            <Text style={styles.modalButtonText}>عربي</Text>
                        </TouchableOpacity> */}

                            {/* Japonais */}
                            <TouchableOpacity
                                style={[styles.modalButton, currentLanguage === 'ja' && { backgroundColor: '#9be69d' }]}
                                onPress={() => changeLanguage('ja')}
                            >
                                <Flag code="JP" style={styles.flagIcon} />
                                <Text style={styles.modalButtonText}>日本語</Text>
                            </TouchableOpacity>

                            {/* Turc */}
                            <TouchableOpacity
                                style={[styles.modalButton, currentLanguage === 'tr' && { backgroundColor: '#9be69d' }]}
                                onPress={() => changeLanguage('tr')}
                            >
                                <Flag code="TR" style={styles.flagIcon} />
                                <Text style={styles.modalButtonText}>Türkçe</Text>
                            </TouchableOpacity>

                            {/* Chinois */}
                            <TouchableOpacity
                                style={[styles.modalButton, currentLanguage === 'zh' && { backgroundColor: '#9be69d' }]}
                                onPress={() => changeLanguage('zh')}
                            >
                                <Flag code="CN" style={styles.flagIcon} />
                                <Text style={styles.modalButtonText}>中文</Text>
                            </TouchableOpacity>

                            {/* Portugais brézilien */}
                            <TouchableOpacity
                                style={[styles.modalButton, currentLanguage === 'pt_br' && { backgroundColor: '#9be69d' }]}
                                onPress={() => changeLanguage('pt_br')}
                            >
                                <Flag code="BR" style={styles.flagIcon} />
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

                            {/* Allemand */}
                            <TouchableOpacity
                                style={[styles.modalButton, currentLanguage === 'de' && { backgroundColor: '#9be69d' }]}
                                onPress={() => changeLanguage('de')}
                            >
                                <Flag code="DE" style={styles.flagIcon} />
                                <Text style={styles.modalButtonText}>Deutsch</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        {/* Bouton de fermeture */}
                        <TouchableOpacity onPress={() => setLanguageModalVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Fenetre modale pour le dictionnaire */}
            {/* <Modal visible={modalVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                            <Text style={{ marginBottom: 10 }}>{i18n.t('enter_your_dictionnary')} ({i18n.language}) :</Text>
                            <TextInput
                                value={inputUrl}
                                onChangeText={setInputUrl}
                                placeholder="https://exemple.com/dict.json"
                                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
                            />
                            <TouchableOpacity onPress={validateAndSaveUrl} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>{i18n.t('save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#ccc' }]}>
                                <Text style={styles.modalButtonText}>{i18n.t('undo')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal> */}

            {/* Fenetre modale pour le timer */}
            <Modal visible={timerModalVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                            <Text style={{ marginBottom: 10 }}>{i18n.t('enter_timer_duration')}</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={inputSeconds}
                                onChangeText={setInputSeconds}
                                placeholder="Ex: 120"
                                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 }}
                            />
                            <TouchableOpacity
                                onPress={async () => {
                                    const value = parseInt(inputSeconds);
                                    if (isNaN(value) || value <= 5) {
                                        Alert.alert(i18n.t('error'), i18n.t('enter_valid_number'));
                                        return;
                                    }
                                    await AsyncStorage.setItem('@game_timer_seconds', value.toString());
                                    Alert.alert(i18n.t('success'), i18n.t('timer_set', { value }));
                                    setTimerModalVisible(false);
                                }}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>{i18n.t('save')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTimerModalVisible(false)}
                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                            >
                                <Text style={styles.modalButtonText}>{i18n.t('undo')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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