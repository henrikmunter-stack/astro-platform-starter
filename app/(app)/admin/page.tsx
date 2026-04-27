import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];
  return adminEmails.includes(email);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/app");
  }

  const search = searchParams.q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totalUsers = await prisma.user.count({ where: { deletedAt: null } });
  const activeSubscriptions = await prisma.subscription.count({ where: { status: "active" } });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert size={22} className="text-[#1B4F72]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold text-[#1C2833]">Admin</h1>
          <p className="text-[#5d6b7a] text-sm">Oversikt over brukere og abonnementer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Totalt brukere", value: totalUsers },
          { label: "Aktive abonnementer", value: activeSubscriptions },
          { label: "Demo-brukere", value: totalUsers - activeSubscriptions },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm p-5">
            <div className="text-2xl font-semibold text-[#1B4F72]">{value}</div>
            <div className="text-sm text-[#5d6b7a]">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#e5e9ec] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e5e9ec]">
          <form method="GET" className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Søk på navn eller e-post..."
              className="flex-1 h-10 px-3 rounded-md border border-[#e5e9ec] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]"
              aria-label="Søk etter bruker"
            />
            <button
              type="submit"
              className="bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#16405e] transition-colors"
            >
              Søk
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F6F7] border-b border-[#e5e9ec]">
                <th className="text-left p-3 font-semibold text-[#1C2833]">Bruker</th>
                <th className="text-left p-3 font-semibold text-[#1C2833]">Plan</th>
                <th className="text-left p-3 font-semibold text-[#1C2833] hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-semibold text-[#1C2833] hidden lg:table-cell">TryggBot denne mnd</th>
                <th className="text-left p-3 font-semibold text-[#1C2833] hidden lg:table-cell">Registrert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F7]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#F4F6F7]/50">
                  <td className="p-3">
                    <div className="font-medium text-[#1C2833]">{user.name ?? "–"}</div>
                    <div className="text-xs text-[#5d6b7a]">{user.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#1B4F72]/10 text-[#1B4F72]">
                      {user.subscription?.plan ?? "demo"}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-[#5d6b7a] text-xs">
                    {user.subscription?.status ?? "–"}
                  </td>
                  <td className="p-3 hidden lg:table-cell text-[#1C2833]">
                    {user.subscription?.chatMessagesThisMonth ?? 0}
                  </td>
                  <td className="p-3 hidden lg:table-cell text-[#5d6b7a] text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-8 text-[#5d6b7a] text-sm">
            Ingen brukere funnet{search ? ` for søk: "${search}"` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
