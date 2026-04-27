"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/priser", label: "Priser" },
  { href: "/planer", label: "Planer" },
  { href: "/blogg", label: "Blogg" },
  { href: "/om", label: "Om oss" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-[#e5e9ec] sticky top-0 z-50">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Hovednavigasjon"
      >
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#1B4F72]/10 text-[#1B4F72]"
                  : "text-[#1C2833] hover:bg-gray-100"
              }`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 rounded-md text-sm font-medium text-[#1B4F72] border border-[#1B4F72] hover:bg-[#1B4F72] hover:text-white transition-colors"
          >
            Logg inn
          </Link>
          <Link
            href="/priser"
            className="px-4 py-2 rounded-md text-sm font-semibold bg-[#1B4F72] text-white hover:bg-[#16405e] transition-colors"
          >
            Kom i gang
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md text-[#1C2833] hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Lukk meny" : "Apne meny"}
          aria-expanded={open}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-[#e5e9ec] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                pathname === link.href
                  ? "bg-[#1B4F72]/10 text-[#1B4F72]"
                  : "text-[#1C2833] hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#e5e9ec] flex flex-col gap-2">
            <Link
              href="/api/auth/signin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-md text-sm font-medium text-[#1B4F72] border border-[#1B4F72] text-center"
            >
              Logg inn
            </Link>
            <Link
              href="/priser"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-md text-sm font-semibold bg-[#1B4F72] text-white text-center"
            >
              Kom i gang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
