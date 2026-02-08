import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the root page and static assets through
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  // Redirect everything else to the root
  return NextResponse.redirect(new URL('/', request.url))
}
