'use client';

import { useState } from 'react';

export default function EmergencySOSButton() {
    const [showModal, setShowModal] = useState(false);

    const emergencyContacts = [
        { name: 'Police', number: '100', icon: '🚓', color: 'bg-blue-600' },
        { name: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-600' },
        { name: 'Fire', number: '101', icon: '🚒', color: 'bg-orange-600' },
        { name: 'Women Helpline', number: '1091', icon: '👮‍♀️', color: 'bg-pink-600' },
        { name: 'Tourist Helpline', number: '1363', icon: '🏔️', color: 'bg-green-600' },
    ];

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    const shareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const message = `Emergency! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;

                // Share via WhatsApp
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            });
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <>
            {/* Emergency Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 left-6 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-pulse"
                title="Emergency SOS"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </button>

            {/* Emergency Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        {/* Header */}
                        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                        🚨
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Emergency SOS</h2>
                                        <p className="text-white/90 text-sm">Quick access to help</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="p-6 space-y-3">
                            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
                            {emergencyContacts.map((contact) => (
                                <button
                                    key={contact.number}
                                    onClick={() => handleCall(contact.number)}
                                    className={`w-full ${contact.color} text-white p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-between group`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{contact.icon}</span>
                                        <div className="text-left">
                                            <p className="font-semibold">{contact.name}</p>
                                            <p className="text-sm opacity-90">{contact.number}</p>
                                        </div>
                                    </div>
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                            ))}

                            {/* Share Location */}
                            <button
                                onClick={shareLocation}
                                className="w-full bg-purple-600 text-white p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-between group mt-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📍</span>
                                    <div className="text-left">
                                        <p className="font-semibold">Share My Location</p>
                                        <p className="text-sm opacity-90">Send emergency location</p>
                                    </div>
                                </div>
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
