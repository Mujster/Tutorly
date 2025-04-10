"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Plus,
  Mic,
  Send,
  ChevronDown,
  Settings,
  LogOut,
  User,
  FileText,
  LayoutGrid,
  MessageSquare,
  FileQuestion,
  FileAudio,
  FilePlus,
  Loader2,
  Paperclip,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AuthGuard } from "@/components/auth-guard"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Document type
interface Document {
  id: string
  name: string
  type: string
  date: Date
}

// Conversation type
interface Conversation {
  id: string
  title: string
  date: Date
}

export default function DashboardPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  // Sample documents
  useEffect(() => {
    // Simulate fetching documents
    setDocuments([
      { id: "1", name: "Physics Notes.pdf", type: "pdf", date: new Date(2023, 3, 15) },
      { id: "2", name: "Chemistry Slides.pptx", type: "pptx", date: new Date(2023, 4, 20) },
      { id: "3", name: "Math Formulas.docx", type: "docx", date: new Date(2023, 5, 10) },
    ])
  }, [])

  // Sample conversations
  useEffect(() => {
    // Simulate fetching conversations
    setConversations([
      { id: "1", title: "Physics Exam Preparation", date: new Date(2023, 3, 15) },
      { id: "2", title: "Chemistry MCQs Generation", date: new Date(2023, 3, 14) },
      { id: "3", title: "Math Formulas Summary", date: new Date(2023, 3, 14) },
      { id: "4", title: "Biology Notes Analysis", date: new Date(2023, 3, 10) },
      { id: "5", title: "History Timeline Creation", date: new Date(2023, 3, 8) },
      { id: "6", title: "Literature Essay Questions", date: new Date(2023, 3, 5) },
    ])
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let assistantMessage: Message

      // Generate different responses based on input content
      if (inputMessage.toLowerCase().includes("mcq") || inputMessage.toLowerCase().includes("question")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I'd be happy to generate some MCQs for you. Here are 3 sample questions based on your document:

1. What is the primary function of mitochondria in a cell?
   a) Protein synthesis
   b) Energy production
   c) Cell division
   d) Waste removal

2. Which of the following is NOT a noble gas?
   a) Helium
   b) Neon
   c) Oxygen
   d) Argon

3. In the equation E=mc², what does 'c' represent?
   a) Speed of light
   b) Coulomb's constant
   c) Specific heat capacity
   d) Charge

