import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Flag from 'react-native-flags';
import i18n from '../languages/i18n';

const LANGUAGES = [
    { code: 'fr', flag: 'FR', name: 'Français' },
    { code: 'en', flag: 'GB', name: 'English' },
    { code: 'es', flag: 'ES', name: 'Español' },
    { code: 'ja', flag: 'JP', name: '日本語' },
    { code: 'tr', flag: 'TR', name: 'Türkçe' },
    { code: 'zh', flag: 'CN', name: '中文' },
    { code: 'pt_br', flag: 'BR', name: 'Português' },
    { code: 'it', flag: 'IT', name: 'Italiano' },
    { code: 'de', flag: 'DE', name: 'Deutsch' },
];

const LanguageModal = ({ visible, onClose, currentLanguage, onSelectLanguage }) => {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
                    <Text style={styles.modalTitle}>{i18n.t('language')}</Text>

                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.languageButton,
                                    currentLanguage === lang.code && styles.selectedLanguage
                                ]}
                                onPress={() => onSelectLanguage(lang.code)}
                            >
                                <Flag code={lang.flag} style={styles.flagIcon} />
                                <Text style={styles.languageText}>{lang.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
    languageButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#fdb441',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        flexDirection: 'row',
    },
    selectedLanguage: {
        backgroundColor: '#9be69d',
    },
    languageText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
    },
    flagIcon: {
        width: 30,
        height: 20,
        marginRight: 10,
    },
});

export default LanguageModal;
