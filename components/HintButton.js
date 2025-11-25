import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from './CustomAlert';
import i18n from '../languages/i18n';

const HintButton = ({ hint, disabled }) => {
    const [showHint, setShowHint] = useState(false);

    if (disabled || !hint) {
        return null; // Don't show hint button in bonus mode or if no hint
    }

    return (
        <>
            <TouchableOpacity
                style={styles.hintButton}
                onPress={() => setShowHint(true)}
                activeOpacity={0.7}
            >
                <Ionicons name="bulb-outline" size={28} color="#fdb441" />
            </TouchableOpacity>

            <CustomAlert
                visible={showHint}
                title={i18n.t('hint')}
                message={hint}
                type="info"
                buttons={[
                    { text: 'OK', onPress: () => setShowHint(false) }
                ]}
                onClose={() => setShowHint(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    hintButton: {
        position: 'absolute',
        top: 80,
        right: 20,
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#fdb441',
    },
});

export default HintButton;
