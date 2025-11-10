import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';

const COLORS = {
    green: '#9be69d',
    pink: '#fe73c5',
    yellow: '#ffe270',
    orange: '#fd9468',
};

const CustomAlert = ({ visible, title, message, type = 'info', buttons = [], onClose }) => {
    const getColor = () => {
        switch (type) {
            case 'success': return COLORS.green;
            case 'error': return COLORS.pink;
            case 'warning': return COLORS.orange;
            case 'info': return COLORS.yellow;
            default: return COLORS.yellow;
        }
    };

    const color = getColor();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={[styles.headerBar, { backgroundColor: color }]} />

                    <View style={styles.contentContainer}>
                        {title && (
                            <Text style={[styles.title, { color }]}>{title}</Text>
                        )}
                        {message && (
                            <Text style={styles.message}>{message}</Text>
                        )}
                    </View>

                    <View style={styles.buttonsContainer}>
                        {buttons.length > 0 ? (
                            buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        { backgroundColor: button.style === 'cancel' ? '#ccc' : color },
                                        buttons.length === 1 && styles.singleButton
                                    ]}
                                    onPress={() => {
                                        if (button.onPress) button.onPress();
                                        if (onClose) onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        button.style === 'cancel' && styles.cancelButtonText
                                    ]}>
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.singleButton, { backgroundColor: color }]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    headerBar: {
        height: 8,
        width: '100%',
    },
    contentContainer: {
        padding: 25,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 15,
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    singleButton: {
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#666',
    },
});

export default CustomAlert;
