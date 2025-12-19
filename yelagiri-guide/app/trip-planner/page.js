'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TripPlannerPage() {
    const [days, setDays] = useState(1);
    const [interests, setInterests] = useState([]);
    const [itinerary, setItinerary] = useState(null);

    const interestOptions = [
        { id: 'nature', label: 'Nature & Scenery', icon: '🌲' },
        { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
        { id: 'food', label: 'Food & Dining', icon: '🍽️' },
        { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
        { id: 'photography', label: 'Photography', icon: '📸' },
    ];

    const sampleItineraries = {
        1: {
            nature: [
                { time: '6:00 AM', activity: 'Sunrise at Swamimalai Hills', duration: '2 hours' },
                { time: '9:00 AM', activity: 'Breakfast at hotel', duration: '1 hour' },
                { time: '10:30 AM', activity: 'Visit Punganoor Lake', duration: '2 hours' },
                { time: '1:00 PM', activity: 'Lunch at Hilltop Restaurant', duration: '1 hour' },
                { time: '3:00 PM', activity: 'Nature Park exploration', duration: '2 hours' },
                { time: '6:00 PM', activity: 'Sunset viewpoint', duration: '1 hour' },
            ],
            adventure: [
                { time: '7:00 AM', activity: 'Paragliding session', duration: '2 hours' },
                { time: '10:00 AM', activity: 'Trekking to Javadi Hills', duration: '3 hours' },
                { time: '1:00 PM', activity: 'Lunch break', duration: '1 hour' },
                { time: '3:00 PM', activity: 'Boating at Punganoor Lake', duration: '1.5 hours' },
                { time: '5:00 PM', activity: 'Rock climbing', duration: '2 hours' },
            ],
        },
    };

    const toggleInterest = (id) => {
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const generateItinerary = () => {
        const primaryInterest = interests[0] || 'nature';
        const plan = sampleItineraries[days]?.[primaryInterest] || sampleItineraries[1].nature;
        setItinerary(plan);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        AI Trip Planner
                    </h1>
                    <p className="text-gray-600">Create your perfect Yelagiri itinerary</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Days Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            How many days are you staying?
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDays(d)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${days === d
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {d} {d === 1 ? 'Day' : 'Days'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            What are you interested in?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {interestOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleInterest(option.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${interests.includes(option.id)
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-3xl mb-2 block">{option.icon}</span>
                                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateItinerary}
                        disabled={interests.length === 0}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Generate My Itinerary
                    </button>

                    {/* Itinerary Display */}
                    {itinerary && (
                        <div className="mt-8 space-y-4 animate-fadeIn">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Day {days} Itinerary</h3>
                            {itinerary.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex-shrink-0 w-20 text-center">
                                        <div className="text-sm font-semibold text-indigo-600">{item.time}</div>
                                        <div className="text-xs text-gray-500">{item.duration}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.activity}</h4>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">
                                            {index % 3 === 0 ? '🌄' : index % 3 === 1 ? '🍽️' : '🏞️'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm text-blue-900">
                                    💡 <strong>Tip:</strong> Book hotels and restaurants in advance for a hassle-free trip!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
