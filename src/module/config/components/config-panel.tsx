import { VStack } from "@chakra-ui/react";
import * as React from "react";
import { EnabledToggle } from "./enabled-toggle.tsx";
import { ShowDraftsSelect } from "./show-drafts-select.tsx";

export function ConfigPanel() {
  return (
    <VStack gap={6} align="stretch">
      <EnabledToggle />

      <ShowDraftsSelect />
    </VStack>
  );
}
