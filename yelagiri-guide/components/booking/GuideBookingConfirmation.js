'use client';

import { motion } from 'framer-motion';
import { 
    CheckCircle2, Download, Calendar, 
    Users, Mail, Phone, ShieldCheck, Clipboard, ArrowRight, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GuideBookingConfirmation({ booking }) {
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (booking && typeof window !== 'undefined') {
            const savedBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
            if (!savedBookings.find(b => b._id === booking._id || b.bookingId === booking.bookingId)) {
                savedBookings.unshift(booking);
                localStorage.setItem('my_bookings', JSON.stringify(savedBookings));
            }
        }
    }, [booking]);

    const handleDownload = async (e) => {
        e.preventDefault();
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            const id = booking._id || booking.bookingId;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/invoices/booking/${id}`);
            const data = await res.json();
            if (data.success && data.data?.downloadUrl) {
                window.location.href = `${apiUrl}${data.data.downloadUrl}`;
            } else {
                throw new Error("Invoice not found");
            }
        } catch (error) {
            console.error("Download failed:", error);
            alert("Invoice is being generated. Please click again shortly.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans text-[#333]">
            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="h-1.5 bg-gradient-to-r from-[#17CF97] to-[#1F3D2B] w-full" />
                
                <div className="text-center pt-8 pb-6 px-6 border-b border-dashed border-gray-200 bg-gradient-to-b from-[#f0f9f6] to-white">
                    <CheckCircle2 className="w-12 h-12 text-[#17CF97] mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-[#1F3D2B] uppercase tracking-wide">Trek Confirmed</h1>
                    <p className="text-gray-500 text-sm">Your adventure in the hills is set.</p>
                </div>

                <div className="p-6 md:p-10">
                    <div className="mb-8 font-medium">
                        <p className="text-lg text-[#1F3D2B] font-semibold mb-4">Hi {booking.guestName},</p>
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Payment successfully processed.</span>
                        </div>
                        <p className="text-gray-600 text-sm">Your trek appointment has been successfully scheduled. Details are below.</p>
                    </div>

                    <div className="bg-[#FAFBF9] border border-gray-100 rounded-xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#17CF97]" />
                        <h3 className="text-[#1F3D2B] font-bold text-base mb-5 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#17CF97]" />
                            Trek Summary
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Booking ID', value: booking.bookingId || booking._id },
                                { label: 'Experience', value: booking.packageName },
                                { label: 'Trek Date', value: new Date(booking.bookingDate || booking.checkIn).toLocaleDateString() },
                                { label: 'Time Slot', value: booking.bookingSlot },
                                { label: 'Group Size', value: booking.bookingPeople },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between border-b border-dashed border-gray-200 pb-2 last:border-0">
                                    <span className="text-xs text-gray-400 uppercase font-bold">{item.label}</span>
                                    <span className="text-sm font-medium text-[#1F3D2B]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(booking.guideEmail || booking.guidePhone) && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
                            <h3 className="text-[#1F3D2B] font-bold text-sm mb-4">Guide Contact Info</h3>
                            <div className="space-y-3">
                                {booking.guideEmail && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <a href={`mailto:${booking.guideEmail}`} className="text-[#1F3D2B] hover:underline">{booking.guideEmail}</a>
                                    </div>
                                )}
                                {booking.guidePhone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${booking.guidePhone}`} className="text-[#1F3D2B] hover:underline">{booking.guidePhone}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-[#FAFBF9] border border-gray-100 rounded-xl p-6 mb-8">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Trekking Base Fee</span>
                                <span className="font-medium text-[#1F3D2B]">₹{(booking.baseAmount || (booking.totalAmount / 1.18)).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">GST (18%)</span>
                                <span className="font-medium text-[#1F3D2B]">₹{(booking.taxAmount || (booking.totalAmount - (booking.totalAmount / 1.18))).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1F3D2B] to-[#0f1f16] text-white rounded-xl p-6 mb-8 text-center shadow-lg">
                        <div className="text-[10px] text-[#17CF97] uppercase tracking-widest mb-1">Total Amount Paid</div>
                        <div className="text-3xl font-bold">₹{booking.totalAmount?.toLocaleString()}</div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                        <button onClick={handleDownload} disabled={isDownloading} className="py-3 px-4 bg-[#17CF97] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Invoice
                        </button>
                        <button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings/${booking._id || booking.bookingId}/email-preview`, '_blank')} className="py-3 px-4 bg-[#1F3D2B] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" /> Email Preview
                        </button>
                        <Link href="/my-bookings" className="py-3 px-4 bg-white border border-gray-200 text-[#1F3D2B] font-bold rounded-lg text-sm flex items-center justify-center gap-2">
                            My Bookings <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
