import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MarkdownWorkspace from "./MarkdownWorkspace";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MarkdownWorkspace />
  </StrictMode>,
);
