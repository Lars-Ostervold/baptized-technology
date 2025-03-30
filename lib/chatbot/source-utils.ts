import { generateText } from 'ai'
import { openai } from '@/lib/openai'
import { getChatbotConfig } from './config'
import type { Source } from './types'

export async function isQueryRelevant(query: string, chatbotId: string): Promise<boolean> {
  const config = getChatbotConfig(chatbotId)
  
  const { text } = await generateText({
    model: openai.chat("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are a query relevance checker. Your job is to determine if a query is relevant to the chatbot's domain. The chatbot is configured with the following system prompt: "${config.systemPrompt}". Return ONLY "true" or "false" based on whether the query is relevant to this domain.`
      },
      {
        role: "user",
        content: `Is this query relevant to the chatbot's domain? Query: "${query}"`
      }
    ],
  })

  return text.trim().toLowerCase() === "true"
}

export async function generateContextualQuery(currentQuery: string, chatHistory: any[]): Promise<string> {
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

export async function expandQuery(query: string): Promise<string[]> {
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

export async function rerankSources(query: string, sources: Source[]): Promise<Source[]> {
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