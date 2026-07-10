"use client";

import Link from "next/link";
import { useState } from "react";
import { CREATOR } from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  shippedCount,
  useProgress,
} from "@/lib/store";
import {
  buildCells,
  JourneyCells,
  shareCellColor,
  type CellData,
} from "./JourneyGrid";
import { IconBack, Logo } from "./icons";

// ── canvas rendering ────────────────────────────────────────────────────────

function cssVar(name: string): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || "";
}

function fonts() {
  const mono = cssVar("--font-jbmono") || "ui-monospace, monospace";
  const grotesk = cssVar("--font-grotesk") || "sans-serif";
  return { mono: `${mono}, monospace`, grotesk: `${grotesk}, sans-serif` };
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBase(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const lin = ctx.createLinearGradient(0, 0, W * 0.35, H);
  lin.addColorStop(0, "#0F151C");
  lin.addColorStop(1, "#0A0E13");
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, W, H);
  const rad = ctx.createRadialGradient(W * 0.82, -H * 0.2, 0, W * 0.82, -H * 0.2, W * 0.6);
  rad.addColorStop(0, "rgba(53,211,153,.16)");
  rad.addColorStop(1, "rgba(53,211,153,0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, W, H);
}

function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, mono: string) {
  const g = ctx.createLinearGradient(x, y, x + s, y + s);
  g.addColorStop(0, "#35D399");
  g.addColorStop(1, "#16A97E");
  ctx.fillStyle = g;
  rr(ctx, x, y, s, s, s * 0.28);
  ctx.fill();
  ctx.fillStyle = "#062018";
  ctx.font = `800 ${Math.round(s * 0.5)}px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", x + s / 2, y + s / 2 + s * 0.03);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function drawStrip(
  ctx: CanvasRenderingContext2D,
  cells: CellData[],
  x: number,
  y: number,
  width: number,
  cols: number,
  gap: number
) {
  const cell = (width - (cols - 1) * gap) / cols;
  cells.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.fillStyle = shareCellColor(c);
    rr(ctx, x + col * (cell + gap), y + row * (cell + gap), cell, cell, 2);
    ctx.fill();
  });
  return Math.ceil(cells.length / cols) * (cell + gap) - gap;
}

interface CardData {
  name: string;
  day: number;
  streak: number;
  shipped: number;
  cells: CellData[];
}

function drawLandscape(canvas: HTMLCanvasElement, d: CardData) {
  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const { mono, grotesk } = fonts();
  drawBase(ctx, W, H);
  const P = 56;

  // header
  drawLogo(ctx, P, 52, 40, mono);
  ctx.fillStyle = "#ECE6DA";
  ctx.font = `600 19px ${grotesk}`;
  ctx.fillText("100 Days of Modern AI", P + 52, 78);
  ctx.fillStyle = "#6C7581";
  ctx.font = `13px ${mono}`;
  ctx.textAlign = "right";
  ctx.fillText(`${CREATOR.name.toUpperCase()} · ${CREATOR.handle}`, W - P, 76);
  ctx.textAlign = "left";

  // strip (bottom) — 50 cols, 2 rows
  const stripCols = 50;
  const stripGap = 3;
  const stripH = drawStrip(
    ctx,
    d.cells,
    P,
    H - 52 - ((W - 2 * P - (stripCols - 1) * stripGap) / stripCols) * 2 - stripGap,
    W - 2 * P,
    stripCols,
    stripGap
  );

  // big number block
  const baseY = H - 52 - stripH - 46;
  ctx.fillStyle = "#6C7581";
  ctx.font = `15px ${mono}`;
  ctx.fillText("D A Y", P, baseY - 150);
  ctx.fillStyle = "#35D399";
  ctx.font = `800 150px ${mono}`;
  const num = ("00" + d.day).slice(-3);
  ctx.fillText(num, P - 6, baseY);
  const numW = ctx.measureText(num).width;
  ctx.fillStyle = "#3A4552";
  ctx.font = `34px ${mono}`;
  ctx.fillText("/ 100", P + numW + 22, baseY - 8);

  // name + stats
  const nx = P + numW + 200;
  ctx.fillStyle = "#ECE6DA";
  ctx.font = `700 26px ${grotesk}`;
  ctx.fillText(d.name, nx, baseY - 88);
  ctx.fillStyle = "#F5B54B";
  ctx.font = `700 22px ${mono}`;
  ctx.fillText(`🔥 ${d.streak}`, nx, baseY - 42);
  const sW = ctx.measureText(`🔥 ${d.streak}`).width;
  ctx.fillStyle = "#6C7581";
  ctx.font = `12px ${grotesk}`;
  ctx.fillText("streak", nx, baseY - 22);
  ctx.fillStyle = "#ECE6DA";
  ctx.font = `700 22px ${mono}`;
  ctx.fillText(`${d.shipped}/8`, nx + sW + 46, baseY - 42);
  ctx.fillStyle = "#6C7581";
  ctx.font = `12px ${grotesk}`;
  ctx.fillText("projects", nx + sW + 46, baseY - 22);
}

function drawSquare(canvas: HTMLCanvasElement, d: CardData) {
  const W = 1080;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const { mono, grotesk } = fonts();
  drawBase(ctx, W, H);
  const P = 64;

  drawLogo(ctx, P, P, 44, mono);
  ctx.fillStyle = "#ECE6DA";
  ctx.font = `600 22px ${grotesk}`;
  ctx.fillText("100 Days of Modern AI", P + 58, P + 30);

  // centered number
  ctx.textAlign = "center";
  ctx.fillStyle = "#6C7581";
  ctx.font = `17px ${mono}`;
  ctx.fillText("D A Y", W / 2, 380);
  ctx.fillStyle = "#35D399";
  ctx.font = `800 190px ${mono}`;
  ctx.fillText(("00" + d.day).slice(-3), W / 2, 560);
  ctx.fillStyle = "#3A4552";
  ctx.font = `30px ${mono}`;
  ctx.fillText("/ 100", W / 2, 620);
  ctx.textAlign = "left";

  // name + streak
  ctx.fillStyle = "#ECE6DA";
  ctx.font = `700 28px ${grotesk}`;
  ctx.fillText(`${d.name} · 🔥 ${d.streak}-day streak`, P, H - 300);

  // 20-col strip
  drawStrip(ctx, d.cells, P, H - 260, W - 2 * P, 20, 5);
}

// ── component ───────────────────────────────────────────────────────────────

export default function ShareCards() {
  const state = useProgress();
  const [note, setNote] = useState<string | null>(null);
  const streak = computeStreak(state.checkins);
  const day = Math.min(currentDay(state.checkins), 100);
  const done = Object.keys(state.checkins).length;
  const shipped = shippedCount(state.checkins);
  const name = state.name || "Your Name";
  const cells = buildCells(state.checkins, currentDay(state.checkins));
  const data: CardData = { name, day, streak: streak.streak, shipped, cells };

  function flash(msg: string) {
    setNote(msg);
    setTimeout(() => setNote(null), 2600);
  }

  async function render(
    draw: (c: HTMLCanvasElement, d: CardData) => void
  ): Promise<HTMLCanvasElement> {
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    draw(canvas, data);
    return canvas;
  }

  async function download(kind: "landscape" | "square") {
    const canvas = await render(kind === "landscape" ? drawLandscape : drawSquare);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `day-${day}-of-100-${kind === "landscape" ? "1200x630" : "1080x1080"}.png`;
    a.click();
    flash("PNG downloaded ✓");
  }

  async function copyImage() {
    try {
      const canvas = await render(drawSquare);
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("no blob"))), "image/png")
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      flash("Image copied ✓");
    } catch {
      flash("Copy not supported here — use Download");
    }
  }

  function shareToX() {
    const text = encodeURIComponent(
      `Day ${day} / 100 of #100DaysOfModernAI — ${streak.streak}-day streak 🔥 ${shipped}/8 projects shipped. Building modern AI by hand, in public.`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen px-5 py-9 sm:px-10">
      <Link
        href="/profile"
        className="mb-6 flex items-center gap-[7px] text-[13px] !text-mut2 hover:!text-ink"
      >
        <IconBack />
        Back to profile
      </Link>
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-[30px] text-center">
          <h1 className="mb-1.5 font-display text-[26px] font-bold tracking-[-.02em]">
            Your progress card
          </h1>
          <p className="text-sm text-mut2">
            Auto-generated, on-brand. Post it and pull someone else into the
            challenge.
          </p>
        </div>

        {/* 1200×630 */}
        <div className="mb-3.5 font-mono text-[11.5px] tracking-[.06em] text-mut3">
          1200 × 630 · LANDSCAPE
        </div>
        <div
          className="relative mb-9 w-full overflow-hidden rounded-[18px] border border-edge"
          style={{
            aspectRatio: "1200/630",
            background:
              "radial-gradient(700px 400px at 82% -20%,rgba(53,211,153,.14),transparent 60%),linear-gradient(160deg,#0F151C,#0A0E13)",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-[52px] sm:px-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size={40} radius={11} />
                <div className="font-display text-[19px] font-semibold">
                  100 Days of Modern AI
                </div>
              </div>
              <div className="hidden font-mono text-[13px] text-mut3 sm:block">
                {CREATOR.name.toUpperCase()} · {CREATOR.handle}
              </div>
            </div>
            <div className="flex items-end gap-4 sm:gap-[34px]">
              <div>
                <div className="mb-0.5 font-mono text-[15px] tracking-[.12em] text-mut3">
                  DAY
                </div>
                <div className="font-mono text-[80px] font-extrabold leading-[.82] tracking-[-.04em] text-accent sm:text-[150px]">
                  {("00" + day).slice(-3)}
                </div>
              </div>
              <div className="pb-2 sm:pb-4">
                <div className="font-mono text-xl tracking-[-.02em] text-[#3A4552] sm:text-[34px]">
                  / 100
                </div>
              </div>
              <div className="flex-1 pb-2 sm:pb-3.5">
                <div className="mb-2.5 truncate font-display text-lg font-bold sm:text-[26px]">
                  {name}
                </div>
                <div className="flex gap-[22px]">
                  <div>
                    <div className="font-mono text-base font-bold text-today sm:text-[22px]">
                      🔥 {streak.streak}
                    </div>
                    <div className="text-xs text-mut3">streak</div>
                  </div>
                  <div>
                    <div className="font-mono text-base font-bold text-ink sm:text-[22px]">
                      {shipped}/8
                    </div>
                    <div className="text-xs text-mut3">projects</div>
                  </div>
                </div>
              </div>
            </div>
            <JourneyCells cells={cells} variant="share" cols={50} gap={3} />
          </div>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          {/* 1080×1080 */}
          <div>
            <div className="mb-3.5 font-mono text-[11.5px] tracking-[.06em] text-mut3">
              1080 × 1080 · SQUARE
            </div>
            <div
              className="relative w-full overflow-hidden rounded-[18px] border border-edge"
              style={{
                aspectRatio: "1/1",
                background:
                  "radial-gradient(500px 400px at 50% -10%,rgba(53,211,153,.14),transparent 60%),linear-gradient(160deg,#0F151C,#0A0E13)",
              }}
            >
              <div className="absolute inset-0 flex flex-col p-6 sm:p-11">
                <div className="mb-auto flex items-center gap-[11px]">
                  <Logo size={36} radius={10} />
                  <div className="font-display text-base font-semibold">
                    100 Days of Modern AI
                  </div>
                </div>
                <div className="my-auto text-center">
                  <div className="font-mono text-[13px] tracking-[.12em] text-mut3">
                    DAY
                  </div>
                  <div className="font-mono text-[90px] font-extrabold leading-[.85] tracking-[-.04em] text-accent sm:text-[140px]">
                    {("00" + day).slice(-3)}
                  </div>
                  <div className="font-mono text-[22px] text-[#3A4552]">
                    / 100
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mb-3 truncate font-display text-base font-bold sm:text-xl">
                    {name} · 🔥 {streak.streak}-day streak
                  </div>
                  <JourneyCells cells={cells} variant="share" cols={20} gap={4} />
                </div>
              </div>
            </div>
          </div>

          {/* share panel */}
          <div className="pt-0 md:pt-[34px]">
            <div className="card-std mb-3.5 p-[22px]">
              <div className="mb-3.5 font-display text-[15px] font-semibold">
                Share it
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => download("landscape")}
                  className="btn-primary w-full py-[13px] text-sm !rounded-[11px]"
                >
                  Download PNG · 1200×630
                </button>
                <button
                  type="button"
                  onClick={() => download("square")}
                  className="btn-primary w-full py-[13px] text-sm !rounded-[11px]"
                >
                  Download PNG · 1080×1080
                </button>
                <button
                  type="button"
                  onClick={copyImage}
                  className="btn-ghost w-full py-[13px] text-sm !rounded-[11px]"
                >
                  Copy image
                </button>
                <button
                  type="button"
                  onClick={shareToX}
                  className="btn-ghost w-full py-[13px] text-sm !rounded-[11px]"
                >
                  Share to X / LinkedIn
                </button>
              </div>
              {note && (
                <div className="mt-3 text-center font-mono text-xs text-accent">
                  {note}
                </div>
              )}
            </div>
            <div className="px-1 text-[12.5px] leading-[1.6] text-mut3">
              The card auto-updates with your current day, streak, and journey
              map every time you generate it. Green = done, amber = today.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
