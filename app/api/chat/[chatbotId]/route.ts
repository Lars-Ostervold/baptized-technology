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
    
    // Use the messages as provided without replacing the system message
    // This preserves the enhanced system message with citation instructions
    const processedMessages = [...messages]
    
    // Only add a system message if one doesn't exist
    const hasSystemMessage = processedMessages.some(msg => msg.role === 'system')
    if (!hasSystemMessage) {
      processedMessages.unshift({
        role: 'system',
        content: config.systemPrompt
      })
    }

    // Print the system message for debugging
    // const systemMessage = processedMessages.find(msg => msg.role === 'system')
    // if (systemMessage) {
    //   console.log("System message:", systemMessage)
    // } else {
    //   console.log("No system message found")
    // }


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