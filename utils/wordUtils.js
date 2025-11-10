import frenchWords from '../assets/dictionaries/fr.json';
import englishWords from '../assets/dictionaries/en.json';
import spanishWords from '../assets/dictionaries/es.json';
import italiensWords from '../assets/dictionaries/it.json';
import deutchWords from '../assets/dictionaries/de.json';

export const getWordsForLanguage = (lang) => {
    if (lang.startsWith('fr')) return frenchWords;
    else if (lang.startsWith('es')) return spanishWords;
    else if (lang.startsWith('it')) return italiensWords;
    else if (lang.startsWith('de')) return deutchWords;
    return englishWords;
};

export const fetchRandomWords = async (currentLanguage) => {
    try {
        if (currentLanguage === 'en') {
            const response = await fetch('https://random-word-api.vercel.app/api?words=2');
            const data = await response.json();
            return data;
        }
        else if (currentLanguage === 'fr') {
            const response = await fetch('https://trouve-mot.fr/api/random/2');
            const data = await response.json();
            return data.map(item => item.name);
        }
        else if (currentLanguage === 'it' || currentLanguage === 'pt_br') {
            const apiLanguage = currentLanguage === "pt_br" ? "pt-br" : currentLanguage;
            const response = await fetch(`https://random-word-api.herokuapp.com/word?lang=${apiLanguage}&number=2`);
            const data = await response.json();
            return data;
        }
        else {
            let apiUrl = "https://random-words-api.vercel.app/word";
            if (currentLanguage === 'es') apiUrl += "/spanish";
            else if (currentLanguage === 'de') apiUrl += "/dutch";
            else if (currentLanguage === 'zh') apiUrl += "/chinese";
            else if (currentLanguage === 'ja') apiUrl += "/japanese";
            else if (currentLanguage === 'tr') apiUrl += "/turkish";

            const response1 = await fetch(apiUrl);
            const data1 = await response1.json();
            const word1 = data1[0]?.word;

            const response2 = await fetch(apiUrl);
            const data2 = await response2.json();
            const word2 = data2[0]?.word;

            return [word1, word2];
        }
    } catch (error) {
        console.error('Erreur récupération des mots:', error);
        console.error('On bascule en anglais');

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
