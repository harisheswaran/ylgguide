'use client';

import { useState } from 'react';

export default function PhotoGallery({ photos = [] }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const defaultPhotos = [
        { id: 1, url: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Yelagiri+Hills', caption: 'Scenic mountain view' },
        { id: 2, url: 'https://via.placeholder.com/800x600/f093fb/ffffff?text=Punganoor+Lake', caption: 'Punganoor Lake' },
        { id: 3, url: 'https://via.placeholder.com/800x600/4facfe/ffffff?text=Nature+Park', caption: 'Nature Park' },
        { id: 4, url: 'https://via.placeholder.com/800x600/43e97b/ffffff?text=Swamimalai', caption: 'Swamimalai Hills' },
        { id: 5, url: 'https://via.placeholder.com/800x600/fa709a/ffffff?text=Sunset+View', caption: 'Beautiful sunset' },
        { id: 6, url: 'https://via.placeholder.com/800x600/30cfd0/ffffff?text=Adventure', caption: 'Adventure activities' },
    ];

    const galleryPhotos = photos.length > 0 ? photos : defaultPhotos;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    >
                        <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-lg"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="max-w-4xl w-full">
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption}
                            className="w-full rounded-lg"
                        />
                        <p className="text-white text-center mt-4 text-lg">{selectedPhoto.caption}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
