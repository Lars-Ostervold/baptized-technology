import { openai } from '@/lib/openai'
import { streamText } from 'ai'
import { getChatbotConfig } from '@/lib/chatbot/config'

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    // Parse the request body
    const { messages } = await req.json()
    
    // Get chatbot configuration
    const config = getChatbotConfig(params.chatbotId)
    
    // Ensure the system message matches the configuration
    const processedMessages = [...messages]
    
    // Find and update system message if it exists
    const systemMessageIndex = processedMessages.findIndex(msg => msg.role === 'system')
    if (systemMessageIndex !== -1) {
      processedMessages[systemMessageIndex].content = config.systemPrompt
    } else {
      // Add system message if it doesn't exist
      processedMessages.unshift({
        role: 'system',
        content: config.systemPrompt
      })
    }

    // Create a streaming response using AI SDK
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: processedMessages,
    })

    // Return streaming response
    return result.toDataStreamResponse()
    
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process your request" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}