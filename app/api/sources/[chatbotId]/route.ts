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
        enhancedQuery: queryText
      })
    }
    
    // Second stage: Re-rank using an LLM
    const rerankedSources = await rerankSources(queryText, topSourcesForReranking)
    
    // Format sources for return (now returning top 20 after re-ranking)
    const formattedSources: Source[] = rerankedSources.slice(0, 20)
    
    // Still create the context with top sources for LLM context
    const sourcesForContext = formattedSources.slice(0, 20)
    
    // Create a formatted context for the AI prompt
    const contextText = sourcesForContext.length > 0
      ? sourcesForContext.map((source: Source, i: number) => `Source ${i + 1}: ${source.content}`).join("\n\n")
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

// Helper function to expand a query with synonyms and related terms
async function expandQuery(query: string): Promise<string[]> {
  const { text } = await generateText({
    model: openai.chat("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: "You are a query expansion assistant. Your job is to generate 3 alternative versions of the user's query using synonyms and related terms. Each version should capture the same intent but use different wording. Return exactly 3 versions, one per line, with no numbering or additional text."
      },
      {
        role: "user",
        content: `Generate 3 expanded versions of this query: "${query}"`
      }
    ],
  })

  // Split into array and filter out empty lines
  const expandedQueries = text.split('\n').filter(q => q.trim() !== '')
  
  // Include the original query and limit to 4 total queries
  return [query, ...expandedQueries].slice(0, 4)
}

// Helper function to re-rank sources using an LLM
async function rerankSources(query: string, sources: Source[]): Promise<Source[]> {
  // If we have 2 or fewer sources, no need to re-rank
  if (sources.length <= 2) return sources
  
  // Prepare source content for the LLM
  const sourceTexts = sources.map((source, index) => 
    `Document ${index + 1}: ${source.content.substring(0, 1000)}...` // Truncate if very long
  ).join('\n\n')
  
  const { text } = await generateText({
    model: openai.chat("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: "You are a document re-ranking assistant. You'll receive a query and a set of documents. Rank these documents by their relevance to the query. Return ONLY the document numbers in order of relevance (most relevant first), separated by commas. For example: '3,1,5,2,4'"
      },
      {
        role: "user",
        content: `Query: ${query}\n\nDocuments to rank:\n${sourceTexts}`
      }
    ],
  })
  
  // Parse the ranked document indices
  const rankedIndices = text
    .replace(/[^0-9,]/g, '') // Remove anything that's not a number or comma
    .split(',')
    .map(num => parseInt(num.trim(), 10) - 1) // Convert to 0-based indices
    .filter(index => !isNaN(index) && index >= 0 && index < sources.length)
  
  // Add any missing indices at the end (in case the LLM missed some)
  const allIndices = new Set(rankedIndices)
  for (let i = 0; i < sources.length; i++) {
    if (!allIndices.has(i)) {
      rankedIndices.push(i)
    }
  }
  
  // Reorder sources by rank
  return rankedIndices.map(index => sources[index])
}