'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocation } from '@/app/context/LocationContext';

export default function HotelCard({ hotel }) {
    const { location } = useLocation();

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const distance = location && hotel.location?.coordinates
        ? calculateDistance(location.lat, location.lng, hotel.location.coordinates[1], hotel.location.coordinates[0])
        : null;

    return (
        <Link
            href={`/listing/${hotel._id}`}
            className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer"
        >
            <div className="relative h-64">
                <Image
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Offers Tag */}
                {hotel.offers && hotel.offers.length > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        {hotel.offers[0]}
                    </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-bold text-slate-800 flex items-center gap-1 shadow-lg">
                    <span className="bg-blue-600 text-white p-1 rounded text-xs">{hotel.rating || 'New'}</span>
                    <span className="text-xs text-slate-500">({hotel.reviewsCount || 0} reviews)</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-go-green-600 transition-colors">{hotel.name}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4 text-go-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {hotel.address}
                        </p>
                        {/* Distance Display */}
                        {distance && (
                            <p className="text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1">
                                📍 {distance} km from your location
                            </p>
                        )}
                    </div>
                </div>

                {/* Amenities Preview */}
                <div className="flex gap-2 my-4 overflow-x-auto pb-2">
                    {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100 whitespace-nowrap">
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-md border border-slate-100 whitespace-nowrap">
                            +{hotel.amenities.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-400">Price per night</p>
                        <p className="text-2xl font-bold text-slate-800">₹{hotel.price}</p>
                        <p className="text-xs text-green-600 font-medium">Includes taxes & fees</p>
                    </div>
                    <div
                        className="px-6 py-2 bg-gradient-to-r from-go-green-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-go-green-500/30 hover:shadow-xl hover:scale-105 transition-all"
                    >
                        View Deal
                    </div>
                </div>
            </div>
        </Link>
    );
}
