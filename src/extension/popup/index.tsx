import { Box, HStack, Heading, VStack } from "@chakra-ui/react";
import * as React from "react";

import { Provider as ChakraProvider } from "@/components/ui/provider";
import { renderExtension } from "../../libs/render-extension.ts";
import { ConfigPanel } from "../../module/config/components/config-panel.tsx";
import { ConfigProvider } from "../../module/config/context.tsx";
import { LanguageSwitch } from "../../module/i18n/components/language-switch.tsx";
import { I18nProvider, useI18n } from "../../module/i18n/context.tsx";
import { i18n, type Dictionary } from "../../module/i18n/schema.ts";

const dictionary = {
  configs: {
    [i18n.en.tag]: "Configs",
    [i18n.pt.tag]: "Configurações",
  },
} as const satisfies Dictionary;

function Content() {
  const text = useI18n(dictionary);

  return (
    <Box minW="450px" p={6} bg="bg.surface" color="fg.default">
      <VStack gap={6} align="stretch">
        <Box>
          <HStack justify="space-between" align="center">
            <Heading size="lg" color="fg.emphasized">
              Improved Azure DevOps
            </Heading>
            <LanguageSwitch />
          </HStack>
        </Box>

        <Box>
          <VStack gap={4} align="stretch">
            <Heading size="md" color="fg.emphasized">
              {text.configs}
            </Heading>
            <ConfigPanel />
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider>
      <I18nProvider>
        <ConfigProvider>
          <Content />
        </ConfigProvider>
      </I18nProvider>
    </ChakraProvider>
  );
}

renderExtension(<App />);
