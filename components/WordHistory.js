import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../languages/i18n';

const WordHistory = ({ validatedWords }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('history')}</Text>
            <View style={styles.wordsContainer}>
                {validatedWords.length === 0 ? (
                    <Text style={styles.noWords}>{i18n.t('no_word_found')}</Text>
                ) : (
                    validatedWords.map((word, index) => (
                        <Text key={index} style={styles.word}>
                            {index + 1}. {word}
                        </Text>
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        paddingHorizontal: 20,
        width: '100%',
    },
    wordsContainer: {
        width: '100%',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        textAlign: 'center',
    },
    noWords: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
    word: {
        fontSize: 16,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
});

export default WordHistory;
