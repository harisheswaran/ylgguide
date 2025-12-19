'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ai');

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebar}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                </svg>
            </motion.button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Smart Assistant</h2>
                                <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex border-b border-zinc-800">
                                <button
                                    onClick={() => setActiveTab('ai')}
                                    className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    AI Chat
                                </button>
                                <button
                                    onClick={() => setActiveTab('recommend')}
                                    className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'recommend' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Recommendations
                                </button>
                                <button
                                    onClick={() => setActiveTab('tools')}
                                    className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'tools' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Tools
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {activeTab === 'ai' && (
                                    <div className="space-y-4">
                                        <div className="bg-zinc-800 p-4 rounded-xl">
                                            <p className="text-gray-300 text-sm">Hello! I&apos;m your Go Elagiri AI guide. Ask me anything about hotels, spots, or food!</p>
                                        </div>
                                        {/* Placeholder for Chat Interface */}
                                        <div className="mt-auto">
                                            <input
                                                type="text"
                                                placeholder="Ask a question..."
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'recommend' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-white mb-4">Based on current weather</h3>
                                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-indigo-500 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white">Nature Park</h4>
                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">98% Match</span>
                                            </div>
                                            <p className="text-sm text-gray-400">Perfect for the current misty weather. Enjoy a peaceful walk.</p>
                                        </div>
                                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-indigo-500 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white">Punganoor Lake</h4>
                                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">85% Match</span>
                                            </div>
                                            <p className="text-sm text-gray-400">Boating is open and the view is spectacular right now.</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tools' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex flex-col items-center gap-2">
                                                <span className="text-2xl">🆘</span>
                                                <span className="text-sm font-medium text-red-400">Emergency</span>
                                            </button>
                                            <button className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors flex flex-col items-center gap-2">
                                                <span className="text-2xl">🗣️</span>
                                                <span className="text-sm font-medium text-blue-400">Translator</span>
                                            </button>
                                            <button className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors flex flex-col items-center gap-2">
                                                <span className="text-2xl">💰</span>
                                                <span className="text-sm font-medium text-green-400">Budget</span>
                                            </button>
                                            <button className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/20 transition-colors flex flex-col items-center gap-2">
                                                <span className="text-2xl">📶</span>
                                                <span className="text-sm font-medium text-yellow-400">Offline</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
