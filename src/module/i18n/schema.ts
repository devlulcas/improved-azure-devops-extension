import { literal, object, safeParse, union, type InferOutput } from "valibot";
import { createStorageKey } from "../../libs/storage-key.ts";

export const i18n = {
  pt: {
    name: "Português",
    tag: "pt-BR",
  },
  en: {
    name: "English",
    tag: "en-US",
  },
} as const;

const Language = union([literal(i18n.en.tag), literal(i18n.pt.tag)]);

export type Language = InferOutput<typeof Language>;

export const i18nStorageKey = createStorageKey("i18n", 1);

const I18n = object({
  [i18nStorageKey]: Language,
});

export function parseI18n(storage: unknown, defaultLanguage: Language = i18n.en.tag) {
  const parsed = safeParse(I18n, storage);
  return parsed.success ? parsed.output[i18nStorageKey] : defaultLanguage;
}

export type Dictionary = Record<string, Record<Language, string>>;

export function interpolate(text: string, args: Record<string, unknown>) {
  return text.replace(
    /{(\w+)}/g,
    (match, key) => args[key]?.toString() ?? match
  );
}
