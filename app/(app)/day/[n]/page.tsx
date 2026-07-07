import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DayDetail from "@/components/DayDetail";
import { getDay } from "@/lib/plan";

export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const plan = getDay(Number(n));
  return {
    title: plan ? `Day ${plan.day}: ${plan.title}` : "Day not found",
  };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const num = Number(n);
  if (!Number.isInteger(num) || num < 1 || num > 100) notFound();
  return <DayDetail day={num} />;
}
