import {
  Box,
  RadioGroup,
  Text,
  VStack,
  type RadioGroupValueChangeDetails,
} from "@chakra-ui/react";
import * as React from "react";
import { safeParse } from "valibot";
import { useI18n } from "../../i18n/context.tsx";
import { i18n, type Dictionary } from "../../i18n/schema.ts";
import { useConfig } from "../context.tsx";
import { StoredShowDrafts } from "../schema.ts";

const configDictionary = {
  showDrafts: {
    [i18n.en.tag]: "Show Drafts",
    [i18n.pt.tag]: "Mostrar Rascunhos",
  },
  showDraftsAll: {
    [i18n.en.tag]: "All",
    [i18n.pt.tag]: "Tudo",
  },
  showDraftsOnly: {
    [i18n.en.tag]: "Only Drafts",
    [i18n.pt.tag]: "Apenas Rascunhos",
  },
  showDraftsNone: {
    [i18n.en.tag]: "No Drafts",
    [i18n.pt.tag]: "Sem Rascunhos",
  },
} as const satisfies Dictionary;

export function ShowDraftsSelect() {
  const { config, updateConfig } = useConfig();
  const text = useI18n(configDictionary);

  const handleShowDraftsChange = async (
    event: RadioGroupValueChangeDetails
  ) => {
    const parsed = safeParse(StoredShowDrafts, event.value);

    if (!parsed.success) return;

    await updateConfig({
      showDrafts: parsed.output,
    });
  };

  const options = [
    { value: "all", label: text.showDraftsAll },
    { value: "only", label: text.showDraftsOnly },
    { value: "none", label: text.showDraftsNone },
  ];

  return (
    <Box>
      <Box mb={2}>
        <Text fontWeight="medium" fontSize="sm">
          {text.showDrafts}
        </Text>
      </Box>
      <RadioGroup.Root
        value={config.showDrafts}
        onValueChange={handleShowDraftsChange}
      >
        <VStack align="start" gap={2}>
          {options.map((option) => (
            <RadioGroup.Item key={option.value} value={option.value}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />

              <RadioGroup.ItemText fontSize="sm">
                {option.label}
              </RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </VStack>
      </RadioGroup.Root>
    </Box>
  );
}
