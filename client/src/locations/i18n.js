import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import TranslationEN from "./translation/en.json";
import TranslationRU from "./translation/ru.json";
import TranslationUA from "./translation/ua.json";

const resources = {
  en: {
    translation: TranslationEN
  },
  ru: {
    translation: TranslationRU
  },
  ua: {
    translation: TranslationUA
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;