Would you like me to generate more questions or focus on a specific topic?`,
          timestamp: new Date(),
        }
      } else if (inputMessage.toLowerCase().includes("summary") || inputMessage.toLowerCase().includes("summarize")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Here's a summary of the key points from your document:

• The cell is the basic structural and functional unit of all living organisms
• Cells contain various organelles that perform specific functions
• DNA carries genetic information and is located in the nucleus
• Cellular respiration occurs in the mitochondria and produces ATP
• Photosynthesis in plant cells converts light energy to chemical energy

Would you like me to expand on any of these points or generate a more detailed summary?`,
          timestamp: new Date(),
        }
      } else if (inputMessage.toLowerCase().includes("upload") || inputMessage.toLowerCase().includes("document")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I see you want to work with documents. You can upload your study materials by:

1. Clicking the "+" button in the input area
2. Selecting the document from your device
3. Once uploaded, I can analyze it and help you generate:
   • Multiple-choice questions
   • Short answer questions
   • Comprehensive summaries
   • Audio explanations

What type of document would you like to work with today?`,
          timestamp: new Date(),
        }
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I can help you with that. Would you like me to:

• Generate questions from your uploaded documents
• Create summaries of your study materials
• Provide explanations of complex topics
• Convert your notes into audio format
• Prepare a study plan based on your materials

Let me know what you'd prefer, and I'll assist you right away.`,
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  // Group conversations by date
  const todayConversations = conversations.filter((conv) => conv.date.toDateString() === new Date().toDateString())

  const yesterdayConversations = conversations.filter((conv) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return conv.date.toDateString() === yesterday.toDateString()
  })

  const olderConversations = conversations.filter((conv) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return (
      conv.date.toDateString() !== new Date().toDateString() && conv.date.toDateString() !== yesterday.toDateString()
    )
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Simulate file upload
    setIsLoading(true)

    setTimeout(() => {
      const newDocuments = Array.from(files).map((file) => ({
        id: Date.now().toString(),
        name: file.name,
        type: file.name.split(".").pop() || "",
        date: new Date(),
      }))

      setDocuments((prev) => [...prev, ...newDocuments])

      // Add system message about successful upload
      const uploadMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've successfully uploaded ${files.length} document(s):
        
${newDocuments.map((doc, index) => `${index + 1}. ${doc.name}`).join("\n")}

What would you like to do with these documents? I can:
• Generate MCQs
• Create short questions
• Develop long-form questions
• Produce an audio transcript
• Prepare a comprehensive summary`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, uploadMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-40 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
            showSidebar ? "left-0" : "-left-full md:-left-64"
          } md:w-64 w-3/4`}
        >
          {/* New Chat Button */}
          <div className="p-3">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-300 border-gray-700 hover:bg-gray-800 rounded-md"
              onClick={() => setMessages([])}
            >
              <Plus className="mr-2 h-4 w-4" />
              New chat
            </Button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 py-2 h-[calc(100%-8rem)]">
            {todayConversations.length > 0 && (
              <>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Today</h3>
                <ul className="space-y-1 mb-4">
                  {todayConversations.map((conv) => (
                    <li key={conv.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:bg-gray-800 rounded-md"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span className="truncate">{conv.title}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {yesterdayConversations.length > 0 && (
              <>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Yesterday</h3>
                <ul className="space-y-1 mb-4">
                  {yesterdayConversations.map((conv) => (
                    <li key={conv.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:bg-gray-800 rounded-md"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span className="truncate">{conv.title}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {olderConversations.length > 0 && (
              <>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Previous 7 Days</h3>
                <ul className="space-y-1 mb-4">
                  {olderConversations.map((conv) => (
                    <li key={conv.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:bg-gray-800 rounded-md"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span className="truncate">{conv.title}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="border-t border-gray-800 p-3 absolute bottom-0 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800 rounded-md">
                  <User className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-gray-300">
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="hover:bg-gray-800 focus:bg-gray-800"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="hover:bg-gray-800 focus:bg-gray-800"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-800 focus:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full bg-gray-900 relative">

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8">
                <div className="mb-8">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-gray-100">Welcome to Tutorly</h2>
                  <p className="text-gray-400 max-w-md">
                    Upload your study materials and ask questions to generate personalized learning content.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center justify-center text-left bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 rounded-xl"
                  >
                    <div className="w-full flex items-start mb-2">
                      <FileQuestion className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Generate MCQs</span>
                    </div>
                    <p className="text-xs text-gray-400 w-full">Create multiple-choice questions from your documents</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center justify-center text-left bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 rounded-xl"
                  >
                    <div className="w-full flex items-start mb-2">
                      <FileQuestion className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Conceptual Questions</span>
                    </div>
                    <p className="text-xs text-gray-400 w-full">Generate concise questions to test your knowledge</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center justify-center text-left bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 rounded-xl"
                  >
                    <div className="w-full flex items-start mb-2">
                      <FileAudio className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">Audio Explanations</span>
                    </div>
                    <p className="text-xs text-gray-400 w-full">Create audio summaries of your study materials</p>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center justify-center text-left bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 rounded-xl"
                  >
                    <div className="w-full flex items-start mb-2">
                      <FilePlus className="h-5 w-5 text-primary mr-2" />
                      <span className="font-medium">PDF Summaries</span>
                    </div>
                    <p className="text-xs text-gray-400 w-full">Generate comprehensive PDF summaries</p>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } max-w-4xl mx-auto w-full`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[90%] md:max-w-[85%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {message.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start max-w-4xl mx-auto w-full">
                    <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Tutorly is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-2xl p-2 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask anything about your documents..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="min-h-[40px] max-h-[200px] bg-transparent border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-100 placeholder-gray-500 resize-none p-2 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />

                <div className="flex items-center gap-2 p-2 border-t border-gray-700 mt-1">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-700">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </label>

                  <div className="flex-grow"></div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">
                Tutorly can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
