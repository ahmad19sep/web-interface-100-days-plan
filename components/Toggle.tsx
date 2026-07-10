"use client";

export function Toggle({
  on,
  onClick,
  label,
  color = "accent",
}: {
  on: boolean;
  onClick: () => void;
  label?: string;
  color?: "accent" | "today";
}) {
  const trackOn =
    color === "today" ? "rgba(245,181,75,.5)" : "rgba(53,211,153,.5)";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center gap-2 text-[12.5px] text-mut"
    >
      <span
        className="relative h-[26px] w-11 shrink-0 rounded-full transition-colors"
        style={{ background: on ? trackOn : "#232B35" }}
      >
        <span
          className="absolute top-[3px] h-5 w-5 rounded-full bg-ink transition-all"
          style={{ left: on ? 21 : 3 }}
        />
      </span>
      {label}
    </button>
  );
}
