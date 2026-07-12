"use client";

// 👑 CREATOR — attach multiple videos and documents to a day.
//
// Two ways to add a file: paste a link (YouTube, Drive, anything), or upload
// the real file. Uploads go straight from the browser to Vercel Blob via a
// signed token from /api/upload, so a full lecture recording never passes
// through a serverless function. If no Blob store is connected, the upload
// button says so and pasting a link still works.

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { DayDoc, DayVideo } from "@/lib/day-content";

const inputClass =
  "w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

const KIND_LABEL: Record<DayVideo["kind"], string> = {
  concept: "Concept",
  walkthrough: "Code walkthrough",
  mistakes: "Common mistakes",
  briefing: "Build briefing",
};

/** Upload one file to Blob and hand back its public URL. */
function useUploader() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pct, setPct] = useState(0);

  async function send(file: File): Promise<string | null> {
    setBusy(true);
    setError("");
    setPct(0);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (p) => setPct(Math.round(p.percentage)),
      });
      return blob.url;
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Upload failed.";
      // the 503 body from /api/upload carries the "connect a Blob store" hint
      setError(
        raw.includes("storage isn't connected") || raw.includes("503")
          ? "File storage isn't connected yet — in Vercel → Storage, create a Blob store for this project. Pasting a link works meanwhile."
          : raw
      );
      return null;
    } finally {
      setBusy(false);
      setPct(0);
    }
  }

  return { send, busy, error, pct, setError };
}

function UploadButton({
  accept,
  label,
  onUploaded,
}: {
  accept: string;
  label: string;
  onUploaded: (url: string, name: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { send, busy, error, pct } = useUploader();

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // let the same file be picked again
          if (!file) return;
          const url = await send(file);
          if (url) onUploaded(url, file.name);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => ref.current?.click()}
        className="cursor-pointer rounded-[9px] border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.08)] px-3 py-2 font-mono text-[10.5px] tracking-[.06em] text-accent hover:bg-[rgba(34,211,238,.16)] disabled:cursor-default disabled:opacity-60"
      >
        {busy ? `UPLOADING ${pct}%` : label}
      </button>
      {error && (
        <div className="mt-1.5 text-[11.5px] leading-[1.5] text-today">
          {error}
        </div>
      )}
    </div>
  );
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
          🎬 Lesson videos — add as many as you like (YouTube link or upload)
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...videos,
              { title: "", url: "", kind: "concept", required: true },
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
            className="rounded-[12px] border border-edge3 bg-[rgba(9,13,24,.5)] p-3"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={v.title}
                onChange={(e) => set(i, { title: e.target.value })}
                placeholder="Video title"
                className={`${inputClass} min-w-[160px] flex-1`}
              />
              <select
                value={v.kind}
                onChange={(e) =>
                  set(i, { kind: e.target.value as DayVideo["kind"] })
                }
                className="cursor-pointer rounded-[10px] border border-edge3 bg-panel px-2.5 py-2.5 text-[12.5px] text-ink focus:outline-none"
              >
                {(Object.keys(KIND_LABEL) as DayVideo["kind"][]).map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABEL[k]}
                  </option>
                ))}
              </select>
              <label className="flex cursor-pointer items-center gap-1.5 text-[12px] text-mut2">
                <input
                  type="checkbox"
                  checked={v.required}
                  onChange={(e) => set(i, { required: e.target.checked })}
                  className="h-3.5 w-3.5 accent-[#f59e0b]"
                />
                required
              </label>
              <button
                type="button"
                onClick={() => onChange(videos.filter((_, k) => k !== i))}
                title="Remove this video"
                className="cursor-pointer rounded-[8px] border border-[rgba(248,113,113,.3)] px-2 py-1.5 font-mono text-[10px] text-[#fca5a5] hover:bg-[rgba(248,113,113,.1)]"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <input
                type="text"
                value={v.url}
                onChange={(e) => set(i, { url: e.target.value })}
                placeholder="https://youtu.be/… or upload a file →"
                className={`${inputClass} min-w-[200px] flex-1 font-mono text-[12px]`}
              />
              <UploadButton
                accept="video/*"
                label="⬆ UPLOAD VIDEO"
                onUploaded={(url, name) =>
                  set(i, { url, title: v.title || name.replace(/\.[^.]+$/, "") })
                }
              />
            </div>
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
          📎 Documents — PDFs, slides, notebooks, datasets (link or upload)
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
            className="flex flex-wrap items-start gap-2 rounded-[12px] border border-edge3 bg-[rgba(9,13,24,.5)] p-3"
          >
            <input
              type="text"
              value={d.label}
              onChange={(e) => set(i, { label: e.target.value })}
              placeholder="Document name"
              className={`${inputClass} min-w-[150px] flex-1`}
            />
            <input
              type="text"
              value={d.url}
              onChange={(e) => set(i, { url: e.target.value })}
              placeholder="https://… or upload →"
              className={`${inputClass} min-w-[180px] flex-[1.4] font-mono text-[12px]`}
            />
            <UploadButton
              accept=".pdf,.md,.txt,.csv,.zip,.json,.ipynb,.docx,.pptx,image/*"
              label="⬆ UPLOAD DOC"
              onUploaded={(url, name) =>
                set(i, {
                  url,
                  label: d.label || name,
                  kind: name.split(".").pop()?.toLowerCase() ?? "",
                })
              }
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
          <div className="rounded-[12px] border border-dashed border-edge3 px-3 py-3 text-[12px] text-mut3">
            No documents attached yet.
          </div>
        )}
      </div>
    </div>
  );
}
