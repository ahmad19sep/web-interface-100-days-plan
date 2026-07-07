import type { Metadata } from "next";
import ProjectsBoard from "@/components/ProjectsBoard";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return <ProjectsBoard />;
}
