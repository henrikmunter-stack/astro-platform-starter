"use client";

// MIDLERTIDIG: Autentisering deaktivert for visuell testing.
// Skru på igjen før launch.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Loader2 } from "lucide-react";

export default function LoggInnPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app");
  }, [router]);
  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <div className="text-center">
        <Logo size="lg" className="justify-center mb-4" />
        <Loader2 size={24} className="animate-spin text-[#1B4F72] mx-auto" aria-hidden="true" />
      </div>
    </div>
  );
}
