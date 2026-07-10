"use client";

// The app shell from the "Ahmad X World" design: the 3D journey world is
// always alive behind everything (it lives here, in the layout, so it
// survives route changes), and every non-journey screen renders as a
// translucent blurred overlay floating above it with a "✕ BACK TO WORLD"
// escape hatch back into the scene.

import Link from "next/link";
import { usePathname } from "next/navigation";
import JourneyWorld from "./JourneyWorld";

export default function WorldChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const onWorld = pathname.startsWith("/journey");

  return (
    <>
      <JourneyWorld />
      {!onWorld && (
        <div className="fixed inset-x-0 bottom-0 top-[52px] z-40 overflow-y-auto bg-[rgba(6,9,18,.82)] backdrop-blur-[10px] lg:left-[68px] lg:top-0">
          <div className="mx-auto max-w-[920px] px-5 pb-24 pt-5 sm:px-8 sm:pt-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] tracking-[.3em] text-mut3">
                AHMAD X AI
              </div>
              <Link
                href="/journey"
                className="whitespace-nowrap rounded-[10px] border border-edge2 bg-[rgba(13,18,32,.7)] px-4 py-2 font-mono text-[10.5px] tracking-[.1em] !text-mut2 hover:border-[#2d3b57] hover:!text-ink"
              >
                ✕ BACK TO WORLD
              </Link>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
