"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // We use NextAuth's signIn
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid credentials")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <Card className="w-full max-w-[400px] border-border bg-card shadow-2xl z-10">
            <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                    <div className="size-12 rounded-lg bg-primary flex items-center justify-center">
                        <Shield className="size-6 text-primary-foreground" />
                    </div>
                </div>
                <CardTitle className="text-xl font-bold uppercase tracking-tight">MasWebsite.id</CardTitle>
                <CardDescription>Enterprise CRM Access</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                        <Input
                            type="email"
                            placeholder="admin@maswebsite.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-secondary/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                             className="bg-secondary/50"
                        />
                    </div>
                    {error && <p className="text-destructive text-sm font-medium">{error}</p>}
                    <Button type="submit" className="w-full mt-2 uppercase font-bold tracking-widest">
                        Sign In
                    </Button>
                </form>
                <div className="mt-8 text-center">
                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Secure Environment</p>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
