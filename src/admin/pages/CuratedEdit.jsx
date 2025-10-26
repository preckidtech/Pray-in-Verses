import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import toast from "react-hot-toast";
import VERSE_COUNTS from "../../constants/verse-counts.json";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <div className="text-sm text-gray-700">{label}</div>
    {children}
  </label>
);

const CANONICAL_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
  "Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians",
  "Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
  "Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

const BOOK_ALIASES = {
  "Song of Solomon": ["Song of Songs", "Canticles"],
  "Psalms": ["Psalm"],
  "1 Samuel": ["1Samuel","I Samuel","1-samuel"],
  "2 Samuel": ["2Samuel","II Samuel","2-samuel"],
  "1 Kings": ["1Kings","I Kings","1-kings"],
  "2 Kings": ["2Kings","II Kings","2-kings"],
  "1 Chronicles": ["1Chronicles","I Chronicles","1-chronicles"],
  "2 Chronicles": ["2Chronicles","II Chronicles","2-chronicles"],
  "1 Corinthians": ["1Corinthians","I Corinthians","1-corinthians"],
  "2 Corinthians": ["2Corinthians","II Corinthians","2-corinthians"],
  "1 Thessalonians": ["1Thessalonians","I Thessalonians","1-thessalonians"],
  "2 Thessalonians": ["2Thessalonians","II Thessalonians","2-thessalonians"],
  "1 Timothy": ["1Timothy","I Timothy","1-timothy"],
  "2 Timothy": ["2Timothy","II Timothy","2-timothy"],
  "1 Peter": ["1Peter","I Peter","1-peter"],
  "2 Peter": ["2Peter","II Peter","2-peter"],
  "1 John": ["1John","I John","1-john"],
  "2 John": ["2John","II John","2-john"],
  "3 John": ["3John","III John","3-john"],
};

function slugifyBook(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase();
}
function candidatesForBook(book) {
  const trimmed = String(book || "").trim();
  if (!trimmed) return [];
  const cands = [trimmed, slugifyBook(trimmed)];
  const aliases = BOOK_ALIASES[trimmed];
  if (aliases) cands.push(...aliases, ...aliases.map(slugifyBook));
  return [...new Set(cands.filter(Boolean))];
}

// local verse-count helpers
function getLocalChapters(book) {
  const arr = VERSE_COUNTS[book];
  if (Array.isArray(arr) && arr.length) return arr.map((_, i) => i + 1);
  for (const [canon, counts] of Object.entries(VERSE_COUNTS)) {
    const aliases = BOOK_ALIASES[canon] || [];
    if (canon === book || aliases.includes(book)) {
      return Array.isArray(counts) ? counts.map((_, i) => i + 1) : [];
    }
  }
  return [];
}
function getLocalVerses(book, chapter) {
  const arr = VERSE_COUNTS[book];
  if (Array.isArray(arr) && arr[chapter - 1] > 0) {
    const n = arr[chapter - 1];
    return Array.from({ length: n }, (_, i) => i + 1);
  }
  for (const [canon, counts] of Object.entries(VERSE_COUNTS)) {
    const aliases = BOOK_ALIASES[canon] || [];
    if (canon === book || aliases.includes(book)) {
      const n = Array.isArray(counts) ? counts[chapter - 1] : 0;
      return n ? Array.from({ length: n }, (_, i) => i + 1) : [];
    }
  }
  return [];
}

