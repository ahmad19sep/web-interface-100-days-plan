import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { PROJECTS } from "@/lib/plan";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  return { title: project ? `${project.id} · ${project.name}` : "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
