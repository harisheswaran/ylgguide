'use client';

import { useState } from 'react';
import { useShop } from '../context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, MapPin, Phone, User, Home, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart, addOrderToHistory } = useShop();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const TAX_RATE = 0.05;
    const SHIPPING_COST = cartTotal > 500 ? 0 : 40;
    const taxAmount = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + taxAmount + SHIPPING_COST;

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        try {
            const orderData = {
                orderItems: cart.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images[0]
                })),
                shippingAddress: formData,
                paymentMethod: 'Cash on Delivery',
                itemsPrice: cartTotal,
                taxPrice: taxAmount,
                shippingPrice: SHIPPING_COST,
                totalPrice: finalTotal
            };

            const res = await fetch(`${API_URL}/api/shop/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (res.ok) {
                const data = await res.json();
                addOrderToHistory(data._id);
                clearCart();
                router.push(`/shop/order/${data._id}`);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
                <Navbar dark={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => router.push('/shop')}
                        className="px-6 py-2 bg-[#1F3D2B] text-white rounded-lg hover:bg-[#2F5D4B]"
                    >
                        Back to Shop
                    </button>
                </div>
                <Footer dark={false} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <div className="pt-28 pb-16 container mx-auto px-4 max-w-5xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-[#1F3D2B] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Cart
                </button>

                <h1 className="text-3xl font-bold text-[#1F3D2B] mb-8 font-poppins">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#1F3D2B]" /> Shipping Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all"
                                        placeholder="123 Main St"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all"
                                        placeholder="Yelagiri"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        required
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all"
                                        placeholder="635853"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#1F3D2B]" /> Payment Method
                                </h3>
                                <div className="bg-[#E8F5E9] border border-[#1F3D2B]/20 p-4 rounded-xl flex items-center gap-3 text-[#1F3D2B]">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Cash on Delivery</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 py-4 bg-[#1F3D2B] text-white font-bold rounded-xl shadow-lg shadow-[#1F3D2B]/20 hover:bg-[#2F5D4B] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Processing Order...' : `Place Order (₹${finalTotal.toFixed(2)})`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 md:p-8 rounded-3xl h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.product._id} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        <img
                                            src={item.product.images[0] || 'https://placehold.co/100x100'}
                                            alt={item.product.name}
                                            className="object-cover w-full h-full"
                                        />
                                        <span className="absolute bottom-0 right-0 bg-[#1F3D2B] text-white text-[10px] px-1.5 py-0.5 rounded-tl-lg font-medium">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500">₹{item.product.price} each</p>
                                    </div>
                                    <div className="font-bold text-gray-900">
                                        ₹{item.product.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (5%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span className={SHIPPING_COST === 0 ? "text-green-600 font-medium" : ""}>
                                    {SHIPPING_COST === 0 ? "FREE" : `₹${SHIPPING_COST}`}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-900">Total</span>
                                <span className="font-bold text-xl text-[#1F3D2B]">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer dark={false} />
        </div>
    );
}
