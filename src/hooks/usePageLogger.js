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
    // We only want to run this once when the page mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
