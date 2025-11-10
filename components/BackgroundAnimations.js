import React from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const BackgroundAnimations = () => {
    return (
        <>
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation1} />
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation2} />
            <LottieView source={require('../assets/animation/HomePage.json')} autoPlay loop style={styles.animation3} />
        </>
    );
};

const styles = StyleSheet.create({
    animation1: {
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
});

export default BackgroundAnimations;
