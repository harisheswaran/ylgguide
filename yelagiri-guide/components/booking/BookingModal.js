'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../app/context/AuthContext';

export default function BookingModal({ listing, onClose }) {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Booking details, 2: Room service
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        rooms: 1,
        name: '',
        email: '',
        phone: '',
        specialRequests: '',
        wantsRoomService: false
    });

    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.wantsRoomService && step === 1) {
            // Go to room service step
            setStep(2);
        } else {
            // Complete booking
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-email': user?.email // Send user email for auth
                    },
                    body: JSON.stringify({
                        ...formData,
                        listingId: listing._id,
                        userEmail: user?.email
                    })
                });

                if (res.ok) {
                    alert('Booking request submitted successfully! We will contact you shortly.');
                    onClose();
                } else {
                    const error = await res.json();
                    alert(error.message || 'Booking failed');
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            }
        }
    };

    const handleRoomServiceOrder = () => {
        // Redirect to restaurant ordering with hotel context
        localStorage.setItem('hotelBooking', JSON.stringify({
            hotel: listing.name,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            room: formData.rooms,
            guest: formData.name
        }));
        router.push('/restaurants'); // Redirect to restaurants category
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {step === 1 ? 'Book Your Stay' : 'Order Room Service'}
                            </h2>
                            <p className="text-white/90 mt-1">{listing.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
                        <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {step === 1 ? (
                        <>
                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={formData.checkIn}
                                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={formData.checkOut}
                                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Guests & Rooms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Guests
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Rooms
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={formData.rooms}
                                        onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Any special requirements or preferences..."
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Room Service Option */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        checked={formData.wantsRoomService}
                                        onChange={(e) => setFormData({ ...formData, wantsRoomService: e.target.checked })}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">🍽️</span>
                                            <span className="font-semibold text-gray-900">Pre-order Room Service</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Order food from our restaurant to be delivered to your room upon arrival
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <h3 className="font-semibold text-gray-900">Booking Summary</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>📅 {formData.checkIn || 'Select date'} → {formData.checkOut || 'Select date'}</p>
                                    <p>👥 {formData.guests} Guest{formData.guests !== 1 ? 's' : ''} • {formData.rooms} Room{formData.rooms !== 1 ? 's' : ''}</p>
                                    <p>🏨 {listing.name}</p>
                                    {formData.wantsRoomService && (
                                        <p className="text-orange-600 font-medium">🍽️ Room service will be available</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    {formData.wantsRoomService ? 'Continue to Order Food' : 'Confirm Booking'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Room Service Step */}
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🍽️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Room Service</h3>
                                <p className="text-gray-600 mb-6">
                                    Browse our restaurant menu and pre-order food to be delivered to your room
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                    <h4 className="font-semibold text-gray-900 mb-2">Your Booking Details:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>👤 {formData.name}</p>
                                        <p>📅 {formData.checkIn} to {formData.checkOut}</p>
                                        <p>🏨 Room {formData.rooms}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRoomServiceOrder}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        Browse Menu & Order
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
