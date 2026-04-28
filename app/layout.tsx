import type { Metadata } from "next";
import { SessionProvider } from "@/components/app/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HjemTrygg – Beredskap gjort enkelt",
    template: "%s | HjemTrygg",
  },
  description:
    "Den digitale beredskapsportalen som hjelper norske familier å være forberedt. Sjekklister, lageroversikt, familieplan og en smart beredskapsassistent.",
  keywords: ["beredskap", "nødpreparasjon", "familieplan", "hjemmeberedskap", "norge"],
  authors: [{ name: "HjemTrygg AS" }],
  creator: "HjemTrygg AS",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "https://hjemtrygg.no",
    siteName: "HjemTrygg",
    title: "HjemTrygg – Beredskap gjort enkelt",
    description:
      "Den digitale beredskapsportalen som hjelper norske familier å være forberedt.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HjemTrygg – Beredskap gjort enkelt",
    description: "Den digitale beredskapsportalen for norske familier.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
