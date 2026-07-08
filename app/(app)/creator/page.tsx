import type { Metadata } from "next";
import CreatorDashboard from "@/components/CreatorDashboard";

export const metadata: Metadata = {
  title: "Creator dashboard",
};

export default function CreatorPage() {
  return <CreatorDashboard />;
}
