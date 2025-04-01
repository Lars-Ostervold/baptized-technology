import { NextResponse } from 'next/server'
import { embed } from 'ai'
import { openai } from '@/lib/openai'
import { getAdminClient } from '@/lib/supabase'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source } from '@/lib/chatbot/types'
import { generateContextualQuery, expandQuery } from '@/lib/chatbot/source-utils'

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
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
    
    // Expand the query with synonyms and related terms
    const expandedQueries = await expandQuery(queryText)
    
    // Get embeddings for all queries
    const embeddings = await Promise.all(
      expandedQueries.map(q => generateEmbedding(q))
    )
    
    // Query Supabase with all embeddings and get combined results
    const supabase = getAdminClient()
    
    // Perform initial retrieval with multiple queries (first stage)
    const retrievalPromises = embeddings.map(({ embedding }) => 
      supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 20,
        vector_namespace: config.vectorNamespace
      })
    )
    
    const retrievalResults = await Promise.all(retrievalPromises)
    
    // Combine and deduplicate results from all queries
    //eslint-disable-next-line prefer-const
    let combinedSources: Source[] = []
    const seenIds = new Set()
    
    retrievalResults.forEach(result => {
      if (result.error) {
        console.error("Error querying vector database:", result.error)
        return
      }
      
      if (result.data) {
        result.data.forEach((source: Source) => {
          if (!seenIds.has(source.id)) {
            seenIds.add(source.id)
            combinedSources.push(source)
          }
        })
      }
    })
    
    // Get the top 20 sources by similarity for re-ranking
    const topSourcesForReranking = combinedSources
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 20)
    
    if (topSourcesForReranking.length === 0) {
      return NextResponse.json({
        sources: [],
        contextText: "",
        enhancedQuery: queryText,
        status: 'no_results'
      })
    }
    
    return NextResponse.json({
      sources: topSourcesForReranking,
      enhancedQuery: queryText,
      status: 'search_complete'
    })
    
  } catch (error) {
    console.error("Source search error:", error)
    return NextResponse.json(
      { error: "Failed to search sources" },
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