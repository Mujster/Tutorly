import Image from "next/image"
import Link from "next/link"
import { Calendar, MessageCircle, Users, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-1 font-bold text-xl">
            <span className="bg-black text-white px-1.5 rounded">T</span>
            <span>utorly</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            FAQ
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>

        <div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-16 pb-24 relative">
        {/* Floating Cards */}
        <div className="relative h-[400px] mb-16">
          {/* Calendar Card */}
          <div className="absolute left-0 top-0 w-64 bg-purple-100 rounded-xl p-4 shadow-lg transform -rotate-3">
            <div className="text-sm font-medium text-purple-800 mb-2">Calendar & Goals</div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs font-medium mb-2">September 2023</div>
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={`header-${i}`} className="text-[10px] text-center text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={`day-${i}`}
                    className={`text-[10px] h-6 flex items-center justify-center rounded-full
                      ${i === 14 ? "bg-purple-500 text-white" : "text-gray-700"}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Calendar className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Beginner Card */}
          <div className="absolute left-[25%] top-[10%] w-64 bg-orange-100 rounded-xl p-4 shadow-lg transform rotate-2">
            <div className="text-sm font-medium text-orange-800 mb-2">Track Your Progress</div>
            <div className="bg-white rounded-lg p-3">
              <h3 className="font-bold text-lg mb-1">Beginner</h3>
              <p className="text-xs text-gray-600 mb-3">You've mastered 20 words in Spanish</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-xs">🇪🇸</span>
                </div>
                <div className="text-xs">Spanish</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-xs">🇫🇷</span>
                </div>
                <div className="text-xs">French</div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="absolute right-[25%] top-[5%] w-64 bg-blue-100 rounded-xl p-4 shadow-lg transform -rotate-2">
            <div className="text-sm font-medium text-blue-800 mb-2">Practice with Others</div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=32&width=32" alt="User" width={32} height={32} />
                </div>
                <div>
                  <div className="text-xs font-medium">Emma Johnson</div>
                  <div className="text-[10px] text-gray-500">Spanish • Level 2</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=32&width=32" alt="User" width={32} height={32} />
                </div>
                <div>
                  <div className="text-xs font-medium">Carlos R.</div>
                  <div className="text-[10px] text-gray-500">Spanish • Native</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=32&width=32" alt="User" width={32} height={32} />
                </div>
                <div>
                  <div className="text-xs font-medium">Sophia L.</div>
                  <div className="text-[10px] text-gray-500">French • Level 3</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Users className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Chat Card */}
          <div className="absolute right-0 top-[15%] w-64 bg-green-100 rounded-xl p-4 shadow-lg transform rotate-3">
            <div className="text-sm font-medium text-green-800 mb-2">Quick Chat</div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">Instant learning through chat in real time</p>
              <div className="flex flex-col gap-2">
                <div className="bg-gray-100 rounded-lg p-2 text-xs">
                  <p>¿Cómo estás hoy?</p>
                </div>
                <div className="bg-green-100 rounded-lg p-2 text-xs self-end">
                  <p>Estoy bien, gracias!</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <MessageCircle className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">Learn any Language Anytime, Anywhere</h1>
          <p className="text-lg text-gray-600 mb-8">
            AI Cultura helps you master new languages with personalized lessons and real-time conversations. Practice
            with AI tutors and connect with native speakers around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
            >
              Get Started
            </Link>
            <Link
              href="/learn-more"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Quick Reply Section */}
        <div className="absolute bottom-24 right-4 md:right-12 flex flex-col items-end">
          <div className="mb-2 text-sm font-medium">Got a Question?</div>
          <div className="mb-4 text-sm">Get a quick reply</div>
          <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>
      </main>
    </div>
  )
}
