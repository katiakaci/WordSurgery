import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../languages/i18n';

const LevelBadge = ({ currentLevel, totalLevels, isBonusMode }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.badge, isBonusMode && styles.bonusBadge]}>
                <Text style={styles.badgeText}>
                    {isBonusMode 
                        ? i18n.t('bonus_mode')
                        : `${i18n.t('level')} ${currentLevel}`
                    }
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    badge: {
        backgroundColor: '#9be69d',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bonusBadge: {
        backgroundColor: '#fdb441',
    },
    badgeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LevelBadge;
