import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Workspace from "@/components/workspace/Workspace";
import { getDay, TOTAL_DAYS } from "@/lib/plan";

export function generateStaticParams() {
  return Array.from({ length: TOTAL_DAYS }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const plan = getDay(Number(n));
  return {
    title: plan
      ? `Day ${plan.day} Workspace: ${plan.title}`
      : "Day not found",
  };
}

export default async function LearnDayPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const day = Number(n);
  if (!getDay(day)) notFound();
  return <Workspace day={day} />;
}
