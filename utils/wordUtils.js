import frenchWords from '../assets/dictionaries/fr.json';
import englishWords from '../assets/dictionaries/en.json';
import spanishWords from '../assets/dictionaries/es.json';
import italianWords from '../assets/dictionaries/it.json';
import germanWords from '../assets/dictionaries/de.json';
import turkishWords from '../assets/dictionaries/tr.json';

export const getWordsForLanguage = (lang) => {
    if (lang.startsWith('en')) return englishWords;
    if (lang.startsWith('fr')) return frenchWords;
    if (lang.startsWith('es')) return spanishWords;
    if (lang.startsWith('it')) return italianWords;
    if (lang.startsWith('de')) return germanWords;
    if (lang.startsWith('tr')) return turkishWords;

    // Default fallback to English
    return englishWords;
};

export const fetchRandomWords = async (currentLanguage) => {
    try {
        // English
        if (currentLanguage === 'en') {
            const response = await fetch('https://random-word-api.vercel.app/api?words=2');
            const data = await response.json();
            return data;
        }

        // French
        if (currentLanguage === 'fr') {
            const response = await fetch('https://trouve-mot.fr/api/random/2');
            const data = await response.json();
            return data.map(item => item.name);
        }

        // Italian
        if (currentLanguage === 'it') {
            const response = await fetch('https://random-word-api.herokuapp.com/word?lang=it&number=2');
            const data = await response.json();
            return data;
        }

        // Spanish
        if (currentLanguage === 'es') {
            const response = await fetch('https://random-word-api.herokuapp.com/word?lang=es&number=2');
            const data = await response.json();
            return data;
        }

        // German
        if (currentLanguage === 'de') {
            const response = await fetch('https://random-word-api.herokuapp.com/word?lang=de&number=2');
            const data = await response.json();
            return data;
        }

        // Turkish
        if (currentLanguage === 'tr') {
            let apiUrl = "https://random-words-api.vercel.app/word/turkish";
            const response1 = await fetch(apiUrl);
            const data1 = await response1.json();
            const word1 = data1[0]?.word;

            const response2 = await fetch(apiUrl);
            const data2 = await response2.json();
            const word2 = data2[0]?.word;

            return [word1, word2];
        }

        // Unsupported language, fallback to English
        const response = await fetch('https://random-word-api.vercel.app/api?words=2');
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erreur récupération des mots:', error);
        console.error('On bascule en anglais');

        // Fallback to English on error
        const response = await fetch('https://random-word-api.vercel.app/api?words=2');
        const data = await response.json();
        return data;
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
