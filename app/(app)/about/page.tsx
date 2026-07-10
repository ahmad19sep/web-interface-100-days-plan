import type { Metadata } from "next";
import AboutMe from "@/components/AboutMe";

export const metadata: Metadata = {
  title: "About me",
};

export default function AboutPage() {
  return <AboutMe />;
}
