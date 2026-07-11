import type { Metadata } from "next";
import { Suspense } from "react";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "Set up your track",
};

// Suspense boundary: Onboarding reads useSearchParams (?setup / ?signup)
export default function StartPage() {
  return (
    <Suspense>
      <Onboarding />
    </Suspense>
  );
}
