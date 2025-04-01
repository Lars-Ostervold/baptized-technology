import { NextResponse } from 'next/server'
import type { Source } from '@/lib/chatbot/types'
import { rerankSources } from '@/lib/chatbot/source-utils'

export const runtime = "edge"

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    const { sources, queryText } = await req.json()
    
    if (!sources || !queryText) {
      return NextResponse.json(
        { error: "Sources and query text are required" },
        { status: 400 }
      )
    }
    
    // Second stage: Re-rank using an LLM
    const rerankedSources = await rerankSources(queryText, sources)
    
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
      status: 'summarize_complete'
    })
    
  } catch (error) {
    console.error("Source summarization error:", error)
    return NextResponse.json(
      { error: "Failed to summarize sources" },
      { status: 500 }
    )
  }
} 