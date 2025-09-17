import { boolean, literal, object, pipe, safeParse, transform, union, unknown, type InferOutput } from "valibot";
import { configStorageKey } from "./storage.ts";

export const StoredBoolean = pipe(
  unknown(),
  transform((input) => !!input),
  boolean()
);


export const ConfigStorage = object({
  [configStorageKey]: object({
    enabled: StoredBoolean,
    showDrafts: union([literal("all"), literal("only"), literal("none"), literal("isolated")]),
    groupBy: union([literal("author"), literal("targetBranch")]),
  }),
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