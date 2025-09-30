import { getDefaultAboutContent, getDefaultMissionContent } from "./defaultContent";

const ContentStorage = {
  getAboutContent: () => {
    const stored = localStorage.getItem("aboutPageContent");
    return stored ? JSON.parse(stored) : getDefaultAboutContent();
  },

  getMissionContent: () => {
    const stored = localStorage.getItem("missionPageContent");
    return stored ? JSON.parse(stored) : getDefaultMissionContent();
  },

  saveAboutContent: (content) => {
    localStorage.setItem("aboutPageContent", JSON.stringify(content));
  },

  saveMissionContent: (content) => {
    localStorage.setItem("missionPageContent", JSON.stringify(content));
  }
};

export default ContentStorage; // ✅ Default export added
