import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { nanoid } from 'nanoid'

export async function GET() {
  try {

    // Initialize Supabase using your utility function
    const supabase = await createClient()
    
    // Get current session
    const { data, error: userError } = await supabase.auth.getUser()
    
    if (userError || !data?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch chat sessions for the current user
    const { data: chatSessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', data.user.id)
      .order('updated_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching chat sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 })
    }
    
    return NextResponse.json(chatSessions)
  } catch (error) {
    console.error('Error in GET /api/chats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, chatbotId, messages } = await req.json()
    
    // Initialize Supabase using your utility function
    const supabase = await createClient()
    
    // Get current user
    const { data, error: userError } = await supabase.auth.getUser()
    
    if (userError || !data?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Generate a unique ID for the chat session
    const chatId = nanoid()
    
    // Create a new chat session with messages stored in the messages JSONB column
    const { error: chatError } = await supabase
      .from('chat_sessions')
      .insert({
        id: chatId,
        title: title || 'New Chat',
        user_id: data.user.id,
        chatbot_id: chatbotId,
        messages: messages || [], // Store messages directly in the JSONB column
        updated_at: new Date().toISOString()
      })
      
    if (chatError) {
      console.error('Error creating chat session:', chatError)
      return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 })
    }
    
    return NextResponse.json({ id: chatId })
  } catch (error) {
    console.error('Error in POST /api/chats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}