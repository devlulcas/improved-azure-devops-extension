import { CheckboxCard } from "@/components/ui/checkbox-card";
import type { CheckboxCardCheckedChangeDetails } from "@chakra-ui/react";
import * as React from "react";
import { useI18n } from "../../i18n/context.tsx";
import { i18n, type Dictionary } from "../../i18n/schema.ts";
import { useConfig } from "../context.tsx";

const configDictionary = {
  enabled: {
    [i18n.en.tag]: "Enable Extension",
    [i18n.pt.tag]: "Habilitar Extensão",
  },
} as const satisfies Dictionary;

export function EnabledToggle() {
  const { config, updateConfig } = useConfig();
  const text = useI18n(configDictionary);

  const handleEnabledChange = async (
    data: CheckboxCardCheckedChangeDetails
  ) => {
    await updateConfig({
      enabled: data.checked === true,
    });
  };

  return (
    <CheckboxCard
      checked={config.enabled}
      onCheckedChange={handleEnabledChange}
      label={text.enabled}
    />
  );
}
