import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';

const RandomWord = () => {
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRandomWord = async () => {
        setLoading(true);
        try {
            // const response = await fetch('https://random-word-api.herokuapp.com/word?lang=fr');
            const response = await fetch('https://random-word-api.vercel.app/api?words=1');
            const data = await response.json();
            setWord(data[0]); // API renvoie un tableau de 1 mot
        } catch (error) {
            console.error('Erreur récupération du mot:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                word !== null ? <Text style={{ fontSize: 24 }}>{word}</Text> : null
            )}
            <Button title="Générer un mot" onPress={fetchRandomWord} />
        </View>
    );
};

export default RandomWord;
