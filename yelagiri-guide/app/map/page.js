'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InteractiveMap() {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPlace, setSelectedPlace] = useState(null);

    // Yelagiri coordinates
    const yelagiriCenter = { lat: 12.5833, lng: 78.7500 };

    // Mock locations with real Yelagiri coordinates
    const locations = [
        // Hotels & Resorts
        { id: 1, name: 'Yelagiri Residency', category: 'hotels', lat: 12.5850, lng: 78.7520, icon: '🏨', color: 'bg-blue-600', phone: '9876543210' },
        { id: 2, name: 'Hilltop Resort', category: 'hotels', lat: 12.5900, lng: 78.7550, icon: '🏨', color: 'bg-blue-600', phone: '9876543211' },
        { id: 3, name: 'Sterling Yelagiri', category: 'hotels', lat: 12.5820, lng: 78.7480, icon: '🏨', color: 'bg-blue-600', phone: '9876543212' },

        // Tourist Spots
        { id: 4, name: 'Punganoor Lake', category: 'spots', lat: 12.5833, lng: 78.7500, icon: '⛰️', color: 'bg-green-600', description: 'Beautiful lake for boating' },
        { id: 5, name: 'Swamimalai Hills', category: 'spots', lat: 12.5950, lng: 78.7600, icon: '⛰️', color: 'bg-green-600', description: 'Trekking and sunrise point' },
        { id: 6, name: 'Nature Park', category: 'spots', lat: 12.5840, lng: 78.7510, icon: '🌳', color: 'bg-green-600', description: 'Musical fountain & aquarium' },
        { id: 7, name: 'Jalagamparai Waterfalls', category: 'spots', lat: 12.5700, lng: 78.7400, icon: '💧', color: 'bg-green-600', description: 'Scenic waterfall' },

        // Restaurants
        { id: 8, name: 'Hilltop Restaurant', category: 'restaurants', lat: 12.5860, lng: 78.7530, icon: '🍽️', color: 'bg-orange-600', phone: '9876543213' },
        { id: 9, name: 'Annapurna Restaurant', category: 'restaurants', lat: 12.5830, lng: 78.7490, icon: '🍽️', color: 'bg-orange-600', phone: '9876543214' },

        // Petrol Pumps
        { id: 10, name: 'HP Petrol Pump', category: 'petrol', lat: 12.5800, lng: 78.7450, icon: '⛽', color: 'bg-red-600', phone: '9876543215' },
        { id: 11, name: 'Indian Oil Petrol Pump', category: 'petrol', lat: 12.5880, lng: 78.7560, icon: '⛽', color: 'bg-red-600', phone: '9876543216' },

        // Hospitals
        { id: 12, name: 'Government Hospital', category: 'emergency', lat: 12.5810, lng: 78.7470, icon: '🏥', color: 'bg-purple-600', phone: '108' },
        { id: 13, name: 'Primary Health Centre', category: 'emergency', lat: 12.5870, lng: 78.7540, icon: '🏥', color: 'bg-purple-600', phone: '9876543217' },

        // ATMs
        { id: 14, name: 'SBI ATM', category: 'atms', lat: 12.5840, lng: 78.7515, icon: '🏧', color: 'bg-slate-600', description: '24/7 ATM' },
        { id: 15, name: 'Indian Bank ATM', category: 'atms', lat: 12.5825, lng: 78.7495, icon: '🏧', color: 'bg-slate-600', description: 'Near Bus Stand' },
        { id: 16, name: 'HDFC Bank ATM', category: 'atms', lat: 12.5865, lng: 78.7535, icon: '🏧', color: 'bg-slate-600', description: 'Near Resort' },

        // Free WiFi Spots
        { id: 17, name: 'Bus Stand WiFi', category: 'wifi', lat: 12.5820, lng: 78.7490, icon: '📶', color: 'bg-cyan-600', description: 'Public Free WiFi' },
        { id: 18, name: 'Lake Park WiFi', category: 'wifi', lat: 12.5835, lng: 78.7505, icon: '📶', color: 'bg-cyan-600', description: 'Free WiFi Zone' },
        { id: 19, name: 'Nature Park WiFi', category: 'wifi', lat: 12.5845, lng: 78.7515, icon: '📶', color: 'bg-cyan-600', description: 'Park Visitor WiFi' },
    ];

    const categories = [
        { id: 'all', label: 'All', icon: '📍' },
        { id: 'hotels', label: 'Hotels', icon: '🏨' },
        { id: 'spots', label: 'Tourist Spots', icon: '⛰️' },
        { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
        { id: 'petrol', label: 'Petrol Pumps', icon: '⛽' },
        { id: 'emergency', label: 'Hospitals', icon: '🏥' },
        { id: 'atms', label: 'ATMs', icon: '🏧' },
        { id: 'wifi', label: 'Free WiFi', icon: '📶' },
    ];

    const filteredLocations = selectedCategory === 'all'
        ? locations
        : locations.filter(loc => loc.category === selectedCategory);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Location access denied');
                }
            );
        }
    }, []);

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

    const openInGoogleMaps = (lat, lng, name) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const getDirections = (lat, lng) => {
        if (userLocation) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`;
            window.open(url, '_blank');
        } else {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 py-8 pt-28">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Interactive Map
                    </h1>
                    <p className="text-gray-600">Explore nearby places in Yelagiri Hills</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span className="text-sm">{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map View */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Embedded Google Maps */}
                            <div className="relative h-[600px]">
                                <iframe
                                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62534.89!2d78.75!3d12.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad4791e2345679%3A0x2b1e0c8c0c8c0c8c!2sYelagiri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>

                                {/* Map Legend */}
                                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                                    <p className="text-xs font-semibold text-gray-900 mb-2">Legend</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span>🏨</span>
                                            <span className="text-gray-600">Hotels</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⛰️</span>
                                            <span className="text-gray-600">Spots</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>🍽️</span>
                                            <span className="text-gray-600">Food</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-600">Petrol</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>🏧</span>
                                            <span className="text-gray-600">ATMs</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>📶</span>
                                            <span className="text-gray-600">WiFi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locations List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Nearby Places ({filteredLocations.length})
                            </h3>

                            <div className="space-y-3">
                                {filteredLocations.map(location => {
                                    const distance = userLocation
                                        ? calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
                                        : null;

                                    return (
                                        <div
                                            key={location.id}
                                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => setSelectedPlace(location)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 ${location.color} rounded-full flex items-center justify-center text-white text-xl flex-shrink-0`}>
                                                    {location.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">{location.name}</h4>
                                                    {location.description && (
                                                        <p className="text-xs text-gray-600 mt-1">{location.description}</p>
                                                    )}
                                                    {distance && (
                                                        <p className="text-xs text-indigo-600 mt-1">📍 {distance} km away</p>
                                                    )}

                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openInGoogleMaps(location.lat, location.lng, location.name);
                                                            }}
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                        >
                                                            View on Map
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                getDirections(location.lat, location.lng);
                                                            }}
                                                            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                                                        >
                                                            Directions
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* Place Details Modal */}
            {selectedPlace && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlace(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-16 h-16 ${selectedPlace.color} rounded-full flex items-center justify-center text-white text-3xl`}>
                                {selectedPlace.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedPlace.name}</h3>
                                {selectedPlace.description && (
                                    <p className="text-gray-600 mt-1">{selectedPlace.description}</p>
                                )}
                            </div>
                        </div>

                        {selectedPlace.phone && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Phone</p>
                                <a href={`tel:${selectedPlace.phone}`} className="text-lg font-semibold text-indigo-600">
                                    {selectedPlace.phone}
                                </a>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => openInGoogleMaps(selectedPlace.lat, selectedPlace.lng, selectedPlace.name)}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Open in Maps
                            </button>
                            <button
                                onClick={() => getDirections(selectedPlace.lat, selectedPlace.lng)}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Get Directions
                            </button>
                        </div>

                        <button
                            onClick={() => setSelectedPlace(null)}
                            className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
