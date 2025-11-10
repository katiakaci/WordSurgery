import { useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

export const useGameTimer = (onTimeExpired) => {
    const [timeLeft, setTimeLeft] = useState(120);
    const timerRef = useRef(null);
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        buttons: [],
    });

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

    const loadTimerSetting = useCallback(async () => {
        const value = await AsyncStorage.getItem('@game_timer_seconds');
        const seconds = parseInt(value);
        setTimeLeft(!isNaN(seconds) && seconds > 0 ? seconds : 120);
    }, []);

    const startTimer = useCallback(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    showAlert(
                        i18n.t('elapsed_time'),
                        i18n.t('you_lost'),
                        'error',
                        [{ text: 'OK', onPress: onTimeExpired }]
                    );
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return timer;
    }, [onTimeExpired, showAlert]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    const resetTimer = useCallback(async () => {
        stopTimer();
        await loadTimerSetting();
        timerRef.current = startTimer();
    }, [loadTimerSetting, startTimer, stopTimer]);

    return {
        timeLeft,
        timerRef,
        alertConfig,
        hideAlert,
        loadTimerSetting,
        startTimer,
        stopTimer,
        resetTimer
    };
};
