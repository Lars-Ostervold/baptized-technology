import { openai } from '@/lib/openai'
import { streamText } from 'ai'
import { getChatbotConfig } from '@/lib/chatbot/config'

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    // Parse the request body
    const { messages } = await req.json()
    
    // Get chatbot configuration
    const config = getChatbotConfig(params.chatbotId)
    
    // Log incoming request for debugging
    console.log("Chat API request:", {
      chatbotId: params.chatbotId,
      messageCount: messages.length
    })
    
    // Ensure the system message matches the configuration
    // eslint-disable-next-line prefer-const
    let processedMessages = [...messages]
    
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
    
    // Create a result using AI SDK
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
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