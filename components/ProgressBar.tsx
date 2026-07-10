export function ProgressBar({
  pct,
  color,
}: {
  pct: number;
  color?: string;
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-locked">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: color ?? "linear-gradient(90deg,#0E7490,#22D3EE)",
        }}
      />
    </div>
  );
}
