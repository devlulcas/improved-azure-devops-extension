import React, { use, useId } from "react";
import { I18nContext } from "../context.tsx";
import { i18n } from "../schema.ts";

export function LanguageSwitch() {
  const { language, setPreferredLanguage } = use(I18nContext);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? i18n.pt.tag : i18n.en.tag;
    setPreferredLanguage(newLanguage);
  };

  const isPortuguese = language === i18n.pt.tag;

  const id = useId();

  return (
    <label htmlFor={id} title={language}>
      <input
        type="checkbox"
        checked={isPortuguese}
        onChange={handleChange}
        id={id}
      />
      <span data-active={!isPortuguese}>{i18n.en.name}</span>
      <span data-active={isPortuguese}>{i18n.pt.name}</span>
    </label>
  );
}
