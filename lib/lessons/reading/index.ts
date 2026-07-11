// Reading-pack registry. The 120-day course ships as 12 packs of 10 days;
// each pack file holds the per-day content and core.ts expands it into the
// full structured reading. All 12 packs are registered — every day of the
// curriculum now has its course reading inside the Understand stage.

import type { ReadingData } from "./core";
import { PACK01 } from "./pack01";
import { PACK02 } from "./pack02";
import { PACK03 } from "./pack03";
import { PACK04 } from "./pack04";
import { PACK05 } from "./pack05";
import { PACK06 } from "./pack06";
import { PACK07 } from "./pack07";
import { PACK08 } from "./pack08";
import { PACK09 } from "./pack09";
import { PACK10 } from "./pack10";
import { PACK11 } from "./pack11";
import { PACK12 } from "./pack12";

export { buildReading, PROJECT_SIGNAL, type Reading, type ReadingData } from "./core";

const PACKS: Record<number, ReadingData> = {
  ...PACK01,
  ...PACK02,
  ...PACK03,
  ...PACK04,
  ...PACK05,
  ...PACK06,
  ...PACK07,
  ...PACK08,
  ...PACK09,
  ...PACK10,
  ...PACK11,
  ...PACK12,
};

export function readingDataFor(day: number): ReadingData | null {
  return PACKS[day] ?? null;
}

/** Days covered by a reading pack — should be all 120. */
export function readingCoverage(): number {
  return Object.keys(PACKS).length;
}
