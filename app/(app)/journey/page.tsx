import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey world",
};

// The world itself renders persistently from the (app) layout
// (components/WorldChrome.tsx); this route just clears the overlay.
export default function JourneyPage() {
  return null;
}
