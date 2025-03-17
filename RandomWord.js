import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';

const RandomWord = () => {
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRandomWord = async () => {
        setLoading(true);
        try {
            // const response = await fetch('https://random-word-api.herokuapp.com/word?lang=fr');
            const response = await fetch('https://random-word-api.vercel.app/api?words=1');
            const data = await response.json();
            setWord(data[0].toUpperCase());
        } catch (error) {
            console.error('Erreur récupération du mot:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                word !== null && (
                    <View style={styles.wordContainer}>
                        {word.split('').map((letter, index) => (
                            <View key={index} style={styles.letterBox}>
                                <Text style={styles.letter}>{letter}</Text>
                            </View>
                        ))}
                    </View>
                )
            )}
            <Button title="Générer un mot" onPress={fetchRandomWord} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    wordContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    letterBox: {
        width: 40,
        height: 50,
        margin: 5,
        borderWidth: 2,
        borderColor: '#5f3f31',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    letter: {
        fontSize: 24,
        color: 'orange',
        fontWeight: 'bold',
    },
});

export default RandomWord;