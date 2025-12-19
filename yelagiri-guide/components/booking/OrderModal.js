'use client';

import { useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';

const MENU_ITEMS = [
    { id: 1, name: 'South Indian Thali', price: 150, category: 'Main Course', description: 'Traditional South Indian meal with rice, sambar, rasam, and more', image: null },
    { id: 2, name: 'Masala Dosa', price: 80, category: 'Breakfast', description: 'Crispy dosa with potato filling', image: null },
    { id: 3, name: 'Idli Vada', price: 60, category: 'Breakfast', description: '3 Idlis and 1 Vada with sambar and chutney', image: null },
    { id: 4, name: 'Biryani', price: 200, category: 'Main Course', description: 'Aromatic rice with spices and vegetables/chicken', image: null },
    { id: 5, name: 'Paneer Butter Masala', price: 180, category: 'Main Course', description: 'Cottage cheese in rich tomato gravy', image: null },
    { id: 6, name: 'Filter Coffee', price: 30, category: 'Beverages', description: 'Traditional South Indian filter coffee', image: null },
];

export default function OrderModal({ listing, onClose }) {
    const [cart, setCart] = useState([]);
    const [hotelBooking, setHotelBooking] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        tableNumber: '',
        specialInstructions: ''
    });
    const [activeCategory, setActiveCategory] = useState('All');

    // Check if ordering from hotel
    useState(() => {
        const booking = localStorage.getItem('hotelBooking');
        if (booking) {
            const bookingData = JSON.parse(booking);
            setHotelBooking(bookingData);
            setFormData(prev => ({
                ...prev,
                name: bookingData.guest,
                tableNumber: `Room ${bookingData.room}`
            }));
        }
    }, []);

    const categories = ['All', ...new Set(MENU_ITEMS.map(item => item.category))];
    const filteredItems = activeCategory === 'All'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => item.category === activeCategory);

    const addToCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        const existing = cart.find(i => i.id === itemId);
        if (existing.quantity > 1) {
            setCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCart(cart.filter(i => i.id !== itemId));
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Please add items to your order');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': user?.email
                },
                body: JSON.stringify({
                    ...formData,
                    items: cart,
                    total,
                    listingId: listing._id,
                    userEmail: user?.email
                })
            });

            if (res.ok) {
                alert('Order placed successfully! Your food will be ready soon.');
                onClose();
            } else {
                const error = await res.json();
                alert(error.message || 'Order failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{hotelBooking ? 'Room Service Order' : 'Order Food'}</h2>
                            <p className="text-white/90 mt-1">{listing.name}</p>
                            {hotelBooking && (
                                <div className="mt-2 bg-white/20 rounded-lg px-3 py-2 text-sm">
                                    <p>🏨 {hotelBooking.hotel} • Room {hotelBooking.room}</p>
                                    <p>📅 {hotelBooking.checkIn} to {hotelBooking.checkOut}</p>
                                </div>
                            )}
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
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Menu Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeCategory === category
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-3">
                            {filteredItems.map(item => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            <p className="text-lg font-bold text-orange-600 mt-2">₹{item.price}</p>
                                        </div>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all text-sm font-medium"
                                        >
                                            Add +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart & Form Section */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Cart */}
                        <div className="bg-gray-50 rounded-lg p-4 sticky top-0">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Your Order ({cart.length})
                            </h3>

                            {cart.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-8">Cart is empty</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-600">₹{item.price} × {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-6 h-6 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="w-6 h-6 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-orange-600">₹{total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                required
                                placeholder="Your Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="tel"
                                required
                                placeholder="Phone Number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder={hotelBooking ? "Room Number" : "Table Number (Optional)"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                value={formData.tableNumber}
                                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                                readOnly={hotelBooking !== null}
                            />
                            <textarea
                                rows={2}
                                placeholder="Special Instructions"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                value={formData.specialInstructions}
                                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                            />

                            <button
                                type="submit"
                                disabled={cart.length === 0}
                                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Place Order (₹{total})
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
