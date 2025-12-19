'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BookingPage({ params }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        name: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: formData.name, // Using name as user ID for now
                    listing: params.id,
                    ...formData,
                    totalAmount: 5000 // Mock amount
                })
            });

            if (res.ok) {
                alert('Booking Confirmed!');
                router.push('/');
            } else {
                alert('Booking Failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-2xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                >
                    Complete your Booking
                </motion.h1>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Check-in Date</label>
                            <input
                                type="date"
                                name="checkIn"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Check-out Date</label>
                            <input
                                type="date"
                                name="checkOut"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Number of Guests</label>
                        <input
                            type="number"
                            name="guests"
                            min="1"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            onChange={handleChange}
                            value={formData.guests}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <h3 className="text-lg font-semibold">Guest Details</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            onChange={handleChange}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : 'Pay & Book Now'}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Secure payment powered by Stripe (Mock)
                        </p>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
