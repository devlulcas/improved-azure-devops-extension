import { Switch } from "@/components/ui/switch";
import { HStack, Text } from "@chakra-ui/react";
import React, { use } from "react";
import { I18nContext } from "../context.tsx";
import { i18n } from "../schema.ts";

const i18nMap = {
  [i18n.pt.tag]: i18n.pt,
  [i18n.en.tag]: i18n.en,
};

export function LanguageSwitch() {
  const { language, setPreferredLanguage } = use(I18nContext);

  const handleChange = async (details: { checked: boolean }) => {
    const newLanguage = details.checked ? i18n.pt.tag : i18n.en.tag;
    setPreferredLanguage(newLanguage);
  };

  const isPortuguese = language === i18n.pt.tag;

  return (
    <HStack>
      <Text>{i18nMap[language].name}</Text>
      <Switch
        checked={isPortuguese}
        onCheckedChange={handleChange}
        title={language}
      />
    </HStack>
  );
}
