/**
 * Level definitions for WordSurgery
 * Each level contains a pair of words that can be solved
 */

export const LEVELS = {
    fr: [
        {
            level: 1,
            words: ["train", "marche"],
            hint: "Déplace le T entre le A et le R du second mot",
            solutions: ["mat", "arche"]
        },
        {
            level: 2,
            words: ["table", "ronde"],
            hint: "Déplace A après R, puis T après A",
            solutions: ["rat", "onde"]
        },
        {
            level: 3,
            words: ["verrat", "voiture"],
            hint: "Déplace RRA du premier mot juste avant le T du second",
            solutions: ["voir", "rature"]
        },
        {
            level: 4,
            words: ["panier", "cheval"],
            hint: "Prends IER dans le premier mot et ajoute-le à la fin du second",
            solutions: ["chevalier"]
        },
        {
            level: 5,
            words: ["neige", "chien"],
            hint: "Prends NE au début du premier mot et ajoute-le à la fin du second",
            solutions: ["chienne"]
        },
        {
            level: 6,
            words: ["pierre", "chant"],
            hint: "Prends IER dans le premier mot et ajoute-le à la fin du second",
            solutions: ["chantier"]
        },
        {
            level: 7,
            words: ["prisme", "tour"],
            hint: "Insère ISME (du premier mot) à la fin du second",
            solutions: ["tourisme"]
        },
        {
            level: 8,
            words: ["image", "part"],
            hint: "Ajoute AGE (du premier mot) à la fin du second",
            solutions: ["partage"]
        },
        {
            level: 9,
            words: ["final", "jour"],
            hint: "Déplace NAL du premier mot à la fin du second",
            solutions: ["journal"]
        },
        {
            level: 10,
            words: ["detail", "port"],
            hint: "Déplace AIL (du premier mot) à la fin du second",
            solutions: ["portail"]
        },
        {
            level: 11,
            words: ["moment", "classe"],
            hint: "Ajoute MENT (du premier mot) à la fin du second",
            solutions: ["classement"]
        }
    ],
    en: [
        // TODO
    ]
};

/**
 * Get levels for a specific language
 * @param {string} lang - Language code (en, fr, etc.)
 * @returns {Array} Array of levels or empty array if not supported
 */
export const getLevelsForLanguage = (lang) => {
    if (lang.startsWith('fr')) return LEVELS.fr;
    // if (lang.startsWith('en')) return LEVELS.en;
    return []; // No levels defined, go to bonus mode
};

/**
 * Get a specific level for a language
 * @param {string} lang - Language code
 * @param {number} levelNumber - Level number (1-based)
 * @returns {Object|null} Level object or null if not found
 */
export const getLevel = (lang, levelNumber) => {
    const levels = getLevelsForLanguage(lang);
    return levels[levelNumber - 1] || null;
};

/**
 * Get total number of levels for a language
 * @param {string} lang - Language code
 * @returns {number} Total levels available
 */
export const getTotalLevels = (lang) => {
    return getLevelsForLanguage(lang).length;
};
