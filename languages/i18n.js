import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr, es, it, de, tr } from "./translations"; // ar, ru, pt_br, zh, ja
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
  // pt_br: {
  //   translation: pt_br
  // },
  it: {
    translation: it,
  },
  // zh: {
  //   translation: zh,
  // },
  de: {
    translation: de,
  },
  tr: {
    translation: tr,
  },
  // ja: {
  //   translation: ja,
  // },
  // ar: {
  //   translation: ar,
  // },
  // ru: {
  //   translation: ru,
  // },
}

i18next
  .use(initReactI18next).init({
    debug: true,
    resources,
    lng: 'en', // Langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;