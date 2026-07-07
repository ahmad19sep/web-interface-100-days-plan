import type { Metadata } from "next";
import JourneyMap from "@/components/JourneyMap";

export const metadata: Metadata = {
  title: "Journey map",
};

export default function JourneyPage() {
  return <JourneyMap />;
}
