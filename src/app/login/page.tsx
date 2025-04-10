"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import { set } from "date-fns"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token,setToken] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      if(response.status === 200){
        setToken(response.data.token);
        const isVerified = response.data.isVerified;
        
        if (!isVerified) {
          localStorage.setItem("pendingVerificationEmail", formData.email)
          setError("Your email is not verified. Please check your inbox or request a new verification link.")
          setIsLoading(false)
          return
        }
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", formData.email);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      console.log(formData.email)
      console.log(token)
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/resend-email", {
        email: formData.email,
        token: token
      });
      
      if (response.status === 200) {
        setError("Verification email sent. Please check your inbox.");
        localStorage.setItem("pendingVerificationEmail", formData.email);
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold">Tutorly</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Log in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 flex flex-row">
              <AlertCircle size={40} className="mr-2" />
              <div>
              <AlertDescription>{error}</AlertDescription>
              {error.includes("not verified") && (
                <Button variant="link" className="p-0 h-auto text-sm underline mt-1" onClick={handleVerifyEmail}>
                  Resend verification email
                </Button>
              )}
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
