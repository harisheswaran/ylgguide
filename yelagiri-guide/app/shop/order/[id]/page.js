'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Clock, Truck, Package, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function OrderTrackingPage() {
    const params = useParams();
    const id = params?.id;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const res = await fetch(`${API_URL}/api/shop/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar dark={false} />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1F3D2B]" />
                </div>
                <Footer dark={false} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar dark={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
                    <Link
                        href="/shop"
                        className="px-6 py-2 bg-[#1F3D2B] text-white rounded-lg hover:bg-[#2F5D4B]"
                    >
                        Return to Shop
                    </Link>
                </div>
                <Footer dark={false} />
            </div>
        );
    }

    const steps = [
        { status: 'Placed', icon: CheckCircle, label: 'Order Placed' },
        { status: 'Processing', icon: Clock, label: 'Processing' },
        { status: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
        { status: 'Delivered', icon: Package, label: 'Delivered' }
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.status);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <div className="pt-28 pb-16 container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Tracking</h1>
                    <p className="text-gray-500">Order ID: <span className="font-mono text-gray-700">#{order._id.slice(-6).toUpperCase()}</span></p>
                </div>

                {/* Tracking Progress */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row justify-between relative overflow-hidden">
                        {/* Progress Bar Background */}
                        <div className="absolute top-8 left-0 w-full h-1 bg-gray-100 md:block hidden"></div>

                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isActive = index === currentStepIndex;

                            return (
                                <div key={step.status} className="relative z-10 flex flex-col items-center flex-1">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${isCompleted ? 'border-[#1F3D2B] text-[#1F3D2B]' : 'border-gray-200 text-gray-300'}`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <p className={`mt-4 font-medium text-sm ${isCompleted ? 'text-[#1F3D2B]' : 'text-gray-400'}`}>
                                        {step.label}
                                    </p>
                                    {isActive && (
                                        <p className="text-xs text-green-600 font-bold mt-1 animate-pulse">In Progress</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#1F3D2B]" /> Items Ordered
                        </h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                        <img src={item.image || 'https://placehold.co/100x100'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-4 pt-4">
                            <div className="flex justify-between items-center font-bold text-[#1F3D2B] text-lg">
                                <span>Total Paid</span>
                                <span>₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#1F3D2B]" /> Delivery Details
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Shipping Address</p>
                                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                                <p className="text-gray-600">{order.shippingAddress.address}</p>
                                <p className="text-gray-600">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                                <p className="text-gray-600">Ph: {order.shippingAddress.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Payment Method</p>
                                <p className="font-medium text-gray-800">{order.paymentMethod}</p>
                            </div>
                        </div>

                        <Link
                            href="/shop"
                            className="block w-full mt-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-center hover:bg-gray-200 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            <Footer dark={false} />
        </div>
    );
}
