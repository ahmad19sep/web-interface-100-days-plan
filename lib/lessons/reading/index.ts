// Reading-pack registry. The 120-day course ships as 12 packs of 10 days;
// each pack file holds the per-day content and core.ts expands it into the
// full structured reading. Adding a pack = one data file + one line here.

import type { ReadingData } from "./core";
import { PACK01 } from "./pack01";
import { PACK02 } from "./pack02";
import { PACK03 } from "./pack03";
import { PACK04 } from "./pack04";

export { buildReading, PROJECT_SIGNAL, type Reading, type ReadingData } from "./core";

const PACKS: Record<number, ReadingData> = {
  ...PACK01,
  ...PACK02,
  ...PACK03,
  ...PACK04,
};

export function readingDataFor(day: number): ReadingData | null {
  return PACKS[day] ?? null;
}
