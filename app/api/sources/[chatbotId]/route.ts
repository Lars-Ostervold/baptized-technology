import { NextResponse } from 'next/server'
import { embed, generateText } from 'ai'
import { openai } from '@/lib/openai'
import { getAdminClient } from '@/lib/supabase'
import { getChatbotConfig } from '@/lib/chatbot/config'
import { Source } from '@/lib/chatbot/types'

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    // Get the query text and chat history from request
    const { text, chatHistory = [] } = await req.json()
    
    if (!text) {
      return NextResponse.json(
        { error: "Query text is required" },
        { status: 400 }
      )
    }
    
    // Get chatbot configuration
    const config = getChatbotConfig(params.chatbotId)
    
    // Generate a contextual query using the chat history
    const queryText = await generateContextualQuery(text, chatHistory)
    
    // Generate embedding for the enhanced query
    const { embedding } = await generateEmbedding(queryText)
    
    // Query Supabase for relevant documents
    const supabase = getAdminClient()
    const { data: sources, error } = await supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5, // Adjust threshold as needed
        match_count: 5,       // Number of matches to return
        vector_namespace: config.vectorNamespace
      })
    
    if (error) {
      console.error("Error querying vector database:", error)
      return NextResponse.json(
        { error: "Failed to retrieve sources" },
        { status: 500 }
      )
    }

    // Format sources for return
    const formattedSources: Source[] = sources ? sources.map((source: Source) => ({
      id: source.id,
      type: source.type,
      title: source.title,
      content: source.content,
      url: source.url || undefined,
      similarity: source.similarity,
      metadata: source.metadata
    })).slice(0, 2) : [] // Return only top 2 sources
    
    // Also create a formatted context for the AI prompt
    const contextText = sources && sources.length > 0
      ? sources.map((source: Source, i: number) => `Source ${i + 1}: ${source.content}`).join("\n\n")
      : ""
    
    return NextResponse.json({
      sources: formattedSources,
      contextText,
      enhancedQuery: queryText
    })
    
  } catch (error) {
    console.error("Source retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    )
  }
}

// Helper function to generate embedding for a query using AI SDK
async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  })

  return { embedding }
}

// Helper function to generate a contextually enhanced query using chat history
async function generateContextualQuery(currentQuery: string, chatHistory: any[]) {
  // If there's no chat history, just use the current query
  if (!chatHistory || chatHistory.length === 0) {
    return currentQuery
  }

  const { text } = await generateText({
    model: openai.chat("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: "You are a query enhancement assistant. Your job is to rewrite the user's latest query to include important context from the conversation history. Don't summarize the entire conversation - just enhance the latest query to make it more specific based on the conversation context. Return only the enhanced query text with no additional explanation."
      },
      ...chatHistory.slice(-6).map((msg: any) => ({ 
        role: msg.role as "user" | "assistant", 
        content: msg.content 
      })),
      {
        role: "user",
        content: `Based on our conversation, please rewrite this query to include relevant context: "${currentQuery}"`
      }
    ],
  })

  return text.trim()
}