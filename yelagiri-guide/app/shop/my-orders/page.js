'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useShop } from '../context';
import { Package, ShoppingBag, Clock, CheckCircle, Truck, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
    'Placed': { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Order Placed' },
    'Processing': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Processing' },
    'Out for Delivery': { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Out for Delivery' },
    'Delivered': { icon: Package, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Delivered' },
    'Cancelled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' },
};

export default function MyOrdersPage() {
    const { orderHistory } = useShop();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    useEffect(() => {
        const fetchOrders = async () => {
            if (!orderHistory || orderHistory.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/shop/orders/my-orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderIds: orderHistory })
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [orderHistory]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <div className="pt-28 pb-16 container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center text-gray-500 hover:text-[#1F3D2B] mb-3 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
                        </Link>
                        <h1 className="text-3xl font-bold text-[#1F3D2B] font-poppins">My Orders</h1>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <Package className="w-4 h-4 text-[#1F3D2B]" />
                        <span>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1F3D2B]" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Your order history will appear here after your first purchase.</p>
                        <Link
                            href="/shop"
                            className="px-8 py-3 bg-[#1F3D2B] text-white font-medium rounded-full hover:bg-[#2F5D4B] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => {
                            const config = statusConfig[order.status] || statusConfig['Placed'];
                            const StatusIcon = config.icon;
                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            });
                            const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit', minute: '2-digit'
                            });

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/shop/order/${order._id}`}
                                        className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1F3D2B]/20 transition-all p-5 md:p-6 group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Left side: order info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-mono text-gray-500">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-sm text-gray-500">{orderDate}, {orderTime}</span>
                                                </div>

                                                {/* Items preview */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex -space-x-2">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0">
                                                                <img
                                                                    src={item.image || 'https://placehold.co/40x40'}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700 truncate">
                                                        {order.items.map(i => i.name).join(', ')}
                                                    </p>
                                                </div>

                                                <p className="text-lg font-bold text-gray-900">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                                        ({order.items.reduce((sum, i) => sum + i.quantity, 0)} item{order.items.reduce((sum, i) => sum + i.quantity, 0) > 1 ? 's' : ''})
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Right side: status */}
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.border} border`}>
                                                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                                    <span className={`text-sm font-semibold ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <div className="text-gray-300 group-hover:text-[#1F3D2B] transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer dark={false} />
        </div>
    );
}
