import { boolean, literal, object, pipe, safeParse, transform, union, unknown, type InferOutput } from "valibot";
import { configStorageKey } from "./storage.ts";

export const StoredBoolean = pipe(
  unknown(),
  transform((input) => !!input),
  boolean()
);

export const StoredGroupBy = pipe(
  unknown(),
  union([literal("author"), literal("targetBranch")])
);

export type StoredGroupBy = InferOutput<typeof StoredGroupBy>;

export const StoredShowDrafts = pipe(
  unknown(),
  union([literal("all"), literal("only"), literal("none"), literal("isolated")])
);

export type StoredShowDrafts = InferOutput<typeof StoredShowDrafts>;

export const Config = object({
  enabled: StoredBoolean,
  showDrafts: StoredShowDrafts,
  groupBy: StoredGroupBy,
});

export type Config = InferOutput<typeof Config>;

export const ConfigStorage = object({
  [configStorageKey]: Config,
});

export type ConfigStorage = InferOutput<typeof ConfigStorage>;

export const DEFAULT_CONFIG: ConfigStorage = {
  [configStorageKey]: {
    enabled: true,
    showDrafts: "all",
    groupBy: "author",
  },
};

export function parseConfigStorage(storage: unknown): ConfigStorage {
  const parsed = safeParse(ConfigStorage, storage);
  
  if (!parsed.success) {
    return DEFAULT_CONFIG;
  }

  return parsed.output;
}