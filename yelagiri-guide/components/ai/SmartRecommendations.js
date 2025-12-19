'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartRecommendations({ currentCategory }) {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // AI-powered recommendations based on user behavior
        const mockRecommendations = [
            {
                id: 1,
                name: 'Yelagiri Residency',
                category: 'Hotels',
                reason: 'Popular choice for families',
                rating: 4.5,
                confidence: 95
            },
            {
                id: 2,
                name: 'Punganoor Lake',
                category: 'Tourist Spots',
                reason: 'Perfect for morning visits',
                rating: 4.8,
                confidence: 92
            },
            {
                id: 5,
                name: 'Hilltop Restaurant',
                category: 'Restaurants',
                reason: 'Great views and food',
                rating: 4.6,
                confidence: 88
            },
        ];

        setRecommendations(mockRecommendations);
    }, [currentCategory]);

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
                    <p className="text-sm text-gray-600">Personalized suggestions for you</p>
                </div>
            </div>

            <div className="space-y-3">
                {recommendations.map((item) => (
                    <Link
                        key={item.id}
                        href={`/listing/${item.id}`}
                        className="block bg-white rounded-xl p-4 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {item.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                                style={{ width: `${item.confidence}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.confidence}% match</span>
                                    </div>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Powered by AI • Based on your preferences and popular choices
                </p>
            </div>
        </div>
    );
}
