import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CHALLENGE } from "@/lib/plan";
import Background3DMount from "@/components/Background3DMount";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    default: CHALLENGE.title,
    template: `%s · ${CHALLENGE.title}`,
  },
  description: `A daily training log for the ${CHALLENGE.title} public learning challenge — learn, build, prove it, check in. Streak with grace, ${CHALLENGE.projects.length} real projects, one production capstone.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${jbmono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Background3DMount />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
