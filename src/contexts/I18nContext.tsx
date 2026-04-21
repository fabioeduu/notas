import React, { createContext, useCallback, useContext, useState } from "react";
import { changeLanguage, getCurrentLanguage } from "../services/i18nService";

interface I18nContextType {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<"pt" | "en">(
    getCurrentLanguage(),
  );

  const setLanguage = useCallback(async (lang: "pt" | "en") => {
    await changeLanguage(lang);
    setLanguageState(lang);
  }, []);

  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
};
