'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
                <div className="relative">
                    <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => query.length > 1 && setShowSuggestions(true)}
                        placeholder="AI-powered search... (try 'luxury hotel' or 'lake')"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${dark
                                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
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
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>

            {/* AI Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute top-full mt-2 w-full rounded-lg shadow-2xl border z-50 animate-fadeIn ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                    }`}>
                    <div className="p-2">
                        <div className={`flex items-center gap-2 px-3 py-2 text-xs border-b ${dark ? 'text-gray-500 border-gray-800' : 'text-gray-500 border-gray-100'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Suggestions
                        </div>
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => selectSuggestion(item)}
                                className={`w-full px-3 py-2 rounded-lg transition-colors text-left flex items-center justify-between group ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div>
                                    <p className={`text-sm font-medium group-hover:text-indigo-600 ${dark ? 'text-gray-200' : 'text-gray-900'
                                        }`}>{item.name}</p>
                                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{item.category}</p>
                                </div>
                                <svg className={`w-4 h-4 group-hover:text-indigo-600 ${dark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
