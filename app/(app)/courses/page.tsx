import type { Metadata } from "next";
import CoursesBoard from "@/components/CoursesBoard";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return <CoursesBoard />;
}
