import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

const TimerModal = ({ visible, onClose }) => {
    const [inputSeconds, setInputSeconds] = useState('');

    const handleSave = async () => {
        const value = parseInt(inputSeconds);
        if (isNaN(value) || value <= 5) {
            Alert.alert(i18n.t('error'), i18n.t('enter_valid_number'));
            return;
        }
        await AsyncStorage.setItem('@game_timer_seconds', value.toString());
        Alert.alert(i18n.t('success'), i18n.t('timer_set', { value }));
        setInputSeconds('');
        onClose();
    };

    const handleClose = () => {
        setInputSeconds('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.label}>{i18n.t('enter_timer_duration')}</Text>
                        <TextInput
                            keyboardType="numeric"
                            value={inputSeconds}
                            onChangeText={setInputSeconds}
                            placeholder="Ex: 120"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.buttonText}>{i18n.t('save')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>{i18n.t('undo')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000aa',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    label: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    saveButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#fdb441',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    cancelButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TimerModal;
