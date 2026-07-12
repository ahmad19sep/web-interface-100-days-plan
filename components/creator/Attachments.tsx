"use client";

// 👑 CREATOR — attach multiple videos and documents to a day, by link.
//
// Videos: any YouTube link, or a direct file URL (.mp4/.webm) which plays in
// the built-in player with real watch tracking.
// Documents: Google Docs/Sheets/Slides, Drive files, Notion, a PDF URL —
// anything with a link. Share it "anyone with the link" so students can open.

import type { DayDoc, DayVideo } from "@/lib/day-content";

const inputClass =
  "w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

/** Label the chip from the link itself — Google Docs, Drive, PDF, … */
function kindFromUrl(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("docs.google.com/document")) return "doc";
  if (u.includes("docs.google.com/spreadsheets")) return "sheet";
  if (u.includes("docs.google.com/presentation")) return "slides";
  if (u.includes("drive.google.com")) return "drive";
  if (u.includes("notion.")) return "notion";
  if (u.includes("colab.research")) return "colab";
  const ext = u.split("?")[0].split(".").pop() ?? "";
  return /^[a-z0-9]{2,5}$/.test(ext) ? ext : "link";
}

// ── videos ───────────────────────────────────────────────────────────────────

export function VideoRows({
  videos,
  onChange,
}: {
  videos: DayVideo[];
  onChange: (next: DayVideo[]) => void;
}) {
  const set = (i: number, patch: Partial<DayVideo>) =>
    onChange(videos.map((v, k) => (k === i ? { ...v, ...patch } : v)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs text-mut3">
          🎬 Lesson videos — add as many as you like (YouTube or direct .mp4 link)
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...videos,
              // the first video is the day's required watch; extras are bonus
              {
                title: "",
                url: "",
                kind: "concept",
                required: videos.length === 0,
              },
            ])
          }
          className="cursor-pointer rounded-[8px] border border-edge2 px-2.5 py-1 font-mono text-[10px] text-mut2 hover:text-ink"
        >
          + ADD VIDEO
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {videos.map((v, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded-[12px] border border-edge3 bg-[rgba(9,13,24,.5)] p-3"
          >
            <input
              type="text"
              value={v.title}
              onChange={(e) => set(i, { title: e.target.value })}
              placeholder="Video title"
              className={`${inputClass} min-w-[150px] flex-1`}
            />
            <input
              type="text"
              value={v.url}
              onChange={(e) => set(i, { url: e.target.value })}
              placeholder="https://youtu.be/…"
              className={`${inputClass} min-w-[200px] flex-[1.5] font-mono text-[12px]`}
            />
            <button
              type="button"
              onClick={() => onChange(videos.filter((_, k) => k !== i))}
              title="Remove this video"
              className="cursor-pointer rounded-[8px] border border-[rgba(248,113,113,.3)] px-2 py-2.5 font-mono text-[10px] text-[#fca5a5] hover:bg-[rgba(248,113,113,.1)]"
            >
              ✕
            </button>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="rounded-[12px] border border-dashed border-edge3 px-3 py-3 text-[12px] text-mut3">
            No videos attached yet — the day shows &quot;coming soon&quot; and
            never blocks the gate.
          </div>
        )}
      </div>
    </div>
  );
}

// ── documents ────────────────────────────────────────────────────────────────

export function DocRows({
  docs,
  onChange,
}: {
  docs: DayDoc[];
  onChange: (next: DayDoc[]) => void;
}) {
  const set = (i: number, patch: Partial<DayDoc>) =>
    onChange(docs.map((d, k) => (k === i ? { ...d, ...patch } : d)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs text-mut3">
          📎 Documents — Google Docs, Sheets, Slides, Drive, Notion, PDF…
        </span>
        <button
          type="button"
          onClick={() => onChange([...docs, { label: "", url: "", kind: "" }])}
          className="cursor-pointer rounded-[8px] border border-edge2 px-2.5 py-1 font-mono text-[10px] text-mut2 hover:text-ink"
        >
          + ADD DOC
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {docs.map((d, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2 rounded-[12px] border border-edge3 bg-[rgba(9,13,24,.5)] p-3"
          >
            <input
              type="text"
              value={d.label}
              onChange={(e) => set(i, { label: e.target.value })}
              placeholder="Document name — e.g. Day 1 setup checklist"
              className={`${inputClass} min-w-[150px] flex-1`}
            />
            <input
              type="text"
              value={d.url}
              onChange={(e) =>
                // re-chip from the link unless the owner typed their own kind
                set(i, {
                  url: e.target.value,
                  kind: kindFromUrl(e.target.value),
                })
              }
              placeholder="https://docs.google.com/document/…"
              className={`${inputClass} min-w-[200px] flex-[1.5] font-mono text-[12px]`}
            />
            <button
              type="button"
              onClick={() => onChange(docs.filter((_, k) => k !== i))}
              title="Remove this document"
              className="cursor-pointer rounded-[8px] border border-[rgba(248,113,113,.3)] px-2 py-2.5 font-mono text-[10px] text-[#fca5a5] hover:bg-[rgba(248,113,113,.1)]"
            >
              ✕
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <div className="rounded-[12px] border border-dashed border-edge3 px-3 py-3 text-[12px] leading-[1.6] text-mut3">
            No documents attached yet. Paste a Google Docs link here — set it to
            &quot;Anyone with the link → Viewer&quot; in Google so your students
            can open it.
          </div>
        )}
      </div>
    </div>
  );
}
