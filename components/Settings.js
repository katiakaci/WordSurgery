import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../languages/i18n';
import { useSettings } from '../hooks/useSettings';
import { shareGame, rateApp } from '../utils/appUtils';
import SettingsButton from './SettingsButton';
import LanguageModal from './LanguageModal';
import TimerModal from './TimerModal';

export default function Settings({ isVisible, onClose, isMusicEnabled, setIsMusicEnabled }) {
    const [settingsModalVisible, setSettingsModalVisible] = useState(isVisible);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [timerModalVisible, setTimerModalVisible] = useState(false);

    const { currentLanguage, changeLanguage, toggleMusic } = useSettings(setIsMusicEnabled);

    useEffect(() => {
        setSettingsModalVisible(isVisible);
    }, [isVisible]);

    const handleToggleMusic = () => {
        toggleMusic(isMusicEnabled);
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent
                visible={settingsModalVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{i18n.t('settings')}</Text>

                        <SettingsButton
                            iconName="language"
                            text={i18n.t('language')}
                            onPress={() => setLanguageModalVisible(true)}
                        />

                        <SettingsButton
                            iconName={isMusicEnabled ? "volume-high" : "volume-mute"}
                            text={isMusicEnabled ? i18n.t('disableMusic') : i18n.t('enableMusic')}
                            onPress={handleToggleMusic}
                        />

                        <SettingsButton
                            iconName="time"
                            text={i18n.t('edit_timer')}
                            onPress={() => setTimerModalVisible(true)}
                        />

                        <SettingsButton
                            iconName="share-social"
                            text={i18n.t('shareApp')}
                            onPress={shareGame}
                        />

                        <SettingsButton
                            iconName="star"
                            text={i18n.t('rateApp')}
                            onPress={rateApp}
                        />

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <LanguageModal
                visible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                currentLanguage={currentLanguage}
                onSelectLanguage={changeLanguage}
            />

            <TimerModal
                visible={timerModalVisible}
                onClose={() => setTimerModalVisible(false)}
            />
        </>
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
    closeButton: {
        marginTop: 10,
    },
});