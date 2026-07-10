import type { Metadata } from "next";
import JourneyWorld from "@/components/JourneyWorld";

export const metadata: Metadata = {
  title: "Journey world",
};

export default function JourneyPage() {
  return <JourneyWorld />;
}
