import AuthGate from "@/components/AuthGate";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="mx-auto w-full min-w-0 max-w-[1030px] flex-1 px-5 py-8 pb-20 sm:px-8 lg:px-[46px] lg:py-[34px]">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
