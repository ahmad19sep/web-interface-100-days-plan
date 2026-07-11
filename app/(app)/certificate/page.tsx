import type { Metadata } from "next";
import Certificate from "@/components/Certificate";

export const metadata: Metadata = {
  title: "Certification",
};

export default function CertificatePage() {
  return <Certificate />;
}
