import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsButton = ({ iconName, text, onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Ionicons name={iconName} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#fdb441',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
        flexDirection: 'row',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    icon: {
        marginRight: 10,
    },
});

export default SettingsButton;
