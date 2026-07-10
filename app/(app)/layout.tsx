import AuthGate from "@/components/AuthGate";
import Sidebar from "@/components/Sidebar";
import WorldChrome from "@/components/WorldChrome";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The 3D world (inside WorldChrome) lives at the layout level so it
  // persists across every route; screens float above it as overlays.
  return (
    <AuthGate>
      <Sidebar />
      <WorldChrome>{children}</WorldChrome>
    </AuthGate>
  );
}
