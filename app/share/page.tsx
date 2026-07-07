import type { Metadata } from "next";
import ShareCards from "@/components/ShareCards";

export const metadata: Metadata = {
  title: "Your progress card",
};

export default function SharePage() {
  return <ShareCards />;
}
