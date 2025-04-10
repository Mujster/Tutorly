"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div
            className={`absolute inset-0 bg-lime-300 rounded-full transform scale-75 rotate-45 transition-all duration-700 ${
              isAnimated ? "opacity-60" : "opacity-0"
            }`}
            style={{ transformOrigin: "center" }}
          ></div>
          <svg
            className="relative z-10 w-full h-full"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M250 180C250 180 230 120 180 120C130 120 120 180 120 180"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M180 120C180 120 190 140 180 160C170 180 150 180 150 180"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M180 280C180 280 120 270 120 220C120 170 180 160 180 160"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M180 160C180 160 200 170 210 190C220 210 210 230 210 230"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M210 230L240 260" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M240 260L270 230" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M270 230L300 260" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M300 260L330 230" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <circle cx="180" cy="140" r="10" fill="white" stroke="black" strokeWidth="4" />
            <circle cx="165" cy="140" r="2" fill="black" />
            <path d="M175 150C175 150 180 155 185 150" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <path d="M330 230L330 180L210 180L210 230" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path
              d="M330 180C330 180 340 175 340 165C340 155 330 150 330 150"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="330" cy="150" r="20" stroke="black" strokeWidth="4" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4">Error 404: Page not found!</h1>
        <p className="text-lg text-gray-700 mb-8">
          We've looked everywhere but couldn't find the page you were looking for.
        </p>

        {/* Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go to Home Page
        </Link>
      </div>
    </div>
  )
}
