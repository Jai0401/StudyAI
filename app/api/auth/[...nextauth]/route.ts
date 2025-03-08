import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      // Check if user exists in Supabase
      const { data, error } = await supabase.from("users").select().eq("email", user.email).single()

      // If user doesn't exist, create a new user
      if (error || !data) {
        await supabase.from("users").insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
        })
      }

      return true
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }

