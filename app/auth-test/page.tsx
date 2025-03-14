import ClientAuthComponent from '@/components/auth/client-component'
import ServerAuthComponent from '@/components/auth/server-component'

export default async function AuthTestPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Test Page</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-center">Client-Side Authentication</h2>
        <ClientAuthComponent />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-center">Server-Side Authentication</h2>
        <ServerAuthComponent />
      </div>
      
      <div className="mt-8 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
        <h3 className="font-medium text-lg mb-2">Authentication Notes</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Client and server auth states should match when correctly configured</li>
          <li>Server-side uses <code>createClient()</code> from <code>utils/supabase/server.ts</code></li>
          <li>Client-side uses <code>createClient()</code> from <code>utils/supabase/client.ts</code></li>
          <li>For server-side auth verification, always use <code>supabase.auth.getUser()</code></li>
          <li>Middleware automatically refreshes the auth token</li>
        </ul>
      </div>
    </div>
  )
}