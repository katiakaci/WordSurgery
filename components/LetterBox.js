import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const LetterBox = ({ letter, isSelected, isValid, size, fontSize, onPress }) => {
    return (
        <TouchableOpacity
            style={[
                styles.letterBox,
                size && { width: size, height: size },
                isSelected && styles.selectedBox,
                isValid && styles.validLetterBox,
            ]}
            onPress={onPress}
        >
            <Text style={[styles.letter, fontSize && { fontSize }]}>
                {letter.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    letterBox: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: '#d14b28',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    selectedBox: {
        backgroundColor: '#ffd580',
        borderColor: '#ffae42',
    },
    validLetterBox: {
        backgroundColor: '#32CD32',
        borderColor: '#228B22',
    },
    letter: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d14b28',
    },
});

export default LetterBox;
