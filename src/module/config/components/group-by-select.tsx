import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  Box,
  createListCollection,
  Text,
  type SelectValueChangeDetails,
} from "@chakra-ui/react";
import * as React from "react";
import { safeParse } from "valibot";
import { useI18n } from "../../i18n/context.tsx";
import { i18n, type Dictionary } from "../../i18n/schema.ts";
import { useConfig } from "../context.tsx";
import { StoredGroupBy } from "../schema.ts";

const configDictionary = {
  groupBy: {
    [i18n.en.tag]: "Group By",
    [i18n.pt.tag]: "Agrupar Por",
  },
  groupByDescription: {
    [i18n.en.tag]: "Choose how to group pull requests",
    [i18n.pt.tag]: "Escolher como agrupar os pull requests",
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

export function GroupBySelect() {
  const { config, updateConfig } = useConfig();
  const text = useI18n(configDictionary);

  const handleGroupByChange = async (
    options: SelectValueChangeDetails<{ value: string; label: string }>
  ) => {
    const firstOption = options.items.at(0);

    if (!firstOption) return;

    const parsed = safeParse(StoredGroupBy, firstOption.value);

    if (!parsed.success) return;

    await updateConfig({
      groupBy: parsed.output,
    });
  };

  const groupByOptions = [
    { value: "author", label: text.groupByAuthor },
    { value: "targetBranch", label: text.groupByTargetBranch },
  ];

  return (
    <Box>
      <Box mb={2}>
        <SelectLabel>{text.groupBy}</SelectLabel>
      </Box>
      <SelectRoot
        value={[config.groupBy]}
        onValueChange={(options) => handleGroupByChange(options)}
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
  );
}
