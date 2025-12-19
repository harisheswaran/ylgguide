'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CartPage() {
    // Mock cart data - in real app would come from context/storage
    const [cart, setCart] = useState([
        { _id: '1', name: 'Paneer Butter Masala', price: 250 },
        { _id: '3', name: 'Naan', price: 40 },
        { _id: '3', name: 'Naan', price: 40 },
    ]);

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    const handleCheckout = () => {
        alert('Order Placed Successfully! (Mock)');
        setCart([]);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                    <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                        <div className="space-y-4 mb-8">
                            {cart.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                                    <span>{item.name}</span>
                                    <span className="font-mono">₹{item.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-xl font-bold mb-8 pt-4 border-t border-zinc-700">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors"
                        >
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
