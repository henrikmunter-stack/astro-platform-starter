import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { StatsBar } from "@/components/marketing/StatsBar";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { Personas } from "@/components/marketing/Personas";
import { SecurityTrust } from "@/components/marketing/SecurityTrust";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQ } from "@/components/marketing/FAQ";
import { CTABanner } from "@/components/marketing/CTABanner";

export const metadata: Metadata = {
  title: "HjemTrygg – Beredskap gjort enkelt",
  description:
    "Den digitale beredskapsportalen som hjelper norske familier å være forberedt. Sjekklister, lageroversikt, familieplan og TryggBot – alt på ett sted.",
  openGraph: {
    title: "HjemTrygg – Beredskap gjort enkelt",
    description:
      "Den digitale beredskapsportalen som hjelper norske familier å være forberedt.",
    url: "https://hjemtrygg.no",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Features />
      <Personas />
      <SecurityTrust />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
