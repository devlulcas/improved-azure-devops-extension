import React from "react";
import ReactDOM from "react-dom/client";

export function renderExtension(App: React.ReactNode) {
  const bodyEl = document.body;
  const rootEl = document.createElement("div");
  rootEl.id = "improved-azure-devops-extension-root";
  bodyEl.appendChild(rootEl);
  ReactDOM.createRoot(rootEl).render(App);
}
