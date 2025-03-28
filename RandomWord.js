import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from './languages/i18n';

const RandomWord = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [history, setHistory] = useState([]);

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

        const newWords = [newFirstWord.join(''), newSecondWord.join('')];
        const newHistory = [...history, { words: [...words], selectedIndices: [...selectedIndices] }];

        // setWords([newFirstWord.join(''), newSecondWord.join('')]);  
        setWords(newWords);
        setSelectedIndices([]); // Réinitialise la sélection
        setHistory(newHistory);
    };

    const undoLastAction = () => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setWords(lastState.words);
        setSelectedIndices(lastState.selectedIndices);
        setHistory(history.slice(0, -1));
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#ff6f61" />
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

                    <TouchableOpacity style={styles.button} onPress={fetchRandomWords}>
                        <Text style={styles.buttonText}>{i18n.t('again')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={undoLastAction}>
                        <Text style={styles.buttonText}>{i18n.t('undo')}</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef8ec',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#d14b28',
        marginBottom: 20,
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    letterBox: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: '#d14b28',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedBox: {
        backgroundColor: '#ffd580',
        borderColor: '#ffae42',
    },
    letter: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#d14b28',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#ff6f61',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    undoButton: {
        backgroundColor: '#ffcc00',
    },
});

export default RandomWord;