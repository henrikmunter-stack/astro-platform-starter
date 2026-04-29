import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST ?? "smtp.resend.com",
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER ?? "resend",
          pass:
            process.env.EMAIL_SERVER_PASSWORD ?? process.env.RESEND_API_KEY ?? "",
        },
      },
      from: "HjemTrygg <noreply@hjemtrygg.no>",
      async sendVerificationRequest({ identifier: email, url }) {
        if (process.env.RESEND_API_KEY) {
          const { sendEmail, magicLinkEmailHtml } = await import(
            "@/lib/email"
          );
          await sendEmail({
            to: email,
            subject: "Din innloggingslenke til HjemTrygg",
            html: magicLinkEmailHtml(url),
          });
        } else {
          console.log(`[DEV] Magic link for ${email}: ${url}`);
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
});
