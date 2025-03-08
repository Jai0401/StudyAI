import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"

export default async function Login() {
  const session = await getServerSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex items-center justify-center py-20">
        <LoginForm />
      </main>
    </div>
  )
}

