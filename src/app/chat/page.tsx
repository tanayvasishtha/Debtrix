'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Send,
    Bot,
    User,
    Sparkles,
    TrendingUp,
    DollarSign,
    Calculator,
    BookOpen,
    ArrowLeft
} from 'lucide-react'

interface Message {
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: string[]
}

// Add formatTimestamp function before the ChatPage component
const formatTimestamp = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'ai',
            content: "Hi! I'm your AI Financial Coach powered by advanced AI. I'm here to help you with personalized debt elimination strategies, financial planning, and answer any money-related questions. What would you like to know?",
            timestamp: new Date(),
            suggestions: [
                "How can I pay off my credit card debt faster?",
                "What's the difference between debt snowball and avalanche?",
                "Help me create a budget",
                "Should I consolidate my debts?"
            ]
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const quickActions = [
        { icon: Calculator, label: "Calculate Savings", prompt: "Calculate how much I can save with different debt strategies" },
        { icon: TrendingUp, label: "Optimize Strategy", prompt: "Help me optimize my debt elimination strategy" },
        { icon: DollarSign, label: "Budget Help", prompt: "Help me create a monthly budget" },
        { icon: BookOpen, label: "Learn Finance", prompt: "Teach me about personal finance basics" }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputMessage.trim()) return

        const timestamp = new Date()
        timestamp.setMilliseconds(0) // Remove milliseconds for consistency

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage,
            timestamp
        }

        setMessages(prev => [...prev, newMessage])
        setInputMessage('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage.content })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response')
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: data.response,
                timestamp,
                suggestions: data.suggestions || []
            }

            setMessages(prev => [...prev, aiMessage])
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: error instanceof Error ? error.message : 'Failed to get response',
                timestamp,
                suggestions: [
                    "Try asking about debt management",
                    "Ask about saving strategies",
                    "Learn about investment basics",
                    "Get budgeting advice"
                ]
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="flex items-center text-gray-300 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>
                            <div className="text-xl font-semibold text-white">AI Financial Coach</div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Chat Container */}
            <div className="flex-1 pt-20 pb-4 flex flex-col">
                <div className="flex-1 container mx-auto px-6 flex flex-col max-w-4xl">

                    {/* Quick Actions */}
                    <div className="mb-6">
                        <h2 className="text-white font-medium mb-3">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 h-auto py-3 flex-col gap-2"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setInputMessage(action.prompt)
                                    }}
                                >
                                    <action.icon className="w-5 h-5" />
                                    <span className="text-xs">{action.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-3xl flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                        ? 'bg-blue-600'
                                        : 'bg-gradient-to-r from-green-500 to-blue-600'
                                        }`}>
                                        {message.type === 'user' ?
                                            <User className="w-4 h-4 text-white" /> :
                                            <Bot className="w-4 h-4 text-white" />
                                        }
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        <Card className={`${message.type === 'user'
                                            ? 'bg-blue-600 border-blue-500'
                                            : 'bg-gray-800/50 border-gray-700'
                                            }`}>
                                            <CardContent className="p-4">
                                                <div className={`whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-gray-200'
                                                    }`}>
                                                    {message.content}
                                                </div>
                                                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                                                    }`}>
                                                    {formatTimestamp(message.timestamp)}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* AI Suggestions */}
                                        {message.type === 'ai' && message.suggestions && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-gray-400 text-sm">Suggested questions:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {message.suggestions.map((suggestion, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setInputMessage(suggestion)
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-3xl flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <Card className="bg-gray-800/50 border-gray-700">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                                <span className="animate-pulse">AI is analyzing your question...</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about debt management, budgeting, or financial planning..."
                                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                                    rows={1}
                                    style={{ minHeight: '24px', maxHeight: '100px' }}
                                />
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <span>Press Enter to send, Shift+Enter for new line</span>
                            <span>Powered by Advanced AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 