// src/hooks/usePageLogger.js
import { useEffect } from "react";
import { logPageVisit } from "../utils/historyLogger";

export const usePageLogger = ({
  title,
  type = "page",
  reference = "",
  content = "",
  category = ""
}) => {
  useEffect(() => {
    if (title) {
      logPageVisit(title, type, reference, content, category);
    }
  }, [title, type, reference, content, category]);
};
