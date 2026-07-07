import type { Metadata } from "next";
import DashboardHome from "@/components/DashboardHome";

export const metadata: Metadata = {
  title: "Today",
};

export default function TodayPage() {
  return <DashboardHome />;
}
