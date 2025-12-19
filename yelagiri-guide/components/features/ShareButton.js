'use client';

import { useState } from 'react';

export default function ShareButton({ listingName, listingUrl }) {
    const [showMenu, setShowMenu] = useState(false);

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: '💬',
            color: 'bg-green-500',
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(listingName + ' - ' + window.location.href)}`, '_blank')
        },
        {
            name: 'Facebook',
            icon: '📘',
            color: 'bg-blue-600',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
        },
        {
            name: 'Twitter',
            icon: '🐦',
            color: 'bg-sky-500',
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(listingName)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
        },
        {
            name: 'Copy Link',
            icon: '🔗',
            color: 'bg-gray-600',
            action: () => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
                setShowMenu(false);
            }
        }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                title="Share"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-10 animate-fadeIn">
                    {shareOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={option.action}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{option.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
