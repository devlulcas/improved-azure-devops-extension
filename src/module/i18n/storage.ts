import { wrapAsync } from "../../libs/result.ts";
import { i18n, i18nStorageKey, parseI18n, type Language } from "./schema.ts";

function getDefaultLanguage() {
  return parseI18n(chrome.i18n.getUILanguage());
}

export async function getPreferredLanguage() {
  const fromStorage = await wrapAsync(() =>
    chrome.storage.local.get(i18nStorageKey)
  );

  const defaultLanguage = getDefaultLanguage();

  if (fromStorage.isErr()) {
    return defaultLanguage;
  }

  const inStorage = parseI18n(fromStorage.unwrap(), defaultLanguage);

  return inStorage;
}

export async function setPreferredLanguage(language: Language) {
  const result = await wrapAsync(async () => {
    await chrome.storage.local.set({ [i18nStorageKey]: language });
    return language;
  });

  return result.unwrapOr(i18n.en.tag);
}

type Listener = (language: Language, areaName: chrome.storage.AreaName) => void;

export function listenToI18nStorageChanges(callback: Listener) {
  const listener = (
    changes: {
      [key: string]: chrome.storage.StorageChange;
    },
    areaName: chrome.storage.AreaName
  ) => {
    if (changes[i18nStorageKey]) {
      const newValue = {
        [i18nStorageKey]: changes[i18nStorageKey].newValue,
      };

      const defaultLanguage = getDefaultLanguage();
      const parsed = parseI18n(newValue, defaultLanguage);

      callback(parsed, areaName);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}
