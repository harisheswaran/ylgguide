'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISearchBar({ dark = false }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();

    const allItems = [
        { id: 1, name: 'Yelagiri Residency', category: 'Hotels', keywords: ['hotel', 'stay', 'accommodation', 'family'] },
        { id: 2, name: 'Hilltop Resort', category: 'Hotels', keywords: ['luxury', 'resort', 'spa', 'pool'] },
        { id: 3, name: 'Punganoor Lake', category: 'Tourist Spots', keywords: ['lake', 'boating', 'park', 'nature'] },
        { id: 4, name: 'Nature Park', category: 'Tourist Spots', keywords: ['park', 'fountain', 'aquarium', 'family'] },
        { id: 5, name: 'Hilltop Restaurant', category: 'Restaurants', keywords: ['food', 'dining', 'restaurant', 'view'] },
    ];

    const handleSearch = (searchQuery) => {
        setQuery(searchQuery);

        if (searchQuery.length > 1) {
            // AI-powered fuzzy search
            const results = allItems.filter(item => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    item.name.toLowerCase().includes(searchLower) ||
                    item.category.toLowerCase().includes(searchLower) ||
                    item.keywords.some(keyword => keyword.includes(searchLower))
                );
            });

            setSuggestions(results.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (item) => {
        router.push(`/listing/${item.id}`);
        setQuery('');
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                    <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${dark ? 'text-gray-500 group-focus-within:text-forest-400' : 'text-slate-400 group-focus-within:text-forest-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => query.length > 1 && setShowSuggestions(true)}
                        placeholder="Search for hotels, spots..."
                        className={`w-full pl-11 pr-10 py-3.5 text-[15px] rounded-xl focus:outline-none transition-all duration-300 ${dark
                                ? 'bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:bg-black/40 focus:border-white/20'
                                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-forest-200 focus:bg-white'
                            }`}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                            }}
                            className={`absolute right-3.5 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform ${dark ? 'text-gray-500 hover:text-white' : 'text-slate-300 hover:text-slate-600'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>

            {/* AI Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute top-full mt-2 w-full rounded-2xl shadow-xl border z-[70] overflow-hidden ${dark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-slate-100'
                        }`}
                    >
                        <div className="p-2">
                            <div className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-bold border-b mb-1 ${dark ? 'text-gray-500 border-white/5' : 'text-slate-400 border-slate-50'
                                }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                AI Recommendations
                            </div>
                            {suggestions.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => selectSuggestion(item)}
                                    className={`w-full px-4 py-3 rounded-xl transition-all text-left flex items-center justify-between group ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <p className={`text-[14px] font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                                        <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-slate-400'}`}>{item.category}</span>
                                    </div>
                                    <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${dark ? 'text-gray-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

