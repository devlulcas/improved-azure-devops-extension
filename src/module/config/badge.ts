import type { Config } from "./schema.ts";

const badgeTextByMode: Record<Config["showDrafts"], string> = {
  all: "ALL",
  only: "DRF",
  none: "ACT",
};

const modeTitleByMode: Record<Config["showDrafts"], string> = {
  all: "showing all pull requests",
  only: "showing only drafts",
  none: "showing only active pull requests",
};

export async function syncActionBadge(config: Config) {
  const badgeText = badgeTextByMode[config.showDrafts] ?? badgeTextByMode.all;
  const modeTitle = modeTitleByMode[config.showDrafts] ?? modeTitleByMode.all;

  await chrome.action.setBadgeText({ text: badgeText });
  await chrome.action.setBadgeBackgroundColor({ color: "#2b6cb0" });
  await chrome.action.setTitle({
    title: `Improved Azure DevOps: ${modeTitle}`,
  });
}
