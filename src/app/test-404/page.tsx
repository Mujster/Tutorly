// This is a test page to demonstrate the 404 functionality
import { notFound } from "next/navigation"

export default function TestNotFoundPage() {
  // This will trigger the not-found.tsx page
  notFound()

  // This code will never be reached
  return (
    <div>
      <h1>This page should never be displayed</h1>
    </div>
  )
}
