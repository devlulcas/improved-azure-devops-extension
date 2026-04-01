import { Config, DEFAULT_CONFIG } from "@/module/config/schema.ts";
import {
  configStorageKey,
  getConfig,
  listenToConfigStorageChanges,
} from "../../module/config/storage.ts";

const showDraftsSelector = "improved-azure-devops-extension-show-drafts";
const tableContainerSelector = ".repos-pr-section-card";
const tableTitleSelector = ".repos-pr-section-header-title";
const titlePillSelector = ".bolt-pill-content";
const applyDebounceMs = 120;

let config: Config = DEFAULT_CONFIG[configStorageKey];
let applyTimer: number | null = null;
let pendingContainers: Set<HTMLDivElement> | null = null;
let observer: MutationObserver | null = null;
const lastTitleByContainer = new WeakMap<HTMLDivElement, string>();

function updateContainer(container: HTMLDivElement, currentConfig: Config) {
  if (container.getAttribute(showDraftsSelector) !== currentConfig.showDrafts) {
    container.setAttribute(showDraftsSelector, currentConfig.showDrafts);
  }

  const titlePill = container
    .querySelector<HTMLDivElement>(tableTitleSelector)
    ?.querySelector<HTMLDivElement>(titlePillSelector);

  if (!titlePill) {
    return;
  }

  const draftsCount = container.querySelectorAll<HTMLAnchorElement>(
    `a:has([aria-label="Draft"])`
  ).length;
  const activeCount = container.querySelectorAll<HTMLAnchorElement>(
    `a:not(:has([aria-label="Draft"]))`
  ).length;
  const title = `Drafts (${draftsCount}) / Active (${activeCount})`;
  const lastTitle = lastTitleByContainer.get(container);

  if (lastTitle !== title) {
    titlePill.textContent = title;
    lastTitleByContainer.set(container, title);
  }
}

function applyConfig(currentConfig: Config, containers?: Set<HTMLDivElement>) {
  const targetContainers =
    containers && containers.size > 0
      ? [...containers].filter((container) => container.isConnected)
      : Array.from(
          document.querySelectorAll<HTMLDivElement>(tableContainerSelector)
        );

  if (targetContainers.length === 0) {
    return;
  }

  targetContainers.forEach((container) => {
    updateContainer(container, currentConfig);
  });
}

function scheduleApply(containers?: Set<HTMLDivElement>) {
  if (containers && containers.size > 0) {
    if (pendingContainers === null) {
      pendingContainers = new Set(containers);
    } else {
      containers.forEach((container) => pendingContainers?.add(container));
    }
  } else {
    pendingContainers = null;
  }

  if (applyTimer !== null) {
    return;
  }

  applyTimer = window.setTimeout(() => {
    applyTimer = null;
    const containers = pendingContainers;
    pendingContainers = null;
    applyConfig(config, containers ?? undefined);
  }, applyDebounceMs);
}

function getContainerFromNode(node: Node): HTMLDivElement | null {
  if (node instanceof Element) {
    return node.closest<HTMLDivElement>(tableContainerSelector);
  }

  if (node.parentElement) {
    return node.parentElement.closest<HTMLDivElement>(tableContainerSelector);
  }

  return null;
}

function startObserver() {
  if (observer || !document.documentElement) {
    return;
  }

  observer = new MutationObserver((mutations) => {
    const affectedContainers = new Set<HTMLDivElement>();

    mutations.forEach((mutation) => {
      const targetContainer = getContainerFromNode(mutation.target);
      if (targetContainer) {
        affectedContainers.add(targetContainer);
      }

      mutation.addedNodes.forEach((node) => {
        const container = getContainerFromNode(node);
        if (container) {
          affectedContainers.add(container);
        }
      });
    });

    if (affectedContainers.size > 0) {
      scheduleApply(affectedContainers);
      return;
    }

    scheduleApply();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

function init() {
  createStyleBlock();
  startObserver();

  scheduleApply();

  getConfig().then((currentConfig) => {
    config = currentConfig;
    scheduleApply();
  });

  listenToConfigStorageChanges((currentConfig) => {
    config = currentConfig;
    scheduleApply();
  });

  window.addEventListener("pageshow", () => {
    scheduleApply();
  });
}

init();

function createStyleBlock() {
  const id = "improved-azure-devops-extension-style";

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
