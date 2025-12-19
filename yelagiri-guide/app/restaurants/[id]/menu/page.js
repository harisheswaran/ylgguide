'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MenuPage({ params }) {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Mock fetching menu items
        // In real app: fetch(`http://localhost:5000/api/orders/menu/${params.id}`)
        setMenuItems([
            { _id: '1', name: 'Paneer Butter Masala', price: 250, description: 'Rich creamy curry', isVegetarian: true },
            { _id: '2', name: 'Chicken Biryani', price: 300, description: 'Authentic style', isVegetarian: false },
            { _id: '3', name: 'Naan', price: 40, description: 'Butter naan', isVegetarian: true },
        ]);
    }, [params.id]);

    const addToCart = (item) => {
        setCart([...cart, item]);
        // In real app: Update local storage or context
        alert(`${item.name} added to cart!`);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Menu
                    </h1>
                    <a href="/cart" className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                        View Cart ({cart.length})
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-orange-500/50 transition-colors"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-4 h-4 rounded-sm border ${item.isVegetarian ? 'border-green-500 flex items-center justify-center' : 'border-red-500 flex items-center justify-center'}`}>
                                        <span className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </span>
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                                <p className="text-lg font-semibold">₹{item.price}</p>
                            </div>
                            <button
                                onClick={() => addToCart(item)}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium"
                            >
                                Add
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
