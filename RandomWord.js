import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import i18n from './languages/i18n';

const RandomWord = () => {
    const [words, setWords] = useState([]); // Contient les deux mots
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const [selectedIndices, setSelectedIndices] = useState([]); // Indices des lettres sélectionnées dans le premier mot
    const [validWordIndices, setValidWordIndices] = useState([]); // Indices des lettres sélectionnées dans le second mot
    const [history, setHistory] = useState([]); // Historique des actions pour annuler
    const [score, setScore] = useState(0); // Score initial du jeu

    const fetchRandomWords = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://random-word-api.vercel.app/api?words=2');
            const data = await response.json();
            setWords(data); // API renvoie deux mots
            setSelectedIndices([]); // Réinitialisation des indices sélectionnés
            setValidWordIndices([]); // Réinitialisation des indices des mots validés
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

        setWords(newWords);
        setSelectedIndices([]); // Réinitialise la sélection
        setValidWordIndices([]); // Réinitialise les indices du mot valide
        setHistory(newHistory);
    };

    const toggleLetterSelectionInSecondWord = (index) => {
        setValidWordIndices((prev) => {
            // Si la lettre est déjà sélectionnée, on peut la désélectionner seulement si c'est la première ou la dernière lettre
            if (prev.includes(index)) {
                if (index === prev[0] || index === prev[prev.length - 1]) {
                    return prev.filter(i => i !== index); // Désélectionne uniquement si c'est le premier ou le dernier
                }
                return prev; // Ne permet pas de désélectionner si la lettre est au milieu
            }

            // Si la sélection est vide, on peut ajouter cette lettre
            if (prev.length === 0) {
                return [index];
            }

            // Si la lettre est consécutive à la sélection précédente (uniquement de gauche à droite)
            if (index === prev[prev.length - 1] + 1) {
                return [...prev, index];
            }

            return prev; // Ignore si la lettre n'est pas contiguë ou n'est pas à la suite
        });
    };

    const checkWord = () => {
        const secondWord = words[1];
        const selectedLetters = validWordIndices.map(i => secondWord[i]).join('');

        // Vérifie si le mot sélectionné existe dans le dictionnaire
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedLetters}`)
            .then(response => response.json())
            .then(data => {
                if (data.title === 'No Definitions Found') {
                    Alert.alert('Mot non valide', `${selectedLetters} n'est pas un mot valide.`);
                    setValidWordIndices([]); // Réinitialise la sélection des lettres après l'alerte
                } else {
                    // Si le mot est valide
                    Alert.alert('Mot trouvé', `${selectedLetters} est un mot valide.`);

                    // Calcul du score
                    const newScore = score + selectedLetters.length;
                    setScore(newScore);

                    // Mise à jour du mot
                    const newSecondWord = secondWord.split('')
                        .filter((_, i) => !validWordIndices.includes(i))
                        .join('');
                    setWords([words[0], newSecondWord]);
                    setValidWordIndices([]); // Réinitialise les indices des lettres validées après l'alerte
                }
            })
            .catch(error => {
                console.error('Erreur API de vérification de mot:', error);
                Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification du mot.');
                setValidWordIndices([]); // Réinitialise la sélection des lettres en cas d'erreur
            });
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
                    <Text style={styles.scoreText}>Score: {score}</Text>

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
                                style={[styles.letterBox, validWordIndices.includes(i) && styles.validLetterBox]}
                                onPress={() => toggleLetterSelectionInSecondWord(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => {
                        fetchRandomWords();
                        setScore(0); // Réinitialisation du score à 0
                    }}
                    >
                        <Text style={styles.buttonText}>{i18n.t('again')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={undoLastAction}>
                        <Text style={styles.buttonText}>{i18n.t('undo')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={checkWord}>
                        <Text style={styles.buttonText}>Mot trouvé</Text>
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
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff6f61',
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
    validLetterBox: {
        backgroundColor: '#32CD32', // Vert
        borderColor: '#228B22', // Vert foncé
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
        backgroundColor: '#f39c12',
    },
    checkButton: {
        backgroundColor: '#27ae60',
    },
});

export default RandomWord;
