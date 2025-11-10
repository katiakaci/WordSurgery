import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import frenchWords from '../assets/dictionaries/fr.json';
import englishWords from '../assets/dictionaries/en.json';
import spanishWords from '../assets/dictionaries/es.json';
import italiensWords from '../assets/dictionaries/it.json';
import deutchWords from '../assets/dictionaries/de.json';

const RandomWord = () => {
    const [words, setWords] = useState([]); // Contient les deux mots
    const [loading, setLoading] = useState(false); // Indicateur de chargement
    const [selectedIndices, setSelectedIndices] = useState([]); // Indices des lettres sélectionnées dans le premier mot
    const [validWordIndices, setValidWordIndices] = useState([]); // Indices des lettres sélectionnées dans le second mot
    const [history, setHistory] = useState([]); // Historique des actions pour annuler
    const [score, setScore] = useState(0); // Score initial du jeu
    const [language] = useState(i18n.language);
    const [hasInserted, setHasInserted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [scoreHistory, setScoreHistory] = useState([0]);
    const [validatedWords, setValidatedWords] = useState([]);
    const [insertionPosition, setInsertionPosition] = useState(null);

    const navigation = useNavigation();
    const timerRef = useRef(null);

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
            else if (currentLanguage === 'fr') { // Francais
                let apiUrl = 'https://trouve-mot.fr/api/random/2';
                const response = await fetch(apiUrl);
                const data = await response.json();
                const mots = data.map(item => item.name);
                setWords(mots);
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
                // if (currentLanguage === 'fr') apiUrl += "/french"
                if (currentLanguage === 'es') apiUrl += "/spanish"
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
            // TODO Mettre alerte au user que sa langue n'est pas dispo donc on va en anglais
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

        return () => clearInterval(timerRef.current);
    }, [language]);

    useFocusEffect(
        useCallback(() => {
            // Quand on entre dans la page
            loadTimerSetting().then(() => {
                timerRef.current = startTimer();
            });

            return () => {
                // Quand on quitte la page
                clearInterval(timerRef.current);
            };
        }, [])
    );

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
        setInsertionPosition(position);
        setTimeout(() => setInsertionPosition(null), 1500); // flèche disparaît après 1.5s
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
        setScoreHistory([...scoreHistory, score]);
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

    const getWordsForLang = (lang) => {
        if (lang.startsWith('fr')) return frenchWords;
        else if (lang.startsWith('es')) return spanishWords;
        else if (lang.startsWith('it')) return italiensWords;
        else if (lang.startsWith('de')) return deutchWords;
        return englishWords;
    };

    const checkWord = () => {
        const secondWord = words[1];
        const selectedLetters = validWordIndices.map(i => secondWord[i]).join('');

        if (selectedLetters.length < 3) {
            Alert.alert(i18n.t('word_too_short_title'), i18n.t('word_too_short_message'));
            return;
        }

        const currentLang = i18n.language;
        const wordList = getWordsForLang(currentLang);

        const isValid = wordList.includes(selectedLetters.toLowerCase());

        if (isValid) {
            Alert.alert(i18n.t('word_found_title'), i18n.t('word_valid', { word: selectedLetters }));

            // Calcul du score
            const newScore = score + selectedLetters.length;
            setScore(newScore);

            // Ajoute le mot validé à l'historique
            setValidatedWords(prev => [...prev, selectedLetters]);

            // Mise à jour du mot
            const newSecondWord = secondWord
                .split('')
                .filter((_, i) => !validWordIndices.includes(i))
                .join('');
            setWords([words[0], newSecondWord]);
        } else {
            Alert.alert(i18n.t('word_not_valid_title'), i18n.t('word_invalid', { word: selectedLetters }));
        }

        setValidWordIndices([]); // Réinitialise la sélection des lettres après l'alerte
    };

    const undoLastAction = () => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setWords(lastState.words);
        setSelectedIndices(lastState.selectedIndices);
        setHistory(history.slice(0, -1));
        setScore(scoreHistory[scoreHistory.length - 2] || 0); // Restaure le score précédent
        setScoreHistory(scoreHistory.slice(0, -1)); // Supprime le dernier score de l'historique
    };

    const startTimer = () => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    Alert.alert(
                        i18n.t('elapsed_time'),
                        i18n.t('you_lost'),
                        [
                            {
                                text: 'OK',
                                onPress: () => newGame()
                            }
                        ]
                    );
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return timer;
    };

    const newGame = async () => {
        clearInterval(timerRef.current); // stop ancien timer
        setScore(0);
        await loadTimerSetting();        // attends que le timer soit mis à jour
        fetchRandomWords();
        timerRef.current = startTimer(); // démarrer avec le bon timeLeft
        setValidatedWords([]);          // reset mots trouvés
    };

    const loadTimerSetting = async () => {
        const value = await AsyncStorage.getItem('@game_timer_seconds');
        const seconds = parseInt(value);
        setTimeLeft(!isNaN(seconds) && seconds > 0 ? seconds : 120);
    };

    const getLetterBoxSize = () => {
        const maxLetters = Math.max(words[0]?.length || 0, words[1]?.length || 0);
        if (maxLetters >= 7) return 24;
        if (maxLetters >= 10) return 30;
        return 40;
    };

    const getLetterFontSize = () => {
        const size = getLetterBoxSize();
        return size * 0.5 + 4; // ajustement visuel
    };

    useEffect(() => {
        if (!loading && words.length > 1 && words[1].length === 0) {
            Alert.alert(i18n.t('you_won'), i18n.t('you_found_everything'), [
                {
                    text: i18n.t('new_game'),
                    onPress: () => newGame()
                }
            ]);
        }
    }, [words, loading]);

    return (
        <View style={styles.container}>
            {/* Animations background */}
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation} />
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation2} />
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation3} />

            {/* Barre supérieure fixe */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Accueil");
                    clearInterval(timerRef.current);
                    loadTimerSetting()
                }}>
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

                    <TouchableOpacity onPress={undoLastAction}>
                        <Ionicons name="arrow-undo" size={28} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={newGame}>
                        <Ionicons name="refresh" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                // loading animation
                <LottieView source={require('../assets/animation/loading.json')} autoPlay loop style={styles.loadingAnimation} />
            ) : (
                <View style={styles.wordsContainer}>
                    {/* Premier mot (colonne gauche) */}
                    <ScrollView style={{ maxHeight: '80%' }} contentContainerStyle={styles.column} showsVerticalScrollIndicator={false}>
                        {words.length > 0 && words[0]?.split('').map((letter, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.letterBox, selectedIndices.includes(i) && styles.selectedBox]}
                                onPress={() => selectLettersFirstWord(i)}
                            >
                                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {insertionPosition !== null && (
                        <View style={{ position: 'absolute', top: '45%', left: '48%', zIndex: 5 }}>
                            <Text style={{ fontSize: 40, color: '#9be69d', fontWeight: 'bold' }}>→</Text>
                        </View>
                    )}

                    {/* Deuxième mot (colonne droite) */}
                    <ScrollView style={{ maxHeight: '80%' }} contentContainerStyle={styles.column} showsVerticalScrollIndicator={false}>
                        {words.length > 1 && (() => {
                            const letters = words[1]?.split('');
                            const interleaved = [];

                            for (let i = 0; i <= letters.length; i++) {
                                interleaved.push(
                                    <TouchableOpacity
                                        key={`gap-${i}`}
                                        style={styles.insertionGap}
                                        onPress={() => insertLetters(i)}
                                    />
                                );

                                if (i < letters.length) {
                                    interleaved.push(
                                        <TouchableOpacity
                                            key={`letter-${i}`}
                                            style={[
                                                styles.letterBox,
                                                { width: getLetterBoxSize(), height: getLetterBoxSize() },
                                                validWordIndices.includes(i) && styles.validLetterBox
                                            ]}
                                            onPress={() => selectLettersSecondWord(i)}
                                        >
                                            <Text style={[styles.letter, { fontSize: getLetterFontSize() }]}>{letters[i].toUpperCase()}</Text>
                                        </TouchableOpacity>
                                    );
                                }
                            }

                            return interleaved;
                        })()}
                    </ScrollView>
                </View>
            )}

            <View style={{ marginVertical: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>{i18n.t('history')}</Text>
                {validatedWords.length === 0 ? (
                    <Text style={{ fontStyle: 'italic' }}>{i18n.t('no_word_found')}</Text>
                ) : (
                    validatedWords.map((word, index) => (
                        <Text key={index} style={{ fontSize: 16 }}>{index + 1}. {word}</Text>
                    ))
                )}
            </View>
            <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
                <Text style={styles.buttonText}>{i18n.t('word_found')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    rightTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
        gap: 20,
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
        backgroundColor: '#32CD32',
        borderColor: '#228B22',
    },
    letter: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d14b28',
    },
    checkButton: {
        backgroundColor: '#9be69d',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginBottom: 50,
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
        width: '150%',
        height: '150%',
        position: 'absolute',
        right: 0,
        top: 10,
        transform: [{ rotate: '180deg' }],
    },
    animation2: {
        width: '150%',
        height: '150%',
        position: 'absolute',
        top: -150,
        right: -110,
        transform: [{ rotate: '180deg' }],
    },
    animation3: {
        width: '150%',
        height: '150%',
        position: 'absolute',
        top: -100,
        right: -110,
        transform: [{ rotate: '40deg' }],
    },
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
    insertionGap: {
        height: 20,
        width: 40,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    centerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    timerWrapper: {
        width: 45,
        alignItems: 'center',
        marginRight: 8
    },
});

export default RandomWord;
