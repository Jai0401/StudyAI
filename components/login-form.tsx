"use client"

import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to StudyAI</CardTitle>
        <CardDescription>Sign in to access your study materials</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full">
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  )
}

