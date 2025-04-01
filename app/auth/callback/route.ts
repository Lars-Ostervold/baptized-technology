import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // Get the redirectTo parameter from the URL
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the original path or fallback to origin if not provided
  const redirectUrl = redirectTo.startsWith('/') 
    ? `${requestUrl.origin}${redirectTo}` 
    : redirectTo

  return NextResponse.redirect(redirectUrl)
}