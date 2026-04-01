import { syncActionBadge } from "../../module/config/badge.ts";
import { getConfig, listenToConfigStorageChanges } from "../../module/config/storage.ts";

async function syncBadgeFromStorage() {
  const config = await getConfig();
  await syncActionBadge(config);
}

listenToConfigStorageChanges((config) => {
  syncActionBadge(config);
});

chrome.runtime.onInstalled.addListener(() => {
  syncBadgeFromStorage();
});

chrome.runtime.onStartup.addListener(() => {
  syncBadgeFromStorage();
});

syncBadgeFromStorage();
