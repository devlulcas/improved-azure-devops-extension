import React, { createContext, use, useEffect, useRef, useState } from "react";
import { ConfigStorage, DEFAULT_CONFIG } from "./schema.ts";
import {
  getConfig,
  listenToConfigStorageChanges,
  setConfig,
} from "./storage.ts";

function useSyncConfig() {
  const [state, setState] = useState<ConfigStorage>(DEFAULT_CONFIG);
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
  config: ConfigStorage;
  updateConfig: (config: Partial<ConfigStorage>) => Promise<void>;
}>({
  config: DEFAULT_CONFIG,
  updateConfig: async () => {},
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const config = useSyncConfig();

  const updateConfig = async (newConfig: Partial<ConfigStorage>) => {
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
  return use(ConfigContext);
}
