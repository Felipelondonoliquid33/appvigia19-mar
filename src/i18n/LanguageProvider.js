import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "./i18n";

const STORAGE_KEY = "APP_LANGUAGE";

const LanguageContext = createContext({
  lang: "es",
  setLang: async (_lang) => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const initial = saved || "es";
        i18n.locale = initial;
        setLangState(initial);
      } catch (e) {
        i18n.locale = "es";
        setLangState("es");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLang = async (newLang) => {
    i18n.locale = newLang;
    setLangState(newLang);
    await AsyncStorage.setItem(STORAGE_KEY, newLang);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, options) => i18n.t(key, options),
    }),
    [lang]
  );

  if (!ready) return null; // o un splash/loader si prefieres
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
