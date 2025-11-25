import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../languages/i18n';

const TopBar = ({ score, timeLeft, onBack, onUndo, onRefresh, isBonusMode }) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={onBack}>
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>

            <View style={styles.centerTop}>
                <Text style={styles.scoreLabel}>{i18n.t('score')}</Text>
                <Text style={styles.scoreText}>{score}</Text>
            </View>

            <View style={styles.rightTop}>
                <View style={styles.timerWrapper}>
                    <Text style={styles.timerText}>{timeLeft}</Text>
                </View>

                <TouchableOpacity onPress={onUndo}>
                    <Ionicons name="arrow-undo" size={28} color="black" />
                </TouchableOpacity>

                {isBonusMode && (
                    <TouchableOpacity onPress={onRefresh}>
                        <Ionicons name="refresh" size={28} color="black" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        zIndex: 10,
        backgroundColor: 'white',
    },
    centerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    rightTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    scoreLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    scoreText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
    },
    timerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'red',
    },
    timerWrapper: {
        width: 45,
        alignItems: 'center',
        marginRight: 8,
    },
});

export default TopBar;
