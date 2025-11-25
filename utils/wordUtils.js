import frenchWords from '../assets/dictionaries/fr.json';
import englishWords from '../assets/dictionaries/en.json';
import spanishWords from '../assets/dictionaries/es.json';
import italianWords from '../assets/dictionaries/it.json';
import germanWords from '../assets/dictionaries/de.json';
import turkishWords from '../assets/dictionaries/tr.json';

const LANGUAGE_DICTIONARIES = {
    en: englishWords,
    fr: frenchWords,
    es: spanishWords,
    it: italianWords,
    de: germanWords,
    tr: turkishWords,
};

const API_ENDPOINTS = {
    en: 'https://random-word-api.vercel.app/api?words=2',
    fr: 'https://trouve-mot.fr/api/random/2',
    it: 'https://random-word-api.herokuapp.com/word?lang=it&number=2',
    es: 'https://random-word-api.herokuapp.com/word?lang=es&number=2',
    de: 'https://random-word-api.herokuapp.com/word?lang=de&number=2',
    tr: 'https://random-words-api.vercel.app/word/turkish',
};

export const getWordsForLanguage = (lang) => {
    const langCode = lang.split('-')[0];
    return LANGUAGE_DICTIONARIES[langCode] || englishWords;
};

const fetchTurkishWords = async () => {
    const [response1, response2] = await Promise.all([
        fetch(API_ENDPOINTS.tr),
        fetch(API_ENDPOINTS.tr)
    ]);
    const data1 = await response1.json();
    const data2 = await response2.json();
    return [data1[0]?.word, data2[0]?.word];
};

const fetchFrenchWords = async () => {
    const response = await fetch(API_ENDPOINTS.fr);
    const data = await response.json();
    return data.map(item => item.name);
};

const fetchStandardWords = async (url) => {
    const response = await fetch(url);
    return response.json();
};

export const fetchRandomWords = async (currentLanguage) => {
    try {
        const langCode = currentLanguage.split('-')[0];

        if (langCode === 'tr') {
            return await fetchTurkishWords();
        }

        if (langCode === 'fr') {
            return await fetchFrenchWords();
        }

        const endpoint = API_ENDPOINTS[langCode] || API_ENDPOINTS.en;
        return await fetchStandardWords(endpoint);

    } catch (error) {
        console.error('Erreur récupération des mots:', error);
        console.log('Basculement en anglais');
        return fetchStandardWords(API_ENDPOINTS.en);
    }
};

export const getLetterBoxSize = (maxLetters) => {
    if (maxLetters >= 7) return 24;
    if (maxLetters >= 10) return 30;
    return 40;
};

export const getLetterFontSize = (boxSize) => {
    return boxSize * 0.5 + 4;
};
