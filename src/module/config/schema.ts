import {
  literal,
  object,
  pipe,
  safeParse,
  union,
  unknown,
  type InferOutput,
} from "valibot";
import { configStorageKey } from "./storage.ts";

export const StoredShowDrafts = pipe(
  unknown(),
  union([literal("all"), literal("only"), literal("none")])
);

export type StoredShowDrafts = InferOutput<typeof StoredShowDrafts>;

export const Config = object({
  showDrafts: StoredShowDrafts,
});

export type Config = InferOutput<typeof Config>;

export const ConfigStorage = object({
  [configStorageKey]: Config,
});

export type ConfigStorage = InferOutput<typeof ConfigStorage>;

export const DEFAULT_CONFIG: ConfigStorage = {
  [configStorageKey]: {
    showDrafts: "all",
  },
};

export function parseConfigStorage(storage: unknown): ConfigStorage {
  const storedConfig =
    typeof storage === "object" &&
    storage !== null &&
    configStorageKey in storage &&
    typeof (storage as Record<string, unknown>)[configStorageKey] === "object" &&
    (storage as Record<string, unknown>)[configStorageKey] !== null
      ? ((storage as Record<string, unknown>)[configStorageKey] as Record<
          string,
          unknown
        >)
      : null;

  // Migrate previous schema where "enabled: false" represented an "all" mode.
  if (storedConfig?.enabled === false) {
    return {
      [configStorageKey]: {
        showDrafts: "all",
      },
    };
  }

  const parsed = safeParse(ConfigStorage, storage);

  if (!parsed.success) {
    return DEFAULT_CONFIG;
  }

  return parsed.output;
}
