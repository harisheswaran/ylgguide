'use client';

import { useState, useRef, useEffect } from 'react';

const SAMPLE_RESPONSES = {
    greeting: "Hello! 👋 I'm your Yelagiri travel assistant. I can help you find hotels, restaurants, tourist spots, and plan your trip. What would you like to know?",
    hotels: "🏨 Yelagiri has amazing hotels! I recommend:\n\n1. **Yelagiri Residency** - Great for families, has Wi-Fi and restaurant\n2. **Hilltop Resort** - Luxury option with spa and pool\n\nWould you like to book a room?",
    restaurants: "🍽️ For dining, try:\n\n1. **Hilltop Restaurant** - Multi-cuisine with great views\n2. **Local South Indian spots** - Authentic Tamil Nadu food\n\nWant me to show you the menu?",
    spots: "⛰️ Must-visit places:\n\n1. **Punganoor Lake** - Perfect for boating\n2. **Swamimalai Hills** - Best for sunrise trekking\n3. **Nature Park** - Musical fountain show\n\nNeed directions to any of these?",
    weather: "🌤️ Current weather in Yelagiri:\n- Temperature: 24°C\n- Condition: Partly Cloudy\n- Perfect for outdoor activities!",
    activities: "🚣 Adventure activities:\n\n1. **Paragliding** - Thrilling experience\n2. **Boating** - At Punganoor Lake\n3. **Trekking** - Multiple trails available\n\nInterested in booking any activity?",
    default: "I can help you with:\n- 🏨 Hotels & accommodation\n- 🍽️ Restaurants & food\n- ⛰️ Tourist spots\n- 🚣 Activities\n- 🌤️ Weather updates\n\nWhat would you like to know?"
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: SAMPLE_RESPONSES.greeting, sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAIResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();

        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return SAMPLE_RESPONSES.greeting;
        } else if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation')) {
            return SAMPLE_RESPONSES.hotels;
        } else if (msg.includes('restaurant') || msg.includes('food') || msg.includes('eat')) {
            return SAMPLE_RESPONSES.restaurants;
        } else if (msg.includes('spot') || msg.includes('place') || msg.includes('visit') || msg.includes('see')) {
            return SAMPLE_RESPONSES.spots;
        } else if (msg.includes('weather') || msg.includes('temperature') || msg.includes('climate')) {
            return SAMPLE_RESPONSES.weather;
        } else if (msg.includes('activity') || msg.includes('adventure') || msg.includes('trek') || msg.includes('paraglid')) {
            return SAMPLE_RESPONSES.activities;
        } else {
            return SAMPLE_RESPONSES.default;
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: getAIResponse(input),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const quickActions = [
        { label: '🏨 Hotels', action: 'Show me hotels' },
        { label: '🍽️ Restaurants', action: 'Best restaurants' },
        { label: '⛰️ Tourist Spots', action: 'Places to visit' },
        { label: '🌤️ Weather', action: 'Current weather' },
    ];

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col animate-fadeIn">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Travel Assistant</h3>
                                <p className="text-xs opacity-90">Online • Always ready to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.sender === 'user'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                            : 'bg-white text-gray-800 shadow-sm'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 py-2 border-t bg-white">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setInput(action.action);
                                        setTimeout(() => handleSend(), 100);
                                    }}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs whitespace-nowrap transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
