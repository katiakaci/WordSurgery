import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr, es, pt, it, zh, de } from "./translations"; // ar, ja, ru
const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  // ar: {
  //   translation: ar,
  // },
  // ja: {
  //   translation: ja,
  // },
  pt: {
    translation: pt,
  },
  // ru: {
  //   translation: ru,
  // },
  it: {
    translation: it,
  },
  zh: {
    translation: zh,
  },
  de: {
    translation: de,
  },
}

i18next
  .use(initReactI18next).init({
    debug: true,
    resources,
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;