export default function CuratedEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const isCreate = id === undefined;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [data, setData] = React.useState({
    book: "",
    chapter: "",
    verse: "",
    theme: "",
    scriptureText: "",
    insight: "",
    prayerPointsMultiline: "",
    closing: "",
    state: "REVIEW", // default state for new entries
  });

  const [chapters, setChapters] = React.useState([]);
  const [verses, setVerses] = React.useState([]);
  const [chaptersLoading, setChaptersLoading] = React.useState(false);
  const [versesLoading, setVersesLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!isCreate) {
        const res = await api.getCurated(id);
        if (res?.data) {
          const it = res.data;
          setData({
            book: it.book || "",
            chapter: String(it.chapter ?? ""),
            verse: String(it.verse ?? ""),
            theme: it.theme || "",
            scriptureText: it.scriptureText || "",
            insight: it.insight || "",
            prayerPointsMultiline: (it.prayerPoints || []).join("\n"),
            closing: it.closing || "",
            state: it.state || "REVIEW",
          });
        } else {
          toast.error(res?.message || "Not found");
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function write(partial) {
    setData((d) => ({ ...d, ...partial }));
  }

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const book = data.book?.trim();
      setChapters([]);
      setVerses([]);
      if (!book) return;

      const local = getLocalChapters(book);
      if (local.length) {
        if (!alive) return;
        setChapters(local);
        if (!local.includes(Number(data.chapter))) write({ chapter: "", verse: "" });
        return;
      }

      setChaptersLoading(true);
      try {
        const tries = candidatesForBook(book);
        for (const key of tries) {
          const res = await api.chapters(key);
          let list = res?.data?.chapters ?? res?.chapters ?? res ?? [];
          if (!Array.isArray(list)) list = [];
          const norm = list.map(Number).filter((n) => Number.isFinite(n) && n > 0);
          if (norm.length) {
            if (!alive) return;
            setChapters(norm);
            if (!norm.includes(Number(data.chapter))) write({ chapter: "", verse: "" });
            return;
          }
        }
        toast.error("Couldn’t load chapters for the selected book");
      } finally {
        if (alive) setChaptersLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.book]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const book = data.book?.trim();
      const chapterNum = Number(data.chapter);
      setVerses([]);
      if (!book || !chapterNum) return;

      const local = getLocalVerses(book, chapterNum);
      if (local.length) {
        if (!alive) return;
        setVerses(local);
        if (!local.includes(Number(data.verse))) write({ verse: "" });
        return;
      }

      setVersesLoading(true);
      try {
        const tries = candidatesForBook(book);
        for (const key of tries) {
          const res = await api.verses(key, chapterNum);
          let list = res?.data?.verses ?? res?.verses ?? res ?? [];
          if (!Array.isArray(list)) list = [];
          const norm = list.map(Number).filter((n) => Number.isFinite(n) && n > 0);
          if (norm.length) {
            if (!alive) return;
            setVerses(norm);
            if (!norm.includes(Number(data.verse))) write({ verse: "" });
            return;
          }
        }
        toast.error("Couldn’t load verses for the selected chapter");
      } finally {
        if (alive) setVersesLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.book, data.chapter]);

  function buildPayload() {
    if (!data.book.trim()) return toast.error("Please select a book");
    const chapterNum = Number(data.chapter);
    const verseNum = Number(data.verse);
    if (!chapterNum) return toast.error("Please select a chapter");
    if (!verseNum) return toast.error("Please select a verse");

    const pp = data.prayerPointsMultiline
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      book: data.book.trim(),
      chapter: chapterNum,
      verse: verseNum,
      theme: data.theme.trim(),
      scriptureText: data.scriptureText.trim(),
      insight: data.insight.trim(),
      prayerPoints: pp,
      closing: data.closing.trim(),
    };
  }

  async function saveOnly() {
    setSaving(true);
    const payload = buildPayload();
    if (!payload) return setSaving(false);

    const res = isCreate ? await api.createCurated(payload) : await api.updateCurated(id, payload);
    setSaving(false);

    if (res?.data || res?.ok) {
      toast.success("Saved");
      if (isCreate) {
        const newId = res?.data?.id || res?.id;
        return nav(`/admin/curated/${newId}`, { replace: true });
      }
    } else {
      toast.error(res?.message || "Save failed");
    }
  }

  async function saveAndPublish() {
    setSaving(true);
    let currentId = id;

    // 1) create or update
    const payload = buildPayload();
    if (!payload) { setSaving(false); return; }

    if (isCreate) {
      const created = await api.createCurated(payload);
      if (!(created?.data || created?.id)) {
        setSaving(false);
        return toast.error(created?.message || "Create failed");
      }
      currentId = created?.data?.id || created?.id;
      // no navigate to edit; we’ll go to the list after publishing
    } else {
      const updated = await api.updateCurated(id, payload);
      if (!(updated?.data || updated?.ok)) {
        setSaving(false);
        return toast.error(updated?.message || "Save failed");
      }
    }

    // 2) publish
    const res = await api.transitionCurated(currentId, "PUBLISHED");
    setSaving(false);

    if (res?.ok) {
      toast.success("Published");
      // redirect to curated dashboard after publish
      nav("/admin/curated", { replace: true });
    } else {
      toast.error(res?.message || "Publish failed");
    }
  }

  async function onPublishToggle() {
    // For new entries, do save+publish
    if (isCreate) return saveAndPublish();

    const target = data.state === "PUBLISHED" ? "REVIEW" : "PUBLISHED";
    setSaving(true);
    const res = await api.transitionCurated(id, target);
    setSaving(false);

    if (res?.ok) {
      const nextState = target === "PUBLISHED" ? "PUBLISHED" : "REVIEW";
      write({ state: nextState });
      toast.success(nextState === "PUBLISHED" ? "Published" : "Sent to Review");
      if (nextState === "PUBLISHED") {
        // go back to the curated dashboard after publishing
        nav("/admin/curated", { replace: true });
      }
    } else {
      toast.error(res?.message || "Action failed");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">
            {isCreate ? "New Curated Prayer" : "Edit Curated Prayer"}
          </h1>
          {!isCreate && (
            <span className="px-2 py-1 text-xs rounded bg-gray-100">{data.state}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/curated" className="px-3 py-2 border rounded-md">
            Back
          </Link>

          {/* Publish: available on create and edit */}
          <button
            onClick={onPublishToggle}
            className="px-3 py-2 rounded-md bg-green-600 text-white"
            disabled={saving}
          >
            {isCreate ? "Publish" : (data.state === "PUBLISHED" ? "Send to Review" : "Publish")}
          </button>

          <button
            onClick={saveOnly}
            className="px-3 py-2 rounded-md bg-gray-900 text-white"
            disabled={saving}
          >
            {saving ? "Saving…" : (isCreate ? "Save Draft" : "Save")}
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <Field label="Book">
              <select
                className="w-full border rounded-md px-3 py-2"
                value={data.book}
                onChange={(e) => {
                  const nextBook = e.target.value;
                  setChapters([]);
                  setVerses([]);
                  write({ book: nextBook, chapter: "", verse: "" });
                }}
              >
                <option value="">Select a book</option>
                {CANONICAL_BOOKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Chapter">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={data.chapter}
                  onChange={(e) => {
                    const next = e.target.value;
                    setVerses([]);
                    write({ chapter: next, verse: "" });
                  }}
                  disabled={!data.book || chaptersLoading}
                >
                  <option value="">
                    {!data.book ? "Select a book first" : (chaptersLoading ? "Loading…" : "Select chapter")}
                  </option>
                  {chapters.map((c) => (
                    <option key={c} value={String(c)}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Verse">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={data.verse}
                  onChange={(e) => write({ verse: e.target.value })}
                  disabled={!data.book || !data.chapter || versesLoading}
                >
                  <option value="">
                    {!data.chapter ? "Select chapter first" : (versesLoading ? "Loading…" : "Select verse")}
                  </option>
                  {verses.map((v) => (
                    <option key={v} value={String(v)}>{v}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Theme / Focus">
              <input
                className="w-full border rounded-md px-3 py-2"
                value={data.theme}
                onChange={(e) => write({ theme: e.target.value })}
                placeholder="God’s Provision"
              />
            </Field>

            <Field label="Scripture Reference (text of the verse)">
              <textarea
                className="w-full border rounded-md px-3 py-2 h-24"
                value={data.scriptureText}
                onChange={(e) => write({ scriptureText: e.target.value })}
                placeholder="In the beginning, God created the heavens and the earth. (Genesis 1:1)"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <Field label="Short Insight / Reflection">
              <textarea
                className="w-full border rounded-md px-3 py-2 h-24"
                value={data.insight}
                onChange={(e) => write({ insight: e.target.value })}
                placeholder="Brief pastoral reflection here…"
              />
            </Field>

            <Field label="Prayer Points (one per line)">
              <textarea
                className="w-full border rounded-md px-3 py-2 h-32"
                value={data.prayerPointsMultiline}
                onChange={(e) => write({ prayerPointsMultiline: e.target.value })}
                placeholder={"Thank God for...\nAsk for...\nPray that..."}
              />
            </Field>

            <Field label="Closing Prayer / Confession">
              <textarea
                className="w-full border rounded-md px-3 py-2 h-20"
                value={data.closing}
                onChange={(e) => write({ closing: e.target.value })}
                placeholder="I confess..."
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
