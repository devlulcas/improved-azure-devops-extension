import React, { createContext, use, useEffect, useRef, useState } from "react";
import { Config, DEFAULT_CONFIG } from "./schema.ts";
import {
  configStorageKey,
  getConfig,
  listenToConfigStorageChanges,
  setConfig,
} from "./storage.ts";

function useSyncConfig() {
  const [state, setState] = useState<Config>(DEFAULT_CONFIG[configStorageKey]);

  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current === false) {
      return;
    }

    const init = async () => {
      const result = await getConfig();
      setState(result);
      firstLoad.current = false;
    };

    init();

    return () => {
      firstLoad.current = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = listenToConfigStorageChanges((config) => {
      setState(config);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}

export const ConfigContext = createContext<{
  config: Config;
  updateConfig: (config: Partial<Config>) => Promise<void>;
} | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = useSyncConfig();

  const updateConfig = async (newConfig: Partial<Config>) => {
    await setConfig(newConfig);
  };

  const value = {
    config,
    updateConfig,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = use(ConfigContext);

  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
}
