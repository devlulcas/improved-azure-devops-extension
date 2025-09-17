import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Box, createListCollection, Text, VStack } from "@chakra-ui/react";
import * as React from "react";
import { useI18n } from "../../i18n/context.tsx";
import { i18n, type Dictionary } from "../../i18n/schema.ts";
import { useConfig } from "../context.tsx";
import { DEFAULT_CONFIG } from "../schema.ts";
import { configStorageKey } from "../storage.ts";

const configDictionary = {
  enabled: {
    [i18n.en.tag]: "Enable Extension",
    [i18n.pt.tag]: "Habilitar Extensão",
  },
  enabledDescription: {
    [i18n.en.tag]: "Enable or disable the extension functionality",
    [i18n.pt.tag]: "Habilitar ou desabilitar a funcionalidade da extensão",
  },
  showDrafts: {
    [i18n.en.tag]: "Show Drafts",
    [i18n.pt.tag]: "Mostrar Rascunhos",
  },
  showDraftsDescription: {
    [i18n.en.tag]: "Control how draft pull requests are displayed",
    [i18n.pt.tag]: "Controlar como os pull requests em rascunho são exibidos",
  },
  groupBy: {
    [i18n.en.tag]: "Group By",
    [i18n.pt.tag]: "Agrupar Por",
  },
  groupByDescription: {
    [i18n.en.tag]: "Choose how to group pull requests",
    [i18n.pt.tag]: "Escolher como agrupar os pull requests",
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
  groupByAuthor: {
    [i18n.en.tag]: "Author",
    [i18n.pt.tag]: "Autor",
  },
  groupByTargetBranch: {
    [i18n.en.tag]: "Target Branch",
    [i18n.pt.tag]: "Branch de Destino",
  },
} as const satisfies Dictionary;

export function ConfigPanel() {
  const { config, updateConfig } = useConfig();
  const text = useI18n(configDictionary);

  const handleEnabledChange = async (checked: boolean) => {
    await updateConfig({
      [configStorageKey]: {
        ...config[configStorageKey],
        enabled: checked,
      },
    });
  };

  const handleShowDraftsChange = async (value: string) => {
    await updateConfig({
      [configStorageKey]: {
        ...config[configStorageKey],
        showDrafts: value as "all" | "only" | "none" | "isolated",
      },
    });
  };

  const handleGroupByChange = async (value: string) => {
    await updateConfig({
      [configStorageKey]: {
        ...config[configStorageKey],
        groupBy: value as "author" | "targetBranch",
      },
    });
  };

  const showDraftsOptions = [
    { value: "all", label: text.showDraftsAll },
    { value: "only", label: text.showDraftsOnly },
    { value: "none", label: text.showDraftsNone },
    { value: "isolated", label: text.showDraftsIsolated },
  ];

  const groupByOptions = [
    { value: "author", label: text.groupByAuthor },
    { value: "targetBranch", label: text.groupByTargetBranch },
  ];

  return (
    <VStack gap={6} align="stretch">
      <CheckboxCard
        checked={config[configStorageKey].enabled}
        onCheckedChange={(details) =>
          handleEnabledChange(details.checked === true)
        }
        label={text.enabled}
        description={text.enabledDescription}
      />

      <Box>
        <Box mb={2}>
          <SelectLabel>{text.showDrafts}</SelectLabel>
        </Box>
        <SelectRoot
          value={[config[configStorageKey].showDrafts]}
          onValueChange={(details) => {
            handleShowDraftsChange(
              details.value[0] ?? DEFAULT_CONFIG[configStorageKey].showDrafts
            );
          }}
          collection={createListCollection({
            items: showDraftsOptions.map((option) => ({
              value: option.value,
              label: option.label,
            })),
          })}
        >
          <SelectTrigger>
            <SelectValueText placeholder={text.showDrafts} />
          </SelectTrigger>
          <SelectContent>
            {showDraftsOptions.map((option) => (
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

      <Box>
        <Box mb={2}>
          <SelectLabel>{text.groupBy}</SelectLabel>
        </Box>
        <SelectRoot
          value={[config[configStorageKey].groupBy]}
          onValueChange={(details) =>
            handleGroupByChange(
              details.value[0] ?? DEFAULT_CONFIG[configStorageKey].groupBy
            )
          }
          collection={createListCollection({
            items: groupByOptions.map((option) => ({
              value: option.value,
              label: option.label,
            })),
          })}
        >
          <SelectTrigger>
            <SelectValueText placeholder={text.groupBy} />
          </SelectTrigger>
          <SelectContent>
            {groupByOptions.map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          {text.groupByDescription}
        </Text>
      </Box>
    </VStack>
  );
}
