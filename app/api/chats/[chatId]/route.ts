import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { chatId } = params
    
    // Initialize Supabase using your utility function
    const supabase = await createClient()
    
    // Get current session
    const { data, error: userError } = await supabase.auth.getUser()
    
    if (userError || !data?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the chat session
    const { data: chatSession, error: chatError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', data.user.id)
      .single()
      
    if (chatError || !chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }
    
    return NextResponse.json(chatSession)
  } catch (error) {
    console.error(`Error in GET /api/chats/${params.chatId}:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { chatId } = params
    const { messages } = await req.json()
    
    // Initialize Supabase using your utility function
    const supabase = await createClient()
    
    // Get current user
    const { data, error: userError } = await supabase.auth.getUser()
    
    if (userError || !data?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify chat belongs to user
    const { data: chatSession, error: chatError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .eq('user_id', data.user.id)
      .single()
    
    if (chatError || !chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }
    
    // Update the chat session with new messages
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)
      
    if (updateError) {
      console.error('Error updating chat session:', updateError)
      return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in PUT /api/chats/${params.chatId}:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { chatId } = params
    
    // Initialize Supabase using your utility function
    const supabase = await createClient()
    
    // Get current user
    const { data, error: userError } = await supabase.auth.getUser()
    
    if (userError || !data?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Delete the chat session
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', chatId)
      .eq('user_id', data.user.id)
      
    if (error) {
      console.error('Error deleting chat session:', error)
      return NextResponse.json({ error: 'Failed to delete chat session' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/chats/${params.chatId}:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}