import type { Metadata } from "next";
import Complete from "@/components/Complete";

export const metadata: Metadata = {
  title: "Challenge complete",
};

export default function CompletePage() {
  return <Complete />;
}
