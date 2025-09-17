import {
  SelectContent,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  Box,
  createListCollection,
  SelectItem,
  Text,
  type SelectValueChangeDetails,
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
  showDraftsDescription: {
    [i18n.en.tag]: "Control how draft pull requests are displayed",
    [i18n.pt.tag]: "Controlar como os pull requests em rascunho são exibidos",
  },
  showDraftsAll: {
    [i18n.en.tag]: "All Drafts",
    [i18n.pt.tag]: "Todos os Rascunhos",
  },
  showDraftsOnly: {
    [i18n.en.tag]: "Only Drafts",
    [i18n.pt.tag]: "Apenas Rascunhos",
  },
  showDraftsNone: {
    [i18n.en.tag]: "No Drafts",
    [i18n.pt.tag]: "Sem Rascunhos",
  },
  showDraftsIsolated: {
    [i18n.en.tag]: "Isolated Drafts",
    [i18n.pt.tag]: "Rascunhos Isolados",
  },
} as const satisfies Dictionary;

export function ShowDraftsSelect() {
  const { config, updateConfig } = useConfig();
  const text = useI18n(configDictionary);

  const handleShowDraftsChange = async (
    options: SelectValueChangeDetails<{ value: string; label: string }>
  ) => {
    const firstOption = options.items.at(0);

    if (!firstOption) return;

    const parsed = safeParse(StoredShowDrafts, firstOption.value);

    if (!parsed.success) return;

    await updateConfig({
      showDrafts: parsed.output,
    });
  };

  const showDraftsOptions = createListCollection({
    items: [
      { value: "all", label: text.showDraftsAll },
      { value: "only", label: text.showDraftsOnly },
      { value: "none", label: text.showDraftsNone },
      { value: "isolated", label: text.showDraftsIsolated },
    ],
  });

  return (
    <Box>
      <Box mb={2}>
        <SelectLabel>{text.showDrafts}</SelectLabel>
      </Box>
      <SelectRoot
        value={[config.showDrafts]}
        onValueChange={handleShowDraftsChange}
        collection={showDraftsOptions}
      >
        <SelectTrigger>
          <SelectValueText placeholder={text.showDrafts} />
        </SelectTrigger>
        <SelectContent>
          {showDraftsOptions.items.map((option) => (
            <SelectItem key={option.value} item={option}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <Text fontSize="sm" color="fg.muted" mt={1}>
        {text.showDraftsDescription}
      </Text>
    </Box>
  );
}
