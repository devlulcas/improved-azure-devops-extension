import { wrapAsync } from "../../libs/result.ts";
import { createStorageKey } from "../../libs/storage-key.ts";
import { Config, DEFAULT_CONFIG, parseConfigStorage } from "./schema.ts";

export const configStorageKey = createStorageKey("config", 1);

export async function getConfig(): Promise<Config> {
  const result = await wrapAsync(async () => {
    const storage = await chrome.storage.local.get(configStorageKey);
    return parseConfigStorage(storage)[configStorageKey];
  });

  return result.unwrapOr(DEFAULT_CONFIG[configStorageKey]);
}

export async function setConfig(config: Partial<Config>): Promise<Config> {
  const currentConfig = await getConfig();

  const newConfig: Config = { ...currentConfig, ...config };

  const result = await wrapAsync(async () => {
    await chrome.storage.local.set({ [configStorageKey]: newConfig });
    return newConfig;
  });

  return result.unwrapOr(currentConfig);
}

export function listenToConfigStorageChanges(
  callback: (config: Config) => void
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

      callback(parsed[configStorageKey]);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}
