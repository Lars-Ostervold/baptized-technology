import { NextResponse } from 'next/server'
import { embed } from 'ai'
import { openai } from '@/lib/openai'
import { getAdminClient } from '@/lib/supabase'
import { getChatbotConfig } from '@/lib/chatbot/config'
import { Source } from '@/lib/chatbot/types'

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    // Get the query text from request
    const { text } = await req.json()
    
    if (!text) {
      return NextResponse.json(
        { error: "Query text is required" },
        { status: 400 }
      )
    }
    
    // Get chatbot configuration
    const config = getChatbotConfig(params.chatbotId)
    
    // Generate embedding for the query
    const { embedding } = await generateEmbedding(text)
    
    // Query Supabase for relevant documents
    const supabase = getAdminClient()
    const { data: sources, error } = await supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0, // Adjust threshold as needed
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

    console.log("Sources:", sources)
    
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
      contextText
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