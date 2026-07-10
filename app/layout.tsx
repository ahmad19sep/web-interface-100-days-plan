import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/site";
import Background3DMount from "@/components/Background3DMount";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.sub}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.tagline,
  metadataBase: new URL(SITE.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Background3DMount />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
