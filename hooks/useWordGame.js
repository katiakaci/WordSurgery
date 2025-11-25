import { useState, useCallback } from 'react';
import i18n from '../languages/i18n';
import { getWordsForLanguage } from '../utils/wordUtils';

export const useWordGame = () => {
    const [words, setWords] = useState([]);
    const [originalWords, setOriginalWords] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [validWordIndices, setValidWordIndices] = useState([]);
    const [history, setHistory] = useState([]);
    const [score, setScore] = useState(0);
    const [scoreHistory, setScoreHistory] = useState([0]);
    const [validatedWords, setValidatedWords] = useState([]);
    const [hasInserted, setHasInserted] = useState(false);
    const [insertionPosition, setInsertionPosition] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: [],
    });

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

        const firstWord = words[0]?.split('');
        const secondWord = words[1]?.split('');

        // Vérifier qu'on ne déplace pas TOUTES les lettres du premier mot (si aucune insertion n'a été faite)
        if (!hasInserted && selectedIndices.length === firstWord.length) {
            showAlert(
                i18n.t('cannot_move_all_letters_title'),
                i18n.t('cannot_move_all_letters_message'),
                'warning'
            );
            return;
        }

        setInsertionPosition(position);
        setTimeout(() => setInsertionPosition(null), 1500);

        const selectedLetters = selectedIndices.map(i => firstWord[i]);
        const newFirstWord = firstWord.filter((_, i) => !selectedIndices.includes(i));
        const newSecondWord = [
            ...secondWord.slice(0, position),
            ...selectedLetters,
            ...secondWord.slice(position)
        ];

        const newWords = [newFirstWord.join(''), newSecondWord.join('')];
        const newHistory = [...history, {
            words: [...words],
            selectedIndices: [...selectedIndices],
            validatedWords: [...validatedWords]
        }];

        setWords(newWords);
        setSelectedIndices([]);
        setValidWordIndices([]);
        setHistory(newHistory);
        setScoreHistory([...scoreHistory, score]);
        setHasInserted(true);
    }, [selectedIndices, words, history, score, scoreHistory, validatedWords, hasInserted, showAlert]);

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

    const showAlert = useCallback((title, message, type = 'info', buttons = []) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            buttons,
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    }, []);

    const checkWord = useCallback(() => {
        const secondWord = words[1];
        const selectedLetters = validWordIndices.map(i => secondWord[i]).join('');

        if (selectedLetters.length === 0) {
            showAlert(i18n.t('no_selection_title'), i18n.t('no_selection_message'), 'warning');
            return;
        }

        if (selectedLetters.length < 3) {
            showAlert(i18n.t('word_too_short_title'), i18n.t('word_too_short_message'), 'warning');
            return;
        }

        // Vérifier si c'est un des mots originaux
        if (originalWords.some(word => word.toLowerCase() === selectedLetters.toLowerCase())) {
            showAlert(i18n.t('original_word_title'), i18n.t('original_word_message'), 'warning');
            setValidWordIndices([]);
            return;
        }

        const wordList = getWordsForLanguage(i18n.language);
        const isValid = wordList.includes(selectedLetters.toLowerCase());

        if (isValid) {
            // Sauvegarder l'état avant la validation du mot
            const newHistory = [...history, {
                words: [...words],
                selectedIndices: [...selectedIndices],
                validatedWords: [...validatedWords]
            }];

            const newScore = score + selectedLetters.length;
            setScore(newScore);
            setValidatedWords(prev => [...prev, selectedLetters]);

            const newSecondWord = secondWord
                .split('')
                .filter((_, i) => !validWordIndices.includes(i))
                .join('');
            setWords([words[0], newSecondWord]);

            setHistory(newHistory);
            setScoreHistory([...scoreHistory, score]);

            // N'afficher l'alerte que si le jeu n'est pas terminé (il reste des lettres)
            if (newSecondWord.length > 0) {
                showAlert(i18n.t('word_found_title'), i18n.t('word_valid', { word: selectedLetters }), 'success');
            }
        } else {
            showAlert(i18n.t('word_not_valid_title'), i18n.t('word_invalid', { word: selectedLetters }), 'error');
        }

        setValidWordIndices([]);
    }, [words, validWordIndices, score, validatedWords, history, scoreHistory, selectedIndices, originalWords, showAlert]);

    const undoLastAction = useCallback(() => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setWords(lastState.words);
        setSelectedIndices(lastState.selectedIndices);
        setValidatedWords(lastState.validatedWords);
        setValidWordIndices([]);
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

    const setWordsWithOriginal = useCallback((newWords) => {
        setWords(newWords);
        // Sauvegarder les mots originaux seulement lors de l'initialisation
        if (newWords.length > 0) {
            setOriginalWords([...newWords]);
        }
    }, []);

    return {
        words,
        setWords: setWordsWithOriginal,
        selectedIndices,
        validWordIndices,
        score,
        validatedWords,
        hasInserted,
        insertionPosition,
        alertConfig,
        hideAlert,
        selectLettersFirstWord,
        insertLetters,
        selectLettersSecondWord,
        checkWord,
        undoLastAction,
        resetGame,
        originalWords
    };
};
