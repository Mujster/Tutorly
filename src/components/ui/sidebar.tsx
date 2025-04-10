"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  expanded: true,
  setExpanded: () => {},
})

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { expanded } = useSidebar()

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r transition-all duration-300 flex flex-col",
        expanded ? "w-64" : "w-16",
        className,
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-b p-4", className)}>{children}</div>
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto py-2", className)}>{children}</div>
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-t p-4", className)}>{children}</div>
}

export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  const { expanded } = useSidebar()

  if (!expanded) return null

  return <div className={cn("px-4 py-2 text-xs font-medium text-gray-500 uppercase", className)}>{children}</div>
}

export function SidebarGroupContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>
}

export function SidebarMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={cn("", className)}>{children}</li>
}

export function SidebarMenuButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const { expanded } = useSidebar()

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
        expanded ? "justify-start" : "justify-center",
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== "string") {
          // This is likely an icon
          return child
        }
        if (expanded) {
          // This is likely text
          return child
        }
        return null
      })}
    </button>
  )
}
