import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';

const RandomWord = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRandomWords = async () => {
        setLoading(true);
        try {
            // const response = await fetch('https://random-word-api.herokuapp.com/word?lang=fr');
            const response = await fetch('https://random-word-api.vercel.app/api?words=2');
            const data = await response.json();
            setWords(data); // API renvoie un tableau avec 2 mots
        } catch (error) {
            console.error('Erreur récupération des mots:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomWords();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                words.map((word, index) => (
                    <View key={index} style={styles.wordContainer}>
                        <View style={styles.letterContainer}>
                            {word.split('').map((letter, i) => (
                                <View key={i} style={styles.letterBox}>
                                    <Text style={styles.letter}>{letter.toUpperCase()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))
            )}
            <Button title="Recommencer" onPress={fetchRandomWords} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    wordContainer: {
        marginVertical: 10,
    },
    letterContainer: {
        flexDirection: 'row',
    },
    letterBox: {
        width: 43,
        height: 50,
        borderWidth: 2,
        borderColor: '#5f3f31',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 8
    },
    letter: {
        fontSize: 24,
        color: 'orange',
        fontWeight: 'bold',
    },
});

export default RandomWord;