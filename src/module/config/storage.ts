import { wrapAsync } from "../../libs/result.ts";
import { createStorageKey } from "../../libs/storage-key.ts";
import { ConfigStorage, DEFAULT_CONFIG, parseConfigStorage } from "./schema.ts";

export const configStorageKey = createStorageKey("config", 1);

export async function getConfig() {
  const result = await wrapAsync(async () => {
    const storage = await chrome.storage.local.get(configStorageKey);
    return parseConfigStorage(storage);
  });

  return result.unwrapOr(DEFAULT_CONFIG);
}

export async function setConfig(config: Partial<ConfigStorage>) {
const currentConfig = await getConfig();

  const newConfig = { ...currentConfig, ...config };

  const result = await wrapAsync(async () => {
    await chrome.storage.local.set({ [configStorageKey]: newConfig });
    return newConfig;
  });

  return result.unwrapOr(currentConfig);
}

export function listenToConfigStorageChanges(
  callback: (config: ConfigStorage) => void
) {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: chrome.storage.AreaName
  ) => {
    if (areaName === "local" && changes[configStorageKey]) {
      const newValue = changes[configStorageKey].newValue;

      const parsed = parseConfigStorage({
        [configStorageKey]: newValue,
      });

      callback(parsed);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}
