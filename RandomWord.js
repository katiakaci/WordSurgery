import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

const RandomWord = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState([]);

    const fetchRandomWords = async () => {
        setLoading(true);
        try {
            // const response = await fetch('https://random-word-api.herokuapp.com/word?lang=fr');
            const response = await fetch('https://random-word-api.vercel.app/api?words=2');
            const data = await response.json();
            setWords(data); // API renvoie un tableau avec 2 mots
            setSelectedIndices([]);
        } catch (error) {
            console.error('Erreur récupération des mots:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomWords();
    }, []);

    const toggleLetterSelection = (index) => {
        setSelectedIndices((prev) => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index); // Désélectionne
            } else if (prev.length === 0 || prev[prev.length - 1] === index - 1) {
                return [...prev, index]; // Ajoute uniquement si contigu
            }
            return prev; // Ignore si ce n'est pas contigu
        });
    };

    const insertLetters = (position) => {
        if (selectedIndices.length === 0) return;

        const firstWord = words[0].split('');
        const secondWord = words[1].split('');

        const selectedLetters = selectedIndices.map(i => firstWord[i]);
        const newFirstWord = firstWord.filter((_, i) => !selectedIndices.includes(i));
        const newSecondWord = [
            ...secondWord.slice(0, position),
            ...selectedLetters,
            ...secondWord.slice(position)
        ];

        setWords([newFirstWord.join(''), newSecondWord.join('')]);
        setSelectedIndices([]); // Réinitialise la sélection
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <>
                    <View style={styles.wordContainer}>
                        {words.length > 0 && words[0].split('').map((letter, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.letterBox, selectedIndices.includes(i) && styles.selectedBox]}
                                onPress={() => toggleLetterSelection(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.wordContainer}>
                        {words.length > 1 && words[1].split('').map((letter, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.letterBox}
                                onPress={() => insertLetters(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
            <Button title="Recommencer" onPress={fetchRandomWords} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        alignItems: 'center',
        // paddingVertical: 20,
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
        marginHorizontal: 20,
    },
    letterBox: {
        width: 40,
        height: 45,
        borderWidth: 2,
        borderColor: '#5f3f31',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    selectedBox: {
        backgroundColor: '#fcf49f',
    },
    letter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'orange',
    },
});

export default RandomWord;