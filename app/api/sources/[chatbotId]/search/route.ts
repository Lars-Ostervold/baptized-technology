import { NextResponse } from 'next/server'
import { embed } from 'ai'
import { openai } from '@/lib/openai'
import { getAdminClient } from '@/lib/supabase'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source } from '@/lib/chatbot/types'
import { generateContextualQuery, expandQuery } from '@/lib/chatbot/source-utils'

export const runtime = "edge"

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to check if error is a timeout
const isTimeoutError = (error: any) => {
  return error?.code === '57014' || 
         error?.message?.includes('canceling statement due to statement timeout') ||
         error?.message?.includes('timeout')
}

// Helper function to perform vector search with retries
async function performVectorSearch(
  supabase: any,
  embedding: number[],
  config: any,
  maxRetries = 3,
  initialDelay = 1000
): Promise<{ data: Source[] | null; error: any | null }> {
  let lastError = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 20,
        vector_namespace: config.vectorNamespace
      })
      
      if (result.error) {
        throw result.error
      }
      
      return result
    } catch (error: any) {
      lastError = error
      
      // If it's not a timeout error, don't retry
      if (!isTimeoutError(error)) {
        return { data: null, error }
      }
      
      // If this was the last attempt, return the error
      if (attempt === maxRetries - 1) {
        return { data: null, error }
      }
      
      // Calculate exponential backoff delay
      const backoffDelay = initialDelay * Math.pow(2, attempt)
      console.log(`Attempt ${attempt + 1} failed, retrying in ${backoffDelay}ms...`)
      await delay(backoffDelay)
    }
  }
  
  return { data: null, error: lastError }
}

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
      performVectorSearch(supabase, embedding, config)
    )
    
    const retrievalResults = await Promise.all(retrievalPromises)
    
    // Check if all retrievals failed
    const allFailed = retrievalResults.every(result => result.error)
    if (allFailed) {
      console.error("All vector searches failed:", retrievalResults.map(r => r.error))
      return NextResponse.json({
        sources: [],
        contextText: "",
        enhancedQuery: queryText,
        status: 'no_results'
      })
    }
    
    // Combine and deduplicate results from all queries
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