import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTotalLevels, getLevel } from '../data/levels';

const STORAGE_KEY = '@level_progress_';

export const useLevelProgress = (language) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const [isBonusMode, setIsBonusMode] = useState(false);

    const storageKey = `${STORAGE_KEY}${language}`;
    const totalLevels = getTotalLevels(language);

    /**
     * Load the saved progress for the current language
     */
    const loadProgress = useCallback(async () => {
        try {
            setIsLoadingProgress(true);
            const savedLevel = await AsyncStorage.getItem(storageKey);

            if (savedLevel !== null) {
                const level = parseInt(savedLevel, 10);
                setCurrentLevel(level);

                // Check if we're in bonus mode
                setIsBonusMode(level > totalLevels);
            } else {
                // First time playing this language
                setCurrentLevel(1);
                setIsBonusMode(totalLevels === 0); // If no levels defined, start in bonus mode
            }
        } catch (error) {
            console.error('Error loading level progress:', error);
            setCurrentLevel(1);
            setIsBonusMode(totalLevels === 0);
        } finally {
            setIsLoadingProgress(false);
        }
    }, [language, storageKey, totalLevels]);

    /**
     * Save the current progress
     */
    const saveProgress = useCallback(async (level) => {
        try {
            await AsyncStorage.setItem(storageKey, level.toString());
        } catch (error) {
            console.error('Error saving level progress:', error);
        }
    }, [storageKey]);

    /**
     * Mark current level as completed and move to next
     */
    const completeLevel = useCallback(async () => {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        await saveProgress(nextLevel);

        // Check if entering bonus mode
        if (nextLevel > totalLevels) {
            setIsBonusMode(true);
        }

        return nextLevel;
    }, [currentLevel, saveProgress, totalLevels]);

    /**
     * Reset progress for current language (dev/debug)
     */
    const resetProgress = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(storageKey);
            setCurrentLevel(1);
            setIsBonusMode(totalLevels === 0);
        } catch (error) {
            console.error('Error resetting progress:', error);
        }
    }, [storageKey, totalLevels]);

    /**
     * Get current level data
     */
    const getCurrentLevelData = useCallback(() => {
        if (isBonusMode || totalLevels === 0) {
            return null; // Bonus mode, no predefined level
        }
        return getLevel(language, currentLevel);
    }, [language, currentLevel, isBonusMode, totalLevels]);

    // Load progress when language changes
    useEffect(() => {
        loadProgress();
    }, [loadProgress]);

    return {
        currentLevel,
        totalLevels,
        isBonusMode,
        isLoadingProgress,
        completeLevel,
        resetProgress,
        getCurrentLevelData,
        loadProgress
    };
};
