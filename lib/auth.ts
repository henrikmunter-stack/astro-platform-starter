import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST ?? "smtp.resend.com",
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER ?? "resend",
          pass: process.env.RESEND_API_KEY ?? process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM ?? "HjemTrygg <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        if (resend) {
          await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: "Logg inn på HjemTrygg",
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
                <h1 style="font-size:22px;font-weight:600;color:#1B4F72;margin-bottom:8px">HjemTrygg</h1>
                <p style="color:#1C2833;font-size:16px;margin-bottom:24px">Klikk på knappen under for å logge inn. Lenken er gyldig i 24 timer.</p>
                <a href="${url}" style="display:inline-block;background:#1B4F72;color:#fff;font-weight:600;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:15px">Logg inn</a>
                <p style="color:#5d6b7a;font-size:13px;margin-top:24px">Hvis du ikke ba om denne e-posten kan du ignorere den.</p>
              </div>
            `,
          });
        } else {
          throw new Error("RESEND_API_KEY er ikke satt");
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        (session.user as { role?: string }).role = (user as { role?: string }).role;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.subscription.create({
        data: {
          userId: user.id!,
          plan: "demo",
          status: "free",
        },
      });
    },
  },
  pages: {
    signIn: "/logg-inn",
    verifyRequest: "/sjekk-epost",
    error: "/auth/feil",
  },
});
