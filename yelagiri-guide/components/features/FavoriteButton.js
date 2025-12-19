'use client';

import { useState, useEffect } from 'react';

export default function FavoriteButton({ listingId, listingName }) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(listingId));
    }, [listingId]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        if (isFavorite) {
            const updated = favorites.filter(id => id !== listingId);
            localStorage.setItem('favorites', JSON.stringify(updated));
            setIsFavorite(false);
        } else {
            favorites.push(listingId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full transition-all ${isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className={`w-6 h-6 transition-transform ${isFavorite ? 'scale-110' : ''}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
}
