import { VStack } from "@chakra-ui/react";
import * as React from "react";
import { ShowDraftsSelect } from "./show-drafts-select.tsx";

export function ConfigPanel() {
  return (
    <VStack gap={6} align="stretch">
      <ShowDraftsSelect />
    </VStack>
  );
}
