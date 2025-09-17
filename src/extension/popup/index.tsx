import { Provider } from "@/components/ui/provider";
import React from "react";
import { renderExtension } from "../../libs/render-extension.ts";
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
    <div>
      <header>
        <div>
          <div>
            <div>
              <h1>Improved Azure DevOps</h1>
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </header>
      <main>
        <section>
          <h2>{text.configs}</h2>
          <div>Configs</div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <Provider>
        <Content />
      </Provider>
    </I18nProvider>
  );
}

renderExtension(<App />);
