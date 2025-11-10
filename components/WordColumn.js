import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import LetterBox from './LetterBox';

const InsertionGap = ({ onPress }) => (
    <TouchableOpacity style={styles.insertionGap} onPress={onPress} />
);

export const FirstWordColumn = ({ word, selectedIndices, onSelectLetter }) => {
    return (
        <ScrollView
            style={{ maxHeight: '80%' }}
            contentContainerStyle={styles.column}
            showsVerticalScrollIndicator={false}
        >
            {word?.split('').map((letter, i) => (
                <LetterBox
                    key={i}
                    letter={letter}
                    isSelected={selectedIndices.includes(i)}
                    onPress={() => onSelectLetter(i)}
                />
            ))}
        </ScrollView>
    );
};

export const SecondWordColumn = ({
    word,
    validWordIndices,
    boxSize,
    fontSize,
    onSelectLetter,
    onInsertLetters
}) => {
    const letters = word?.split('') || [];
    const interleaved = [];

    for (let i = 0; i <= letters.length; i++) {
        interleaved.push(
            <InsertionGap
                key={`gap-${i}`}
                onPress={() => onInsertLetters(i)}
            />
        );

        if (i < letters.length) {
            interleaved.push(
                <LetterBox
                    key={`letter-${i}`}
                    letter={letters[i]}
                    isValid={validWordIndices.includes(i)}
                    size={boxSize}
                    fontSize={fontSize}
                    onPress={() => onSelectLetter(i)}
                />
            );
        }
    }

    return (
        <ScrollView
            style={{ maxHeight: '80%' }}
            contentContainerStyle={styles.column}
            showsVerticalScrollIndicator={false}
        >
            {interleaved}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    insertionGap: {
        height: 20,
        width: 40,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
});
