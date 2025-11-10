import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import i18n from '../languages/i18n';
import { getWordsForLanguage } from '../utils/wordUtils';

export const useWordGame = () => {
    const [words, setWords] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [validWordIndices, setValidWordIndices] = useState([]);
    const [history, setHistory] = useState([]);
    const [score, setScore] = useState(0);
    const [scoreHistory, setScoreHistory] = useState([0]);
    const [validatedWords, setValidatedWords] = useState([]);
    const [hasInserted, setHasInserted] = useState(false);
    const [insertionPosition, setInsertionPosition] = useState(null);

    const selectLettersFirstWord = useCallback((index) => {
        setSelectedIndices((prev) => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else if (prev.length === 0 || prev[prev.length - 1] === index - 1) {
                return [...prev, index];
            }
            return prev;
        });
    }, []);

    const insertLetters = useCallback((position) => {
        if (selectedIndices.length === 0) return;

        setInsertionPosition(position);
        setTimeout(() => setInsertionPosition(null), 1500);

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
        setSelectedIndices([]);
        setValidWordIndices([]);
        setHistory(newHistory);
        setScoreHistory([...scoreHistory, score]);
        setHasInserted(true);
    }, [selectedIndices, words, history, score, scoreHistory]);

    const selectLettersSecondWord = useCallback((index) => {
        if (!hasInserted) return;

        setValidWordIndices((prev) => {
            if (prev.includes(index)) {
                if (index === prev[0] || index === prev[prev.length - 1]) {
                    return prev.filter(i => i !== index);
                }
                return prev;
            }
            if (prev.length === 0) return [index];
            if (index === prev[prev.length - 1] + 1) return [...prev, index];

            return prev;
        });
    }, [hasInserted]);

    const checkWord = useCallback(() => {
        const secondWord = words[1];
        const selectedLetters = validWordIndices.map(i => secondWord[i]).join('');

        if (selectedLetters.length === 0) {
            Alert.alert(i18n.t('no_selection_title'), i18n.t('no_selection_message'));
            return;
        }

        if (selectedLetters.length < 3) {
            Alert.alert(i18n.t('word_too_short_title'), i18n.t('word_too_short_message'));
            return;
        }

        const wordList = getWordsForLanguage(i18n.language);
        const isValid = wordList.includes(selectedLetters.toLowerCase());

        if (isValid) {
            Alert.alert(i18n.t('word_found_title'), i18n.t('word_valid', { word: selectedLetters }));
            const newScore = score + selectedLetters.length;
            setScore(newScore);
            setValidatedWords(prev => [...prev, selectedLetters]);

            const newSecondWord = secondWord
                .split('')
                .filter((_, i) => !validWordIndices.includes(i))
                .join('');
            setWords([words[0], newSecondWord]);
        } else {
            Alert.alert(i18n.t('word_not_valid_title'), i18n.t('word_invalid', { word: selectedLetters }));
        }

        setValidWordIndices([]);
    }, [words, validWordIndices, score]);

    const undoLastAction = useCallback(() => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setWords(lastState.words);
        setSelectedIndices(lastState.selectedIndices);
        setHistory(history.slice(0, -1));
        setScore(scoreHistory[scoreHistory.length - 2] || 0);
        setScoreHistory(scoreHistory.slice(0, -1));
    }, [history, scoreHistory]);

    const resetGame = useCallback(() => {
        setScore(0);
        setValidatedWords([]);
        setHistory([]);
        setScoreHistory([0]);
        setSelectedIndices([]);
        setValidWordIndices([]);
        setHasInserted(false);
    }, []);

    return {
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
    };
};
