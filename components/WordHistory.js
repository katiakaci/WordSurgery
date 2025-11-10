import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../languages/i18n';

const WordHistory = ({ validatedWords }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('history')}</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    noWords: {
        fontStyle: 'italic',
    },
    word: {
        fontSize: 16,
    },
});

export default WordHistory;
