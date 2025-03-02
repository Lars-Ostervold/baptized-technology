// app/api/chat/[chatbotId]/route.ts
/* eslint-disable */
import { streamText, embed } from "ai"
import { openai } from "@/lib/openai"
import { getAdminClient } from "@/lib/supabase"
import { getChatbotConfig } from "@/lib/chatbot/config"

export const runtime = "edge"

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
  try {
    // Get chatbot config
    const chatbotId = params.chatbotId
    const config = getChatbotConfig(chatbotId)

    // Parse the request body
    const { messages } = await req.json()

    // Extract the last user message
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop()

    if (!lastUserMessage) {
      return Response.json({ error: "No user message found" }, { status: 400 })
    }

    // Get Supabase admin client for vector search
    const supabaseAdmin = getAdminClient()

    // Generate embedding using the AI SDK method
    const { embedding: queryEmbedding } = await generateEmbedding(lastUserMessage.content)

    // Query the vector store for relevant documents
    const { data: documents, error } = await supabaseAdmin.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: 5,
      namespace: config.vectorNamespace,
    })

    if (error) {
      console.error("Error querying vector store:", error)
    }

    // Format documents for context insertion
    const sources = (documents || []).map((doc: { id: any; title: any; content: any; url: any; similarity: any }) => ({
      id: doc.id,
      title: doc.title || "Document",
      content: doc.content,
      url: doc.url,
      similarity: doc.similarity,
    }))

    // Create a context string from retrieved documents
    const context = sources.length
      ? `Related information from our knowledge base:
        ${sources
          .map(
            (doc: { title: any; content: any }) => `
        # ${doc.title}
        ${doc.content}
        `,
          )
          .join("\n\n")}`
      : "No specific information found in our knowledge base for this query."

    // Augment system message with context
    const systemMessage = `${config.systemPrompt}
    
    ${context}
    
    Answer based on the provided context. If the context doesn't contain relevant information, use your general knowledge but make it clear when you're doing so.`

    // Format messages for the LLM
    const formattedMessages = [
      { role: "system", content: systemMessage },
      ...messages.filter((m: { role: string }) => m.role !== "system"),
    ]

    // Use streamText from AI SDK 4.0
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Get the response from toDataStreamResponse
    const response = result.toDataStreamResponse()

    // Create a new response with the same body but add our custom headers
    const newResponse = new Response(response.body, response)

    // Add sources as a header
    newResponse.headers.set("x-sources", JSON.stringify(sources))

    return newResponse
  } catch (error) {
    console.error("Error processing chat request:", error)
    return Response.json({ error: "Error processing your request" }, { status: 500 })
  }
}

// Helper function to generate embedding for a query using AI SDK 4.0
async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  })

  return { embedding }
}

