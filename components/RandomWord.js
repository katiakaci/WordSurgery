import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGameTimer } from '../hooks/useGameTimer';
import { useWordGame } from '../hooks/useWordGame';
import { useLevelProgress } from '../hooks/useLevelProgress';
import { fetchRandomWords, getLetterBoxSize, getLetterFontSize } from '../utils/wordUtils';
import { sendGameData } from '../utils/dataCollection';
import TopBar from './TopBar';
import { FirstWordColumn, SecondWordColumn } from './WordColumn';
import WordHistory from './WordHistory';
import BackgroundAnimations from './BackgroundAnimations';
import CustomAlert from './CustomAlert';
import LevelBadge from './LevelBadge';
import HintButton from './HintButton';

const RandomWord = () => {
    const [loading, setLoading] = useState(false);
    const [winAlertConfig, setWinAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: [],
    });
    const navigation = useNavigation();

    // Level progression hook
    const {
        currentLevel,
        totalLevels,
        isBonusMode,
        isLoadingProgress,
        completeLevel,
        getCurrentLevelData
    } = useLevelProgress(i18n.language);

    const {
        words,
        setWords,
        selectedIndices,
        validWordIndices,
        score,
        validatedWords,
        hasInserted,
        insertionPosition,
        alertConfig: gameAlertConfig,
        hideAlert: hideGameAlert,
        selectLettersFirstWord,
        insertLetters,
        selectLettersSecondWord,
        checkWord,
        undoLastAction,
        resetGame,
        originalWords
    } = useWordGame();

    const handleNewGame = useCallback(async () => {
        stopTimer();
        resetGame();
        await loadWords();
        await resetTimer();
    }, [stopTimer, resetGame, loadWords, resetTimer]);

    const {
        timeLeft,
        timerRef,
        alertConfig: timerAlertConfig,
        hideAlert: hideTimerAlert,
        loadTimerSetting,
        startTimer,
        stopTimer,
        resetTimer
    } = useGameTimer(handleNewGame);

    const loadWords = useCallback(async () => {
        setLoading(true);

        // Check if we're in level mode or bonus mode
        const levelData = getCurrentLevelData();

        if (levelData) {
            // Level mode: use predefined words
            setWords(levelData.words);
        } else {
            // Bonus mode: fetch random words from API
            const newWords = await fetchRandomWords(i18n.language);
            setWords(newWords);
        }

        setLoading(false);
    }, [setWords, getCurrentLevelData]);

    useEffect(() => {
        if (!loading && !isLoadingProgress) {
            loadWords();
        }
        return () => stopTimer();
    }, [i18n.language, currentLevel, isLoadingProgress]);

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
            // Level completed!
            if (!isBonusMode) {
                // Complete current level and move to next
                completeLevel().then((nextLevel) => {
                    const isNowBonus = nextLevel > totalLevels;

                    setWinAlertConfig({
                        visible: true,
                        title: i18n.t('level_complete'),
                        message: isNowBonus
                            ? i18n.t('all_levels_complete')
                            : i18n.t('level_complete_message', { level: currentLevel }),
                        type: 'success',
                        buttons: [{
                            text: isNowBonus ? i18n.t('play_bonus') : i18n.t('next_level'),
                            onPress: () => {
                                // Don't call handleNewGame, just reset and the level will auto-load
                                stopTimer();
                                resetGame();
                                resetTimer();
                            }
                        }],
                    });
                });
            } else {
                // Bonus mode win - collect game data
                const gameData = {
                    language: i18n.language,
                    originalWords: originalWords,
                    formedWords: validatedWords,
                    score: score,
                    isBonusMode: true,
                    timestamp: new Date().toISOString()
                };

                // Send data to backend (async, non-blocking)
                sendGameData(gameData);

                setWinAlertConfig({
                    visible: true,
                    title: i18n.t('you_won'),
                    message: i18n.t('you_found_everything'),
                    type: 'success',
                    buttons: [{ text: i18n.t('new_game'), onPress: handleNewGame }],
                });
            }
        }
    }, [words, loading, handleNewGame, isBonusMode, completeLevel, totalLevels, currentLevel, stopTimer, resetGame, resetTimer]);

    const handleBack = () => {
        navigation.navigate("Accueil");
        stopTimer();
        loadTimerSetting();
    };

    const maxLetters = Math.max(words[0]?.length || 0, words[1]?.length || 0);
    const boxSize = getLetterBoxSize(maxLetters);
    const fontSize = getLetterFontSize(boxSize);

    // Get current level data for hint
    const currentLevelData = getCurrentLevelData();

    return (
        <View style={styles.container}>
            <BackgroundAnimations />
            <TopBar
                score={score}
                timeLeft={timeLeft}
                onBack={handleBack}
                onUndo={undoLastAction}
                onRefresh={handleNewGame}
                isLevelMode={!isBonusMode}
            />

            {/* Level Badge */}
            {i18n.language.startsWith('fr') && (
                <LevelBadge
                    currentLevel={currentLevel}
                    totalLevels={totalLevels}
                    isBonusMode={isBonusMode}
                />
            )}

            {/* Hint Button (only in level mode) */}
            {i18n.language.startsWith('fr') && (
                <HintButton
                    hint={currentLevelData?.hint}
                    disabled={isBonusMode}
                />
            )}

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

            <CustomAlert
                visible={gameAlertConfig.visible}
                title={gameAlertConfig.title}
                message={gameAlertConfig.message}
                type={gameAlertConfig.type}
                buttons={gameAlertConfig.buttons}
                onClose={hideGameAlert}
            />

            <CustomAlert
                visible={timerAlertConfig.visible}
                title={timerAlertConfig.title}
                message={timerAlertConfig.message}
                type={timerAlertConfig.type}
                buttons={timerAlertConfig.buttons}
                onClose={hideTimerAlert}
            />

            <CustomAlert
                visible={winAlertConfig.visible}
                title={winAlertConfig.title}
                message={winAlertConfig.message}
                type={winAlertConfig.type}
                buttons={winAlertConfig.buttons}
                onClose={() => setWinAlertConfig(prev => ({ ...prev, visible: false }))}
            />
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
