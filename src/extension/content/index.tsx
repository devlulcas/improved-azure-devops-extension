import { Config, DEFAULT_CONFIG } from "@/module/config/schema.ts";
import { configStorageKey } from "../../module/config/storage.ts";

window.addEventListener("load", () => {
  createStyleBlock();

  // Initial load
  chrome.storage.local.get(configStorageKey).then((config) => {
    run(config[configStorageKey] ?? DEFAULT_CONFIG[configStorageKey]);
  });

  // Listen to config changes
  chrome.storage.onChanged.addListener((changes) => {
    const config: Config =
      changes[configStorageKey]?.newValue ?? DEFAULT_CONFIG[configStorageKey];
    run(config);
  });
});

function run(config: Config) {
  const tableContainer = document.querySelector<HTMLDivElement>(
    ".repos-pr-section-card"
  );

  const wrapper = tableContainer?.parentElement;

  if (tableContainer === undefined || !wrapper) {
    console.log("No table container or wrapper found", {
      tableContainer,
      wrapper,
    });
    return;
  }

  const selector = `improved-azure-devops-extension-show-drafts`;

  if (!config.enabled) {
    tableContainer.setAttribute(selector, "all");
    return;
  }

  tableContainer.setAttribute(selector, config.showDrafts ?? "all");
}

function createStyleBlock() {
  const classNameHash = crypto.randomUUID();

  const id = `improved-azure-devops-extension-style-${classNameHash}`;

  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      [improved-azure-devops-extension-show-drafts="only"] a:not(:has([aria-label="Draft"])) {
        display: none;
      }

      [improved-azure-devops-extension-show-drafts="none"] a:has([aria-label="Draft"]) {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
}
