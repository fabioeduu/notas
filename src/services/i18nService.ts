import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import pt from "../locales/pt.json";

const resources = {
  pt: { translation: pt },
  en: { translation: en },
};

const i18n = createInstance();

const detectInitialLanguage = (): "pt" | "en" => {
  const deviceTag = getLocales()[0]?.languageTag?.toLowerCase() ?? "en-us";
  return deviceTag.startsWith("pt") ? "pt" : "en";
};

i18n.use(initReactI18next).init({
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  resources,
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

void (async () => {
  const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
  if (savedLanguage === "pt" || savedLanguage === "en") {
    await i18n.changeLanguage(savedLanguage);
  }
})();

export const changeLanguage = async (language: "pt" | "en") => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem("selectedLanguage", language);
  } catch (error) {
    console.error("Erro ao mudar idioma:", error);
  }
};

export const getCurrentLanguage = (): "pt" | "en" => {
  const current = i18n.language;
  return current === "pt" ? "pt" : "en";
};

export default i18n;
