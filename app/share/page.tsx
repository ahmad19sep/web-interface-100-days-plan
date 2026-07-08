import type { Metadata } from "next";
import AuthGate from "@/components/AuthGate";
import ShareCards from "@/components/ShareCards";

export const metadata: Metadata = {
  title: "Your progress card",
};

export default function SharePage() {
  return (
    <AuthGate>
      <ShareCards />
    </AuthGate>
  );
}
