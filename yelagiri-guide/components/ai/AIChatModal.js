'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatModal({ isOpen, onClose, dark = false }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Go Elagiri AI. How can I help you plan your trip today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

            if (!apiKey) {
                // Fallback to mock response if no API key
                console.log("No API Key found, using mock response");
                setTimeout(() => {
                    let response = "I can help with that! (Demo Mode) ";
                    const lowerInput = userMessage.toLowerCase();

                    if (lowerInput.includes('hotel') || lowerInput.includes('stay')) {
                        response += "For hotels, I recommend Yelagiri Residency for families and Hilltop Resort for luxury. Would you like to check availability?";
                    } else if (lowerInput.includes('food') || lowerInput.includes('restaurant')) {
                        response += "You must try the local biryani at Hilltop Dining. It's famous here!";
                    } else if (lowerInput.includes('place') || lowerInput.includes('visit')) {
                        response += "Don't miss Punganoor Lake and the Nature Park. They are beautiful this time of year.";
                    } else {
                        response += "I'm still learning about everything in Yelagiri, but I can help you find hotels, spots, and restaurants. What are you looking for?";
                    }

                    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                    setIsTyping(false);
                }, 1000);
                return;
            }

            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const result = await model.generateContent(userMessage);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
            setIsTyping(false);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now." }]);
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-white/20'
                            }`}
                    >
                        {/* Header */}
                        <div className={`p-4 flex items-center justify-between border-b ${dark ? 'border-gray-800 bg-gray-900' : 'border-slate-100 bg-white'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-go-green-400 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={`font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>Go Elagiri AI</h3>
                                    <p className={`text-xs flex items-center gap-1 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full transition-colors ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-slate-100 text-slate-400'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${dark ? 'bg-gray-900' : 'bg-slate-50'}`}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-go-green-500 to-blue-600 text-white rounded-tr-none'
                                        : `${dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-slate-700 shadow-sm'} rounded-tl-none`
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className={`p-3 rounded-2xl rounded-tl-none ${dark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-go-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-go-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-go-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className={`p-4 border-t ${dark ? 'border-gray-800 bg-gray-900' : 'border-slate-100 bg-white'}`}>
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className={`flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500 ${dark
                                        ? 'bg-gray-800 text-white placeholder-gray-500'
                                        : 'bg-slate-100 text-slate-800 placeholder-slate-400'
                                        }`}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="p-3 bg-go-green-500 text-white rounded-xl hover:bg-go-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-go-green-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
