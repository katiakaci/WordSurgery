import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGameTimer } from '../hooks/useGameTimer';
import { useWordGame } from '../hooks/useWordGame';
import { fetchRandomWords, getLetterBoxSize, getLetterFontSize } from '../utils/wordUtils';
import TopBar from './TopBar';
import { FirstWordColumn, SecondWordColumn } from './WordColumn';
import WordHistory from './WordHistory';
import BackgroundAnimations from './BackgroundAnimations';

const RandomWord = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const {
        words,
        setWords,
        selectedIndices,
        validWordIndices,
        score,
        validatedWords,
        hasInserted,
        insertionPosition,
        selectLettersFirstWord,
        insertLetters,
        selectLettersSecondWord,
        checkWord,
        undoLastAction,
        resetGame
    } = useWordGame();

    const handleNewGame = useCallback(async () => {
        stopTimer();
        resetGame();
        await loadWords();
        await resetTimer();
    }, []);

    const {
        timeLeft,
        timerRef,
        loadTimerSetting,
        startTimer,
        stopTimer,
        resetTimer
    } = useGameTimer(handleNewGame);

    const loadWords = useCallback(async () => {
        setLoading(true);
        const newWords = await fetchRandomWords(i18n.language);
        setWords(newWords);
        setLoading(false);
    }, [setWords]);

    useEffect(() => {
        loadWords();
        return () => stopTimer();
    }, [i18n.language]);

    useFocusEffect(
        useCallback(() => {
            loadTimerSetting().then(() => {
                timerRef.current = startTimer();
            });

            return () => stopTimer();
        }, [])
    );

    useEffect(() => {
        if (!loading && words.length > 1 && words[1].length === 0) {
            Alert.alert(i18n.t('you_won'), i18n.t('you_found_everything'), [
                { text: i18n.t('new_game'), onPress: handleNewGame }
            ]);
        }
    }, [words, loading, handleNewGame]);

    const handleBack = () => {
        navigation.navigate("Accueil");
        stopTimer();
        loadTimerSetting();
    };

    const maxLetters = Math.max(words[0]?.length || 0, words[1]?.length || 0);
    const boxSize = getLetterBoxSize(maxLetters);
    const fontSize = getLetterFontSize(boxSize);

    return (
        <View style={styles.container}>
            <BackgroundAnimations />

            <TopBar
                score={score}
                timeLeft={timeLeft}
                onBack={handleBack}
                onUndo={undoLastAction}
                onRefresh={handleNewGame}
            />

            {loading ? (
                <LottieView
                    source={require('../assets/animation/loading.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
            ) : (
                <View style={styles.wordsContainer}>
                    <FirstWordColumn
                        word={words[0]}
                        selectedIndices={selectedIndices}
                        onSelectLetter={selectLettersFirstWord}
                    />

                    {insertionPosition !== null && (
                        <View style={styles.insertionArrow}>
                            <Text style={styles.arrowText}>→</Text>
                        </View>
                    )}

                    <SecondWordColumn
                        word={words[1]}
                        validWordIndices={validWordIndices}
                        boxSize={boxSize}
                        fontSize={fontSize}
                        onSelectLetter={selectLettersSecondWord}
                        onInsertLetters={insertLetters}
                    />
                </View>
            )}

            <WordHistory validatedWords={validatedWords} />

            <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
                <Text style={styles.buttonText}>{i18n.t('word_found')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
    insertionArrow: {
        position: 'absolute',
        top: '45%',
        left: '48%',
        zIndex: 5,
    },
    arrowText: {
        fontSize: 40,
        color: '#9be69d',
        fontWeight: 'bold',
    },
});

export default RandomWord;
