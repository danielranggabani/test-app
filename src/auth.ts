import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { users } from "@/db/schema"
import { z } from "zod"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data

          if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
             return { id: "0", email: email, role: "admin", name: "Super Admin" }
          }

          try {
              const user = await db.query.users.findFirst({
                where: eq(users.email, email),
              })

              if (!user) return null

              const passwordsMatch = await bcrypt.compare(password, user.password)
              if (passwordsMatch) {
                  return { id: String(user.id), email: user.email, role: user.role, name: "Admin" }
              }
          } catch (e) {
              console.error("Database authentication failed:", e)
              return null
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
})
