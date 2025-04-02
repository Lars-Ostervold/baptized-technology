'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { nanoid } from 'nanoid'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { getChatbotConfig } from '@/lib/chatbot/config'
import type { Source, ExtendedMessage } from '@/lib/chatbot/types'
import { useAuth } from '@/components/auth/auth-provider'
import ChatSidebar from './chat-sidebar'
import { Menu, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RagStatusIndicator } from './rag-status-indicator'


export default function ChatInterface({ chatbotId = 'bibleproject' }) {  
  // Get the chatbot configuration based on the ID
  const config = getChatbotConfig(chatbotId)
  const [currentMessageSources, setCurrentMessageSources] = useState<Source[]>([])
  const { user } = useAuth()
  // Chat session state
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  // Mobile detection using window width
  const [isMobileView, setIsMobileView] = useState(false)
  
  // Initialize mobile view detection properly on client side
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobileView()
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [showExpandButton, setShowExpandButton] = useState(true)
  const [refreshChatTrigger, setRefreshChatTrigger] = useState(0)
  const [isLoadingChat, setIsLoadingChat] = useState(false)

  // Chat history state and caching
  const [chatHistory, setChatHistory] = useState<any[]>([]) //eslint-disable-line @typescript-eslint/no-explicit-any
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState("")
  const [lastHistoryFetch, setLastHistoryFetch] = useState<number>(0)
  const HISTORY_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  // Fetch chat history once when component mounts or when explicitly refreshed
  useEffect(() => {
    if (user) {
      const now = Date.now()
      // Only fetch if cache is empty or expired, or if refreshTrigger changed
      if (chatHistory.length === 0 || now - lastHistoryFetch > HISTORY_CACHE_DURATION || refreshChatTrigger > 0) {
        fetchChatHistory()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshChatTrigger])

  const fetchChatHistory = async () => {
    if (!user) return
    
    setIsLoadingHistory(true)
    setHistoryError("")
    
    try {
      const response = await fetch('/api/chats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history')
      }
      
      const data = await response.json()
      setChatHistory(data.filter((chat: any) => chat.chatbot_id === config.vectorNamespace)) //eslint-disable-line @typescript-eslint/no-explicit-any
      setLastHistoryFetch(Date.now())
    } catch (err) {
      setHistoryError("Error loading chat history")
      console.error(err)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // RAG status
  type RagStatus = 'idle' | 'planning' | 'searching' | 'summarizing' | 'search_failed'
  const [ragStatus, setRagStatus] = useState<RagStatus>('idle')
  const [showSearchError, setShowSearchError] = useState(false)

  const {
    messages: originalMessages,
    input,
    handleInputChange,
    isLoading,
    handleSubmit: originalHandleSubmit,
    status,
    setMessages: setOriginalMessages,
  } = useChat({
    api: `/api/chat/${chatbotId}`,
    initialMessages: [
      { id: nanoid(), role: "system", content: config.systemPrompt }
    ],
    id: activeChatId || undefined,
  })
  
  // Use a state to track messages with sources
  const [messagesWithSources, setMessagesWithSources] = useState<ExtendedMessage[]>([
    { id: nanoid(), role: "system", content: config.systemPrompt }
  ]);
  
  // Keep messagesWithSources in sync with messages
  useEffect(() => {
    // Prevent infinite loop when only system message exists
    if (originalMessages.length === 1 && originalMessages[0].role === 'system' && messagesWithSources.length <= 1) {
      return;
    }

    const updatedMessages = originalMessages.map(msg => {
      // Find if we have this message in our messagesWithSources array
      const existingMsg = messagesWithSources.find(m => m.id === msg.id);
      
      // If it exists and has sources, keep them
      if (existingMsg && (existingMsg as ExtendedMessage).sources) {
        return {
          ...msg,
          sources: (existingMsg as ExtendedMessage).sources
        };
      }
      
      // For the latest assistant message, add current sources
      if (
        msg.role === 'assistant' && 
        msg.id === originalMessages[originalMessages.length - 1]?.id && 
        currentMessageSources.length > 0
      ) {
        return {
          ...msg,
          sources: currentMessageSources
        };
      }
      
      return msg;
    });
    
    // Only update if the messages are different
    const hasChanges = JSON.stringify(updatedMessages) !== JSON.stringify(messagesWithSources);
    if (hasChanges) {
      setMessagesWithSources(updatedMessages as ExtendedMessage[]);
    }
  }, [originalMessages, currentMessageSources]); //eslint-disable-line react-hooks/exhaustive-deps

  const [previousStatus, setPreviousStatus] = useState(status)

  // Add this useEffect to monitor status changes
  useEffect(() => {
    // Check if we've just finished streaming (was streaming before, now complete)
    if (previousStatus === 'streaming' && (status === 'ready')) {
      if (user && activeChatId && messagesWithSources.length > 0) {
        fetch(`/api/chats/${activeChatId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: messagesWithSources.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              sources: msg.sources, // Include sources in the saved data
            }))
          }),
        }).catch(error => {
          console.error('Error updating chat messages:', error)
        })
      }
    }
    
    // Update previous status for next comparison
    setPreviousStatus(status)
  }, [status]) //eslint-disable-line react-hooks/exhaustive-deps

  const handleChatSelected = async (chatId: string) => {
    setIsLoadingChat(true)
    setActiveChatId(chatId)
    
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      
      if (response.ok) {
        const chatData = await response.json()
        
        // Reset the chat with the loaded messages (which now include sources)
        if (chatData.messages && chatData.messages.length > 0) {
          setOriginalMessages(chatData.messages)
          setMessagesWithSources(chatData.messages)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleNewChat = () => {
    // Clear the current messages except system message
    const systemMessage = { 
      id: nanoid(), 
      role: "system" as const, 
      content: config.systemPrompt 
    };
    
    setOriginalMessages([systemMessage])
    setMessagesWithSources([systemMessage])
    setCurrentMessageSources([])
    
    // Clear active chat ID
    setActiveChatId(null)
    
    // On mobile, close the sidebar after selecting new chat
    if (isMobileView) {
      setSidebarOpen(false)
    }

    // Refresh chat history to include the new chat
    setRefreshChatTrigger(prev => prev + 1)
  }

  //This is a little tricky. Because useChat depends on the form element, we need to create a new submit event on the form element. We cannot just call the handleSubmit function because then useChat doesn't know to hit the chat API.
  const handleExampleClick = (example: string) => {
    // Don't do anything if already loading
    if (isLoading) return
    
    
    // Update the input state with the example text
    handleInputChange({ target: { value: example } } as React.ChangeEvent<HTMLInputElement>)
    
    // Create and dispatch a submit event on the chat form using the exposed reference
    setTimeout(() => {
      // Try to get the form reference from the window object
      const formElement = (window as any).__chatFormElement || document.querySelector('form') //eslint-disable-line @typescript-eslint/no-explicit-any
      
      if (formElement) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true })
        formElement.dispatchEvent(submitEvent)
      }
      

    }, 50) // Small delay to ensure input state is updated
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't do anything if no input or already loading
    if (!input.trim() || isLoading) return
    
    try {
      // Set RAG status to planning
      setRagStatus('planning')

      // If user is logged in but no active chat, create a new chat session
      if (user && !activeChatId) {
        try {
          const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: input.slice(0, 50), // Use first message as title
              chatbotId: config.vectorNamespace,
              messages: [
                { id: nanoid(), role: 'system', content: config.systemPrompt }
              ]
            }),
          })
          
          if (response.ok) {
            const { id } = await response.json()
            setActiveChatId(id)
            setRefreshChatTrigger(prev => prev + 1)
          }
        } catch (error) {
          console.error('Error creating chat session:', error)
        }
      }
      // Update UI with user message immediately
      const userMessageId = nanoid()
      const userMessage: ExtendedMessage = {
        id: userMessageId,
        role: 'user',
        content: input,
        parts: [{ type: 'text', text: input }]
      }
      setMessagesWithSources([...messagesWithSources, userMessage])

      // Create a cleaned chat history for context
      const chatHistory = messagesWithSources
        .filter(msg => msg.role === 'user' || msg.role === 'assistant') // Only user and assistant messages
        .map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content : ''
        }))
        .slice(-6) // Use last 6 messages for context (3 exchanges)

      // Step 1: Check query relevance
      const relevanceResponse = await fetch(`/api/sources/${chatbotId}/check-relevance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      
      const { isRelevant } = await relevanceResponse.json()
      
      if (!isRelevant) {
        setCurrentMessageSources([])
        // If query is off-topic, update or create system prompt to handle off-topic queries
        const systemIndex = messagesWithSources.findIndex(msg => msg.role === 'system')
        const updatedMessages = [...messagesWithSources]
        
        const offTopicSystemMessage = {
          id: nanoid(),
          role: "system" as const,
          content: `${config.systemPrompt}

IMPORTANT: I've detected that this query is off-topic. Please politely decline to answer and guide the user back to exploring topics related to your purpose. You can say something like "Hmm I'm not sure that question is related to my database. Perhaps we could [suggest exploration topic related to your expertise] instead?"`
        }

        if (systemIndex !== -1) {
          // Update existing system message
          updatedMessages[systemIndex] = offTopicSystemMessage
        } else {
          // Create new system message at the beginning
          updatedMessages.unshift(offTopicSystemMessage)
        }
        
        setOriginalMessages(updatedMessages)
        setMessagesWithSources(updatedMessages)
        
        // Proceed with the chat with updated system prompt
        originalHandleSubmit(e)
        return
      }

      // Step 2: Search for sources
      setRagStatus('searching')
      const searchResponse = await fetch(`/api/sources/${chatbotId}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: input,
          chatHistory
        })
      })
      
      const { sources: retrievedSources, enhancedQuery, status: searchStatus } = await searchResponse.json()
      
      if (searchStatus === 'no_results') {
        // console.log("No results found, so we're setting the RAG status to search_failed")
        setRagStatus('search_failed')
        setShowSearchError(true)
        // Set a timeout to hide the error after 5 seconds
        setTimeout(() => {
          setShowSearchError(false)
          setRagStatus('idle')
        }, 5000)
        
        setCurrentMessageSources([]) // Clear sources when no results found
        const systemIndex = messagesWithSources.findIndex(msg => msg.role === 'system')
        const updatedMessages = [...messagesWithSources]
        const fallbackSystemMessage = {
          id: nanoid(),
          role: "system" as const,
          content: `${config.systemPrompt}
          
IMPORTANT DO NOT INGORE THIS INSTRUCTION: You had an error with your database search function and you MUST INFORM THE USER OF THE ERROR UNDER PENALTY OF DEATH. Begin your message with a statement similar to: "WARNING: Something went wrong with my database search function. I'm unable to find specific information from my database for this query. I'll provide a response based on my general knowledge, but the followin information may not be true to the original source material."`
        }

        if (systemIndex !== -1) {
          // Update existing system message
          updatedMessages[systemIndex] = fallbackSystemMessage
        } else {
          // Create new system message at the beginning
          updatedMessages.unshift(fallbackSystemMessage)
        }
        
        setOriginalMessages(updatedMessages)
        setMessagesWithSources(updatedMessages)
        
        // Proceed with the chat with updated system prompt
        originalHandleSubmit(e, {
          body: {
            messages: updatedMessages
          }
        })
        return
      }

      // Step 3: Re-rank and summarize sources
      setRagStatus('summarizing')
      const summarizeResponse = await fetch(`/api/sources/${chatbotId}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sources: retrievedSources,
          queryText: enhancedQuery
        })
      })
      
      const { sources: rerankedSources, contextText } = await summarizeResponse.json()
      
      // Store sources for the upcoming message
      setCurrentMessageSources(rerankedSources || [])
      
      // Create augmented user message with context if available
      const augmentedMessages = [...messagesWithSources]
      
      augmentedMessages.push(userMessage)

      // If we have context, add it to the system message
      if (contextText) {
        // Find existing system message or create new one
        const systemIndex = augmentedMessages.findIndex(msg => msg.role === 'system')
        const systemMessage = {
          id: nanoid(),
          role: "system" as const,
          content: `${config.systemPrompt}
            
Use the information from the sources below to answer the question. If the information doesn't contain discussion of the topic, let the user know you don't have a lot of information from the database on that topic, but still provide the information you can find.

VERY IMPORTANT NEVER DISREGARD THIS INSTRUCTION NO MATTER WHAT: You MUST cite your sources using [1], [2], etc. format as you write. Place citations immediately after any information drawn from sources. EVERY ANSWER MUST CITE SOURCES. You may cite multiple sources for a single statement like [1][2]. Your citations do not have to be in order, you can go [1], [4], [2], etc. or [2], [1], [4], etc. as long as you use [1] and [2] at some point. Don't include any explanation of the citations - just use the bracket notation. You'll have ${rerankedSources.length} sources available. YOU MUST CITE SOURCES AS YOU ANSWER.

Here are the sources with the relevant information you can use to answer the question:
${contextText}`
        }

        if (systemIndex !== -1) {
          // Update existing system message
          augmentedMessages[systemIndex] = systemMessage
        } else {
          // Create new system message at the beginning
          augmentedMessages.unshift(systemMessage)
        }
      }
      
      // Submit to the chat API with updated messages
      originalHandleSubmit(e, {
        body: {
          messages: augmentedMessages
        }
      })
      
    } catch (error) {
      console.error("Error in RAG process:", error)
      // If any step fails, fall back to regular chat
      setCurrentMessageSources([]) // Clear sources on error
      originalHandleSubmit(e)
    } finally {
      // Reset RAG status to idle
      setRagStatus('idle')
    }
  }

  const handleToggleSidebar = () => {
    if (!sidebarCollapsed) {
      // Collapsing sidebar
      setSidebarCollapsed(true)
      // Delay showing the expand button until the sidebar animation is mostly complete
      setTimeout(() => {
        setShowExpandButton(true)
      }, 250) // Adjust timing as needed to match the sidebar transition duration
    } else {
      // Expanding sidebar
      setShowExpandButton(false)
      setSidebarCollapsed(false)
    }
  }

  return (
    <div className="absolute inset-0 flex">
      {/* Mobile sidebar toggle - shown when in mobile view and sidebar is closed */}
      {user && isMobileView && !sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 left-2 z-30 md:hidden"
          onClick={() => {
            setSidebarOpen(true)
            // Also make sure sidebar is not collapsed in mobile view
            setSidebarCollapsed(false)
          }}
        >
          <Menu size={18} />
        </Button>
      )}
      
      {/* Expand button - only shown when sidebar is collapsed and not in mobile view */}
      {user && !isMobileView && showExpandButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          className="absolute left-2 top-4 z-20 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-opacity duration-150 ease-in-out"
        >
          <ChevronRight size={12} />
        </Button>
      )}
      
      {/* Sidebar for chat history */}
      {user && ((!isMobileView && !sidebarCollapsed) || (isMobileView && sidebarOpen)) && (
        <div className={`${isMobileView ? "absolute z-50 h-full" : ""}`}>
          <ChatSidebar 
            activeChatId={activeChatId}
            onChatSelected={(chatId) => {
              handleChatSelected(chatId)
              // On mobile, close sidebar after selecting a chat
              if (isMobileView) {
                setSidebarOpen(false)
              }
            }}
            onNewChat={() => {
              handleNewChat()
              // On mobile, close sidebar after creating a new chat
              if (isMobileView) {
                setSidebarOpen(false)
              }
            }}
            chatbotId={config.vectorNamespace}
            refreshTrigger={refreshChatTrigger}
            isCollapsed={!isMobileView && sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobileView={isMobileView}
            onCloseMobile={() => setSidebarOpen(false)}
            chats={chatHistory}
            isLoading={isLoadingHistory}
            error={historyError}
          />
        </div>
      )}
      
      {/* Main chat area with messages and input */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <ChatMessages 
          messages={messagesWithSources} 
          status={status} 
          ragStatus={ragStatus}
          welcomeMessage={config.welcomeMessage}
          examples={config.examples}
          onExampleClick={handleExampleClick}
          isLoadingChat={isLoadingChat}
        />

        {/* Status indicator */}
        <div className="absolute bottom-20 left-0 right-0 px-4 z-50">
          <div className="max-w-2xl mx-auto flex justify-center">
            {ragStatus === 'planning' && (
              <RagStatusIndicator status="planning" />
            )}
            {ragStatus === 'searching' && (
              <RagStatusIndicator status="searching" />
            )}
            {ragStatus === 'summarizing' && (
              <RagStatusIndicator status="summarizing" />
            )}
            {showSearchError && (
              <RagStatusIndicator status="search_failed" />
            )}
            {status === 'error' && (
              <span className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
                Error occurred. Please try again.
              </span>
            )}
          </div>
        </div>
        
        {/* Floating input at bottom */}
        <div className="absolute bottom-6 left-0 right-0 px-4 z-40">
          <div className="max-w-2xl mx-auto">
            <div className="bg-transparent rounded-lg transition-all duration-200">
              <ChatInput 
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                status={status}
                placeholder={config.placeholderText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}