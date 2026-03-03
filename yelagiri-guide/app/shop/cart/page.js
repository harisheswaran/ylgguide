'use client';

import { useShop } from '../context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();
    const TAX_RATE = 0.05;
    const SHIPPING_COST = cartTotal > 500 ? 0 : 40;
    const taxAmount = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + taxAmount + SHIPPING_COST;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <div className="pt-28 pb-16 container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-[#1F3D2B] mb-8 font-poppins">Your Basket</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Your basket is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                        <Link
                            href="/shop"
                            className="px-8 py-3 bg-[#1F3D2B] text-white font-medium rounded-full hover:bg-[#2F5D4B] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 md:gap-6 items-center">
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.product.images[0] || 'https://placehold.co/100x100'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <Link href={`/shop/${item.product._id}`} className="font-bold text-gray-800 text-lg hover:text-[#1F3D2B]">
                                                {item.product.name}
                                            </Link>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">{item.product.category?.name}</p>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-bold text-gray-900">₹{item.product.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax (5%)</span>
                                        <span>₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Delivery</span>
                                        <span className={SHIPPING_COST === 0 ? "text-green-600 font-medium" : ""}>
                                            {SHIPPING_COST === 0 ? "FREE" : `₹${SHIPPING_COST}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Total</span>
                                        <span className="font-bold text-[#1F3D2B] text-xl">₹{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/shop/checkout"
                                    className="w-full py-4 bg-[#1F3D2B] text-white font-bold rounded-xl shadow-lg shadow-[#1F3D2B]/20 hover:bg-[#2F5D4B] transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </Link>

                                <p className="text-center text-xs text-gray-400 mt-4">Safe & Secure Payment</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer dark={false} />
        </div>
    );
}
