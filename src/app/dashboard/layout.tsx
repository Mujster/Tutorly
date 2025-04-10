import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tutorly - Your AI Tutor",
  description: "Your AI-powered educational assistant",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen overflow-hidden">{children}</div>
}
