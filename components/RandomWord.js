import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RandomWord = () => {
    const [words, setWords] = useState([]); // Contient les deux mots
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const [selectedIndices, setSelectedIndices] = useState([]); // Indices des lettres sélectionnées dans le premier mot
    const [validWordIndices, setValidWordIndices] = useState([]); // Indices des lettres sélectionnées dans le second mot
    const [history, setHistory] = useState([]); // Historique des actions pour annuler
    const [score, setScore] = useState(0); // Score initial du jeu
    const [language] = useState(i18n.language);
    const [hasInserted, setHasInserted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const navigation = useNavigation();

    const fetchRandomWords = async () => {
        const currentLanguage = i18n.language;
        setLoading(true);
        try {
            if (currentLanguage === 'en') { // Anglais
                let apiUrl = 'https://random-word-api.vercel.app/api?words=2';
                const response = await fetch(apiUrl);
                const data = await response.json();
                setWords(data);
            }
            else if (currentLanguage === 'it' || currentLanguage === 'pt_br') { // Italien et portugais brézilien
                const apiLanguage = currentLanguage === "pt_br" ? "pt-br" : currentLanguage;
                let apiUrl = `https://random-word-api.herokuapp.com/word?lang=${apiLanguage}&number=2`
                const response = await fetch(apiUrl);
                const data = await response.json();
                setWords(data);
            }
            else {
                let apiUrl = "https://random-words-api.vercel.app/word"; // Anglais
                if (currentLanguage === 'fr') apiUrl += "/french"
                else if (currentLanguage === 'es') apiUrl += "/spanish"
                else if (currentLanguage === 'de') apiUrl += "/dutch"
                else if (currentLanguage === 'zh') apiUrl += "/chinese"
                else if (currentLanguage === 'ja') apiUrl += "/japanese"
                else if (currentLanguage === 'tr') apiUrl += "/turkish"

                // Récupérer le premier mot
                const response1 = await fetch(apiUrl);
                const data1 = await response1.json();
                const word1 = data1[0]?.word;

                // Récupérer le second mot
                const response2 = await fetch(apiUrl);
                const data2 = await response2.json();
                const word2 = data2[0]?.word;
                setWords([word1, word2]);
            }
            setSelectedIndices([]); // Réinitialisation des indices sélectionnés
            setValidWordIndices([]); // Réinitialisation des indices des mots validés
            setHasInserted(false);
        } catch (error) {
            console.error('Erreur récupération des mots:', error);
            console.error('On bascule en anglais');
            // TODO Mettre alerte au user que sa langue est pas dispo donc on va en anglais
            let apiBackup = 'https://random-word-api.vercel.app/api?words=2'; // en anglais seulement
            const response = await fetch(apiBackup);
            const data = await response.json();
            setWords(data);
            setSelectedIndices([]); // Réinitialisation des indices sélectionnés
            setValidWordIndices([]); // Réinitialisation des indices des mots validés
            setHasInserted(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomWords();
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer); // Arrête le timer
                    Alert.alert('Temps écoulé', 'Vous avez perdu');
                    return 0; // Réinitialise le temps
                }
                return prevTime - 1;
            });
        }, 1000); // Met à jour toutes les secondes

        return () => clearInterval(timer); // Nettoyage à la fin
    }, [language]); // Recharger les mots quand la langue change

    const selectLettersFirstWord = (index) => {
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

        const firstWord = words[0]?.split('');
        const secondWord = words[1]?.split('');

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
        setHasInserted(true);
    };

    const selectLettersSecondWord = (index) => {
        if (!hasInserted) return;
        setValidWordIndices((prev) => {
            // Si la lettre est déjà sélectionnée, on peut la désélectionner seulement si c'est la première ou la dernière lettre de la sélection
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
        if (selectedLetters.length >= 3) {
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
        }
        else Alert.alert('Mot trop court', "Veuillez sélectionner au moins 3 lettres");
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
            {/* Animations background */}
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation} />

            {/* Barre supérieure fixe */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate("Accueil")}>
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.scoreText}>{score}</Text>
                <TouchableOpacity onPress={undoLastAction}>
                    <Ionicons name="arrow-undo" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    fetchRandomWords();
                    setScore(0);
                    setTimeLeft(30); // Réinitialiser le timer
                }}>
                    <Ionicons name="refresh" size={28} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{timeLeft} sec</Text>
            </View>

            {loading ? (
                // loading animation
                <LottieView source={require('../assets/animation/loading.json')} autoPlay loop style={styles.loadingAnimation} />
            ) : (
                <View style={styles.wordsContainer}>
                    {/* Premier mot (colonne gauche) */}
                    <View style={styles.column}>
                        {words.length > 0 && words[0]?.split('').map((letter, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.letterBox, selectedIndices.includes(i) && styles.selectedBox]}
                                onPress={() => selectLettersFirstWord(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Deuxième mot (colonne droite) */}
                    <View style={styles.column}>
                        {words.length > 1 && words[1]?.split('').map((letter, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.letterBox, validWordIndices.includes(i) && styles.validLetterBox]}
                                onPress={() => insertLetters(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
                <Text style={styles.buttonText}>Mot trouvé</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        marginTop: 100,
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
    },

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
        backgroundColor: '#32CD32', // Vert
        borderColor: '#228B22', // Vert foncé
    },
    letter: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d14b28',
    },
    checkButton: {
        backgroundColor: '#9be69d',
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    loadingAnimation: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
    },
    animation: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 40,
        zIndex: 10,
        backgroundColor: 'white',
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
    timerContainer: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        zIndex: 11,
    },
    timerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'red',
    },
});

export default RandomWord;
