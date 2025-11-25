import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, isFirebaseConfigured } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const PENDING_DATA_KEY = '@pending_game_data';

/**
 * Send completed game data to Firebase Firestore for level creation
 * @param {Object} gameData - The game completion data
 * @param {string} gameData.language - Language code (en, fr, es, etc.)
 * @param {Array<string>} gameData.originalWords - The two original words [word1, word2]
 * @param {Array<string>} gameData.formedWords - All valid words formed during the game
 * @param {number} gameData.score - Final score
 * @param {string} gameData.timestamp - ISO timestamp of completion
 */
export const sendGameData = async (gameData) => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured) {
        console.log('Firebase not configured yet. Data will be stored locally:', gameData);
        await storePendingData(gameData);
        return false;
    }

    try {
        // Add document to Firestore
        const docRef = await addDoc(collection(db, 'game_wins'), gameData);
        console.log('Game data sent to Firebase successfully. Doc ID:', docRef.id);
        return true;
    } catch (error) {
        console.error('Failed to send game data to Firebase:', error);
        // Store locally for retry later
        await storePendingData(gameData);
        return false;
    }
};

/**
 * Store game data locally when sending fails
 */
const storePendingData = async (gameData) => {
    try {
        const existingData = await AsyncStorage.getItem(PENDING_DATA_KEY);
        const pendingArray = existingData ? JSON.parse(existingData) : [];
        pendingArray.push(gameData);
        await AsyncStorage.setItem(PENDING_DATA_KEY, JSON.stringify(pendingArray));
        console.log('Game data stored locally for later sync');
    } catch (error) {
        console.error('Failed to store pending data:', error);
    }
};

/**
 * Retry sending all pending game data to Firebase
 */
export const syncPendingData = async () => {
    if (!isFirebaseConfigured) {
        console.log('Firebase not configured, cannot sync pending data');
        return;
    }

    try {
        const existingData = await AsyncStorage.getItem(PENDING_DATA_KEY);
        if (!existingData) return;

        const pendingArray = JSON.parse(existingData);
        const successfulSends = [];

        for (let i = 0; i < pendingArray.length; i++) {
            const data = pendingArray[i];
            try {
                await addDoc(collection(db, 'game_wins'), data);
                successfulSends.push(i);
            } catch (error) {
                console.error('Failed to sync pending data:', error);
            }
        }

        // Remove successfully sent data
        if (successfulSends.length > 0) {
            const remainingData = pendingArray.filter((_, index) => !successfulSends.includes(index));
            if (remainingData.length === 0) {
                await AsyncStorage.removeItem(PENDING_DATA_KEY);
            } else {
                await AsyncStorage.setItem(PENDING_DATA_KEY, JSON.stringify(remainingData));
            }
            console.log(`Synced ${successfulSends.length} pending game data entries to Firebase`);
        }
    } catch (error) {
        console.error('Error syncing pending data:', error);
    }
};

/**
 * Get count of pending game data entries
 */
export const getPendingDataCount = async () => {
    try {
        const existingData = await AsyncStorage.getItem(PENDING_DATA_KEY);
        if (!existingData) return 0;
        const pendingArray = JSON.parse(existingData);
        return pendingArray.length;
    } catch (error) {
        console.error('Error getting pending data count:', error);
        return 0;
    }
};
