import { NextResponse } from 'next/server'
import { isQueryRelevant } from '@/lib/chatbot/source-utils'

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    const { text } = await req.json()
    
    if (!text) {
      return NextResponse.json(
        { error: "Query text is required" },
        { status: 400 }
      )
    }
    
    const isRelevant = await isQueryRelevant(text, params.chatbotId)
    
    return NextResponse.json({
      isRelevant,
      status: isRelevant ? 'relevant' : 'off_topic'
    })
  } catch (error) {
    console.error("Relevance check error:", error)
    return NextResponse.json(
      { error: "Failed to check query relevance" },
      { status: 500 }
    )
  }
} 