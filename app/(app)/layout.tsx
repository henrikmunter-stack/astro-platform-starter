// MIDLERTIDIG: Autentisering deaktivert for visuell testing.
// Skru på igjen før launch.
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/AppSidebar";

const mockUser = { id: "preview", name: "Test Bruker", email: "test@hjemtrygg.no", role: "admin" };

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  // if (!session?.user) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <div className="flex h-screen bg-[#F4F6F7] overflow-hidden">
      <AppSidebar user={mockUser} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
