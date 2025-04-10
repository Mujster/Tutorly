import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the path exists in your application
  // This is a simplified example - in a real app, you would have a more sophisticated way to check routes
  const path = request.nextUrl.pathname

  // List of valid paths in your application
  const validPaths = ["/", "/about", "/pricing", "/faq", "/contact", "/login", "/signup", "/dashboard","verify"]

  // Check if the path is valid or if it's a static file or API route
  if (!validPaths.includes(path) && !path.startsWith("/_next") && !path.startsWith("/api") && !path.includes(".")) {
    // Redirect to the custom 404 page
    return NextResponse.rewrite(new URL("/not-found", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
