import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import i18n from '../languages/i18n';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGameTimer } from '../hooks/useGameTimer';
import { useWordGame } from '../hooks/useWordGame';
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
        originalWords,
        // Système de niveaux
        currentLevel,
        isBonusMode,
        currentHint,
        availableLevels,
        levelsReady,
        loadProgress,
        goToNextLevel,
        loadLevelWords
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

        // Charger les mots du niveau ou du mode bonus
        const levelWords = loadLevelWords();

        if (levelWords && levelWords.length > 0) {
            setWords(levelWords);
        } else {
            // Mode bonus : charger des mots aléatoires
            const newWords = await fetchRandomWords(i18n.language);
            setWords(newWords);
        }

        setLoading(false);
    }, [setWords, loadLevelWords, currentLevel, isBonusMode]);

    useEffect(() => {
        if (!levelsReady) {
            console.log('⏳ [RandomWord] Waiting for levels to be ready...');
            return;
        }
        console.log(`📊 [RandomWord] Level: ${currentLevel}, Bonus: ${isBonusMode}, Lang: ${i18n.language}`);
        loadWords();
        return () => stopTimer();
    }, [i18n.language, currentLevel, isBonusMode, levelsReady]);

    useFocusEffect(
        useCallback(() => {
            loadTimerSetting().then(() => {
                timerRef.current = startTimer();
            });

            return () => stopTimer();
        }, [])
    );

    useEffect(() => {
        if (!loading && words.length > 1 && words[1].length === 0 && originalWords.length > 0) {
            console.log('🏆 [RandomWord] Level completed!');

            const gameData = {
                language: i18n.language,
                originalWords: originalWords && originalWords.length > 0 ? originalWords : words,
                formedWords: validatedWords,
                score: score,
                timestamp: new Date().toISOString()
            };

            sendGameData(gameData);

            // Vérifier si on est en mode niveau ou bonus
            if (!isBonusMode && availableLevels.length > 0) {
                // Mode niveau : vérifier s'il y a encore des niveaux
                if (currentLevel < availableLevels.length) {
                    // Il reste des niveaux
                    console.log(`✨ [RandomWord] Level ${currentLevel} completed!}`);
                    setWinAlertConfig({
                        visible: true,
                        title: i18n.t('level_complete'),
                        message: i18n.t('level_complete_message', { level: currentLevel }),
                        type: 'success',
                        buttons: [{
                            text: i18n.t('next_level'),
                            onPress: async () => {
                                console.log('➡️ [RandomWord] Going to next level...');
                                setWinAlertConfig(prev => ({ ...prev, visible: false }));

                                // Arrêter complètement le timer avant de continuer
                                stopTimer();
                                // Attendre un peu pour être sûr que le timer est arrêté
                                await new Promise(resolve => setTimeout(resolve, 100));
                                resetGame();
                                await goToNextLevel();
                                await resetTimer();
                            }
                        }],
                    });
                } else {
                    // Dernier niveau complété, passage en mode bonus
                    console.log('🎊 [RandomWord] Last level completed! Entering bonus mode');
                    setWinAlertConfig({
                        visible: true,
                        title: i18n.t('level_complete'),
                        message: i18n.t('all_levels_complete'),
                        type: 'success',
                        buttons: [{
                            text: i18n.t('play_bonus'),
                            onPress: async () => {
                                setWinAlertConfig(prev => ({ ...prev, visible: false }));
                                stopTimer();

                                // Attendre un peu pour être sûr que le timer est arrêté
                                await new Promise(resolve => setTimeout(resolve, 100));
                                resetGame();
                                await goToNextLevel(); // Passe en mode bonus
                                await resetTimer();
                            }
                        }],
                    });
                }
            } else {
                // Mode bonus
                setWinAlertConfig({
                    visible: true,
                    title: i18n.t('you_won'),
                    message: i18n.t('you_found_everything'),
                    type: 'success',
                    buttons: [{ text: i18n.t('new_game'), onPress: handleNewGame }],
                });
            }
        }
    }, [words, loading, handleNewGame, originalWords, validatedWords, score, currentLevel, isBonusMode, availableLevels, goToNextLevel, resetGame, stopTimer, resetTimer, timerRef, startTimer]);

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
                isBonusMode={isBonusMode}
            />

            {/* Badge de niveau */}
            {levelsReady && availableLevels.length > 0 && (
                <LevelBadge
                    currentLevel={currentLevel}
                    totalLevels={availableLevels.length}
                    isBonusMode={isBonusMode}
                />
            )}

            {/* Bouton d'indice */}
            <HintButton
                hint={currentHint}
                disabled={isBonusMode}
            />

            {loading ? (
                <LottieView
                    source={require('../assets/animation/loading.json')}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
            ) : (
                <>
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

                    <WordHistory validatedWords={validatedWords} />

                    <TouchableOpacity style={styles.checkButton} onPress={checkWord}>
                        <Text style={styles.buttonText}>{i18n.t('word_found')}</Text>
                    </TouchableOpacity>
                </>
            )}

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
