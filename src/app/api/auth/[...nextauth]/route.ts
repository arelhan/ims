import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "../../../../../src/lib/prisma";
import { UserRole as PrismaUserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@domain.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("NextAuth authorize called with email:", credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("User found:", user ? "Yes" : "No");
          if (!user) {
            console.log("User not found for email:", credentials.email);
            return null;
          }

          // Şifre karşılaştırması (bcrypt ile hashlenmiş şifre)
          const isValid = await compare(credentials.password, user.password);
          console.log("Password valid:", isValid);
          
          if (!isValid) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("Login successful for user:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    updateAge: 60 * 60 * 24, // Session'ı 24 saatte bir güncelle
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // İlk login'de user objesi gelir, sonrasında token üzerinden devam eder
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || PrismaUserRole.USER;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as PrismaUserRole,
        };
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Google ile ilk girişte kullanıcıyı veritabanına ekle
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              password: "", // Google ile girişte şifre yok
              role: PrismaUserRole.USER,
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", code, metadata);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
