'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
        // Mock data - in production, fetch from API
        const mockListings = {
            1: { id: 1, name: 'Yelagiri Residency', category: 'Hotels', image: null },
            2: { id: 2, name: 'Hilltop Resort', category: 'Hotels', image: null },
            3: { id: 3, name: 'Punganoor Lake', category: 'Tourist Spots', image: null },
        };

        const favoriteListings = favoriteIds.map(id => mockListings[id]).filter(Boolean);
        setFavorites(favoriteListings);
    }, []);

    const removeFavorite = (id) => {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updated = favoriteIds.filter(fid => fid !== id);
        localStorage.setItem('favorites', JSON.stringify(updated));
        setFavorites(favorites.filter(f => f.id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 pt-28">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    My Favorites
                </h1>

                {favorites.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
                        <p className="text-gray-500 mb-6">Start exploring and add places to your favorites!</p>
                        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all inline-block">
                            Explore Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
                                    {item.category === 'Hotels' ? '🏨' : '⛰️'}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{item.category}</p>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/listing/${item.id}`}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => removeFavorite(item.id)}
                                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
