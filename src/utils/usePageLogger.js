// src/hooks/usePageLogger.js
import { useEffect } from "react";
import { logPageVisit } from "../utils/historyLogger";

export const usePageLogger = ({
  title,
  type = "page",
  reference = "",
  content = "",
  category = "General",
  extraReference = window.location.pathname
}) => {
  useEffect(() => {
    logPageVisit({ title, type, reference, content, category, extraReference });
  }, [title, type, reference, content, category, extraReference]);
};
