'use client';

import { useState } from 'react';

export default function FilterSidebar({ filters, setFilters }) {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

    const handlePriceChange = (e, type) => {
        const value = e.target.value;
        setPriceRange(prev => ({ ...prev, [type]: value }));
        setFilters(prev => ({ ...prev, [type === 'min' ? 'minPrice' : 'maxPrice']: value }));
    };

    const handleAmenityChange = (amenity) => {
        setFilters(prev => {
            const current = prev.amenities ? prev.amenities.split(',') : [];
            const updated = current.includes(amenity)
                ? current.filter(a => a !== amenity)
                : [...current, amenity];
            return { ...prev, amenities: updated.join(',') };
        });
    };

    const amenitiesList = [
        'WiFi', 'Pool', 'Spa', 'Parking', 'Restaurant', 'AC', 'Gym'
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Filters</h3>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-sm text-slate-600 mb-3">Price Range</h4>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
                <h4 className="font-semibold text-sm text-slate-600 mb-3">Star Rating</h4>
                <div className="space-y-2">
                    {[5, 4, 3].map(star => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === String(star)}
                                onChange={() => setFilters(prev => ({ ...prev, rating: String(star) }))}
                                className="text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                                {star} <span className="text-yellow-400">★</span> & up
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h4 className="font-semibold text-sm text-slate-600 mb-3">Amenities</h4>
                <div className="space-y-2">
                    {amenitiesList.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.amenities?.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                className="rounded text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-600">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setFilters({})}
                className="mt-6 w-full py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );
}
