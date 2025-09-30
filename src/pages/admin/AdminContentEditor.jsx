import React, { useState } from "react";
import { Save, Edit2, BookOpen, Target, Plus, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ContentStorage from "../../data/contentStorage"; // ✅ FIXED: Import default

export default function AdminContentEditor() {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutContent, setAboutContent] = useState(ContentStorage.getAboutContent());
  const [missionContent, setMissionContent] = useState(ContentStorage.getMissionContent());
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    if (activeTab === "about") {
      ContentStorage.saveAboutContent(aboutContent);
      toast.success("About page content saved successfully!");
    } else {
      ContentStorage.saveMissionContent(missionContent);
      toast.success("Mission page content saved successfully!");
    }
    setHasChanges(false);
  };

  const updateField = (contentType, path, value) => {
    setHasChanges(true);
    const content = contentType === "about" ? { ...aboutContent } : { ...missionContent };
    const keys = path.split(".");
    let curr = content;

    for (let i = 0; i < keys.length - 1; i++) {
      curr = curr[keys[i]];
    }
    curr[keys[keys.length - 1]] = value;

    contentType === "about" ? setAboutContent(content) : setMissionContent(content);
  };

  const addItem = (contentType, arrayPath, defaultItem) => {
    setHasChanges(true);
    const content = contentType === "about" ? { ...aboutContent } : { ...missionContent };
    const keys = arrayPath.split(".");
    let curr = content;
    for (let i = 0; i < keys.length; i++) curr = curr[keys[i]];
    curr.push(defaultItem);
    contentType === "about" ? setAboutContent(content) : setMissionContent(content);
  };

  const removeItem = (contentType, arrayPath, index) => {
    setHasChanges(true);
    const content = contentType === "about" ? { ...aboutContent } : { ...missionContent };
    const keys = arrayPath.split(".");
    let curr = content;
    for (let i = 0; i < keys.length; i++) curr = curr[keys[i]];
    curr.splice(index, 1);
    contentType === "about" ? setAboutContent(content) : setMissionContent(content);
  };

  const renderAboutEditor = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Hero Section
        </h2>
        <input
          type="text"
          value={aboutContent.hero.title}
          onChange={(e) => updateField("about", "hero.title", e.target.value)}
          placeholder="Hero Title"
          className="w-full border rounded p-2 my-2"
        />
        <input
          type="text"
          value={aboutContent.hero.highlight}
          onChange={(e) => updateField("about", "hero.highlight", e.target.value)}
          placeholder="Hero Highlight"
          className="w-full border rounded p-2 my-2"
        />
        <textarea
          value={aboutContent.hero.description}
          onChange={(e) => updateField("about", "hero.description", e.target.value)}
          placeholder="Hero Description"
          className="w-full border rounded p-2 my-2"
        />
      </section>

      {/* Story Section */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Story Section
        </h2>
        <input
          type="text"
          value={aboutContent.story.title}
          onChange={(e) => updateField("about", "story.title", e.target.value)}
          placeholder="Story Title"
          className="w-full border rounded p-2 my-2"
        />
        {aboutContent.story.paragraphs.map((para, i) => (
          <textarea
            key={i}
            value={para}
            onChange={(e) => updateField("about", `story.paragraphs.${i}`, e.target.value)}
            placeholder={`Paragraph ${i + 1}`}
            className="w-full border rounded p-2 my-2"
          />
        ))}
        <button
          onClick={() => addItem("about", "story.paragraphs", "")}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus className="w-4 h-4" /> Add Paragraph
        </button>
        <input
          type="text"
          value={aboutContent.story.quote}
          onChange={(e) => updateField("about", "story.quote", e.target.value)}
          placeholder="Quote"
          className="w-full border rounded p-2 my-2"
        />
        <input
          type="text"
          value={aboutContent.story.quoteAuthor}
          onChange={(e) => updateField("about", "story.quoteAuthor", e.target.value)}
          placeholder="Quote Author"
          className="w-full border rounded p-2 my-2"
        />
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5" /> Features Section
        </h2>
        {aboutContent.features.map((feature, i) => (
          <div key={i} className="space-y-2 border p-4 rounded my-2">
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateField("about", `features.${i}.title`, e.target.value)}
              placeholder="Feature Title"
              className="w-full border rounded p-2"
            />
            <textarea
              value={feature.description}
              onChange={(e) => updateField("about", `features.${i}.description`, e.target.value)}
              placeholder="Feature Description"
              className="w-full border rounded p-2"
            />
            <button
              onClick={() => removeItem("about", "features", i)}
              className="flex items-center gap-2 text-red-600 mt-2"
            >
              <Trash2 className="w-4 h-4" /> Remove Feature
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("about", "features", { title: "", description: "" })}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </section>

      {/* Vision Section */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Vision Section
        </h2>
        <input
          type="text"
          value={aboutContent.vision.title}
          onChange={(e) => updateField("about", "vision.title", e.target.value)}
          placeholder="Vision Title"
          className="w-full border rounded p-2 my-2"
        />
        <textarea
          value={aboutContent.vision.description}
          onChange={(e) => updateField("about", "vision.description", e.target.value)}
          placeholder="Vision Description"
          className="w-full border rounded p-2 my-2"
        />
      </section>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" /> Save About Page Content
      </button>
    </div>
  );

  const renderMissionEditor = () => {
    /* same as your provided code — unchanged */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 lg:pl-[224px] px-4 pb-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Edit2 className="w-6 h-6" /> Admin Content Editor
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-2 rounded ${activeTab === "about" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              About Page
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-4 py-2 rounded ${activeTab === "mission" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Mission Page
            </button>
          </div>
        </div>

        {activeTab === "about" ? renderAboutEditor() : renderMissionEditor()}
      </div>
    </div>
  );
}
