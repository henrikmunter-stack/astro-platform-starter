"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  FileText,
  Bot,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface AppSidebarProps {
  user: User;
}

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/sjekklister", label: "Sjekklister", icon: ClipboardList },
  { href: "/app/lager", label: "Mitt lager", icon: Package },
  { href: "/app/familieplan", label: "Familieplan", icon: Users },
  { href: "/app/dokumenter", label: "Dokumenter", icon: FileText },
  { href: "/app/tryggbot", label: "TryggBot", icon: Bot },
];

const bottomItems = [
  { href: "/app/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/app/innstillinger", label: "Innstillinger", icon: Settings },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#e5e9ec] transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
      aria-label="Appnavigasjon"
    >
      <div className="flex items-center h-16 px-4 border-b border-[#e5e9ec] shrink-0">
        {!collapsed && (
          <Link href="/app" className="text-lg font-semibold text-[#1B4F72] truncate">
            HjemTrygg
          </Link>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-[#e5e9ec] flex items-center justify-center shadow-sm hover:bg-[#F4F6F7] z-10"
        aria-label={collapsed ? "Utvid sidebar" : "Minimer sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={12} aria-hidden="true" />
        ) : (
          <ChevronLeft size={12} aria-hidden="true" />
        )}
      </button>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto" aria-label="Hovednavigasjon">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-[#1B4F72]/10 text-[#1B4F72]"
                  : "text-[#5d6b7a] hover:bg-[#F4F6F7] hover:text-[#1C2833]"
              }`}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {(user.role === "admin" ||
          process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").includes(user.email ?? "")) && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith("/admin")
                ? "bg-[#C0392B]/10 text-[#C0392B]"
                : "text-[#5d6b7a] hover:bg-[#F4F6F7]"
            }`}
            title={collapsed ? "Admin" : undefined}
          >
            <ShieldAlert size={18} className="flex-shrink-0" aria-hidden="true" />
            {!collapsed && <span>Admin</span>}
          </Link>
        )}
      </nav>

      <div className="border-t border-[#e5e9ec] px-2 py-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-[#1B4F72]/10 text-[#1B4F72]"
                  : "text-[#5d6b7a] hover:bg-[#F4F6F7] hover:text-[#1C2833]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#5d6b7a] hover:bg-[#F4F6F7] hover:text-[#C0392B] transition-colors"
          title={collapsed ? "Logg ut" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span>Logg ut</span>}
        </button>

        <div className={`flex items-center gap-2 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-md bg-[#1B4F72] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#1C2833] truncate">{user.name ?? "Bruker"}</p>
              <p className="text-xs text-[#5d6b7a] truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
