'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, FileText, ArrowRight, Package, Mountain, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage() {
    const { user } = useAuth();
    const [packageBookings, setPackageBookings] = useState([]);
    const [guideBookings, setGuideBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            let foundBookings = false;

            // 1. Try fetching from Backend if user is logged in
            if (user?.email) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
                    const res = await fetch(`${apiUrl}/api/bookings/my-bookings`, {
                        headers: {
                            'user-email': user.email
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.data) {
                            setPackageBookings(data.data.packages || []);
                            setGuideBookings(data.data.guides || []);
                            foundBookings = true;
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch from API:", err);
                }
            }

            // 2. Fallback to localStorage if no backend bookings found (or guest mode)
            if (!foundBookings) {
                const saved = localStorage.getItem('my_bookings');
                if (saved) {
                    try {
                        const localBookings = JSON.parse(saved);
                        // Separate manually
                        const pkgs = localBookings.filter(b => !b.bookingDate && !b.packageName?.toLowerCase().includes('trek'));
                        const guides = localBookings.filter(b => b.bookingDate || b.packageName?.toLowerCase().includes('trek'));
                        
                        // Only set if we didn't get API data to avoid overwriting with potentially stale local data
                        // But since we checked 'foundBookings', we are good.
                        setPackageBookings(pkgs);
                        setGuideBookings(guides);
                    } catch (e) {
                        console.error("Failed to parse local bookings", e);
                    }
                }
            }
            setLoading(false);
        };

        fetchBookings();
    }, [user]);

    const handleDownloadInvoice = (booking) => {
        const id = booking.invoiceId || booking.invoiceNumber || booking._id || booking.bookingId;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
        window.open(`${apiUrl}/api/invoices/${id}/download`, '_blank');
    };

    const BookingCard = ({ booking, isGuide }) => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group mb-6"
        >
            <div className="flex flex-col md:flex-row">
                <div className={`md:w-2 ${isGuide ? 'bg-go-green-600' : 'bg-[#BFA76A]'}`}></div>
                
                <div className="p-6 flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${isGuide ? 'bg-green-50 text-go-green-700' : 'bg-amber-50 text-amber-800'}`}>
                                {isGuide ? <Mountain className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                            </div>
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${isGuide ? 'text-go-green-600' : 'text-[#BFA76A]'}`}>
                                    {isGuide ? 'Trekking Guide' : 'Trip Package'}
                                </span>
                                <h3 className="text-xl font-bold text-[#1F3D2B]">{booking.packageName}</h3>
                            </div>
                        </div>
                        
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                            {booking.bookingStatus || 'Confirmed'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 border-t border-dashed border-gray-100 pt-4 mb-6">
                        <div>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">Booking ID</span>
                            <span className="font-mono text-sm font-semibold text-gray-700">#{booking.bookingId || booking._id?.substring(0, 8)}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                                {isGuide ? 'Trek Date' : 'Check-in'}
                            </span>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#BFA76A]" />
                                {booking.bookingDate || booking.checkIn ? new Date(booking.bookingDate || booking.checkIn).toLocaleDateString('en-IN') : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                                {isGuide ? 'Slot' : 'Guests'}
                            </span>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                {isGuide ? <Clock className="w-3.5 h-3.5 text-[#BFA76A]" /> : <Users className="w-3.5 h-3.5 text-[#BFA76A]" />}
                                {isGuide ? (booking.bookingSlot || 'Morning') : `${booking.guests} Guests`}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">Total Paid</span>
                            <span className="text-lg font-bold text-[#1F3D2B]">₹{booking.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            onClick={() => handleDownloadInvoice(booking)}
                            className="flex items-center gap-2 text-sm font-semibold text-[#1F3D2B] bg-[#1F3D2B]/5 hover:bg-[#1F3D2B]/10 px-4 py-2 rounded-lg transition-colors border border-[#1F3D2B]/10"
                        >
                            <FileText className="w-4 h-4" />
                            Download Invoice
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#FAFBF9] font-sans">
            <Navbar dark={true} />

            <div className="pt-28 pb-20 container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-2 font-serif">My Bookings</h1>
                        <p className="text-gray-500">Manage your upcoming trips and invoices</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link href="/trekking-guides" className="text-[#BFA76A] font-semibold hover:text-[#a38d53] transition-colors flex items-center gap-2 text-sm">
                            Book Another Experience <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#BFA76A] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (packageBookings.length === 0 && guideBookings.length === 0) ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                        <p className="text-gray-500 mb-6">You haven't booked any trips yet.</p>
                        <Link href="/" className="inline-block bg-[#1F3D2B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#163320] transition-colors">
                            Explore Packages
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Trekking Guides Section */}
                        {guideBookings.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-[#1F3D2B] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-800">
                                        <Mountain className="w-6 h-6" />
                                    </div>
                                    Trekking Guide Bookings
                                </h2>
                                <div className="space-y-4">
                                    {guideBookings.map((booking, index) => (
                                        <BookingCard key={booking._id || index} booking={booking} isGuide={true} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Package Bookings Section */}
                        {packageBookings.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-[#1F3D2B] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    Standard Package Bookings
                                </h2>
                                <div className="space-y-4">
                                    {packageBookings.map((booking, index) => (
                                        <BookingCard key={booking._id || index} booking={booking} isGuide={false} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
