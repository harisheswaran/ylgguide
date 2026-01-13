'use client';

import { motion } from 'framer-motion';
import { 
    CheckCircle2, Download, Calendar, MapPin, 
    Users, FileText, Phone, Mail, Share2, Clipboard, ShieldCheck, Printer, ArrowRight, User 
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BookingConfirmation({ booking }) {
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (booking && typeof window !== 'undefined') {
            const savedBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
            // Avoid duplicates
            if (!savedBookings.find(b => b._id === booking._id || b.bookingId === booking.bookingId)) {
                savedBookings.unshift(booking); // Add to top
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
            
            console.log("Triggering download for:", id);

            // Fetch invoice data first to get the token/url
            const res = await fetch(`${apiUrl}/api/invoices/booking/${id}`);
            const data = await res.json();

            if (data.success && data.data?.downloadUrl) {
                // Direct redirect to the download URL
                const fullUrl = `${apiUrl}${data.data.downloadUrl}`;
                console.log("Redirecting to:", fullUrl);
                window.location.href = fullUrl;
            } else {
                throw new Error(data.message || "Invoice not found");
            }
        } catch (error) {
            console.error("Download failed:", error);
            alert("Invoice is being generated. Please click 'Download' again in a few seconds.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans text-[#333]">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative"
            >
                {/* Gold Accent Top Border */}
                <div className="h-1.5 bg-gradient-to-r from-[#BFA76A] via-[#F3E5AB] to-[#BFA76A] w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                </div>

                {/* Header Section - Compact */}
                <div className="text-center pt-8 pb-6 px-6 border-b border-dashed border-gray-200 bg-gradient-to-b from-[#fafbf9] to-white">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-3 ring-4 ring-green-50/50 shadow-sm"
                    >
                        <CheckCircle2 className="w-10 h-10 text-[#1F3D2B]" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-[#1F3D2B] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Booking Confirmed
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Your luxury journey to Yelagiri begins soon.</p>
                </div>

                <div className="p-6 md:p-10 bg-white relative">
                     {/* Decorative Background Pattern */}
                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                          style={{ backgroundImage: 'radial-gradient(#1F3D2B 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
                     />
                     
                     <div className="relative z-10 mb-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                             <div className="p-1.5 bg-gray-100 rounded-full">
                                <User className="w-4 h-4 text-gray-500" />
                             </div>
                             <p className="text-lg text-[#1F3D2B] font-semibold">Dear {booking.guestName},</p>
                        </div>
                        
                        <div className="bg-green-50/80 backdrop-blur-md border border-green-100 text-green-900 px-4 py-3 rounded-xl text-center text-sm font-medium mb-5 flex items-center justify-center gap-2 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-green-700" />
                            <span>Payment successfully processed.</span>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Thank you for choosing <span className="font-bold text-[#1F3D2B]">Go Yelagiri</span>. We are thrilled to host you for an unforgettable experience. Use the details below for your reference.
                        </p>
                     </div>

                     {/* Booking Details Card - Compact */}
                     <div className="bg-[#FAFBF9] border border-gray-100 rounded-xl p-6 mb-8 shadow-sm relative overflow-hidden hover:shadow-md transition-all duration-300">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#BFA76A]" />
                        
                        <h3 className="text-[#1F3D2B] font-bold text-base mb-5 flex items-center gap-2">
                            <Clipboard className="w-4 h-4 text-[#BFA76A]" />
                            Booking Summary
                        </h3>
                        
                         <div className="grid gap-x-8 gap-y-3">
                            {( (booking.bookingDate || booking.packageName?.toLowerCase().includes('trek')) ? (
                                // Guide Specific Summary
                                [
                                    { label: 'Booking ID', value: booking.bookingId || booking._id, bold: true, fullWidth: true },
                                    { label: 'Experience', value: booking.packageName, fullWidth: true },
                                    { label: 'Trek Date', value: new Date(booking.bookingDate || booking.checkIn).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }), fullWidth: true },
                                    { label: 'Time Slot', value: booking.bookingSlot },
                                    { label: 'Group Size', value: booking.bookingPeople || `${booking.guests} Person(s)` },
                                ]
                            ) : (
                                // Standard Package Summary
                                [
                                    { label: 'Booking ID', value: booking.bookingId || booking._id, bold: true, fullWidth: true },
                                    { label: 'Package', value: booking.packageName, fullWidth: true },
                                    { label: 'Guests', value: `${booking.guests} Person(s)` },
                                    { label: 'Rooms', value: `${booking.rooms} Room(s)` },
                                    { label: 'Check-in', value: new Date(booking.checkIn).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
                                    { label: 'Check-out', value: new Date(booking.checkOut).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
                                ]
                            ) ).map((item, index) => (
                                <div key={index} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-dashed border-gray-200 last:border-0 hover:bg-white/60 transition-colors rounded px-2 -mx-2 ${item.fullWidth ? 'sm:col-span-2' : ''}`}>
                                    <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider">{item.label}</span>
                                    <span className={`text-sm text-[#1F3D2B] font-medium ${item.bold ? 'font-mono text-base tracking-tight' : ''}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Guide Contact Details - NEW */}
                     {((booking.bookingDate || booking.packageName?.toLowerCase().includes('trek')) && (booking.guideEmail || booking.guidePhone)) && (
                        <div className="bg-[#BFA76A]/5 border border-[#BFA76A]/20 rounded-xl p-6 mb-8 shadow-sm relative overflow-hidden">
                           <h3 className="text-[#1F3D2B] font-bold text-base mb-5 flex items-center gap-2">
                               <Phone className="w-4 h-4 text-[#BFA76A]" />
                               Your Guide's Contact Information
                           </h3>
                           <div className="space-y-4">
                               {booking.guideEmail && (
                                   <div className="flex items-center gap-4 bg-white/60 p-3 rounded-lg border border-gray-100">
                                       <div className="w-10 h-10 rounded-full bg-[#1F3D2B]/5 flex items-center justify-center text-[#1F3D2B]">
                                           <Mail className="w-5 h-5" />
                                       </div>
                                       <div>
                                           <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</div>
                                           <a href={`mailto:${booking.guideEmail}`} className="text-sm font-bold text-[#1F3D2B] hover:text-[#BFA76A] transition-colors">{booking.guideEmail}</a>
                                       </div>
                                   </div>
                               )}
                               {booking.guidePhone && (
                                   <div className="flex items-center gap-4 bg-white/60 p-3 rounded-lg border border-gray-100">
                                       <div className="w-10 h-10 rounded-full bg-[#1F3D2B]/5 flex items-center justify-center text-[#1F3D2B]">
                                           <Phone className="w-5 h-5" />
                                       </div>
                                       <div>
                                           <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone Number</div>
                                           <a href={`tel:${booking.guidePhone}`} className="text-sm font-bold text-[#1F3D2B] hover:text-[#BFA76A] transition-colors">{booking.guidePhone}</a>
                                       </div>
                                   </div>
                               )}
                               <p className="text-[10px] text-gray-400 font-medium italic mt-2">
                                   * Please coordinate with your guide regarding the exact meeting point.
                               </p>
                           </div>
                        </div>
                     )}

                     {/* Total Amount Box - Compact & Premium */}
                     <div className="bg-gradient-to-br from-[#1F3D2B] via-[#1a3328] to-[#0f1f16] text-white rounded-xl text-center mb-8 shadow-lg shadow-[#1F3D2B]/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <FileText className="w-20 h-20" />
                        </div>
                        <div className="relative z-10 px-6 py-4 border-b border-white/10">
                            <div className="flex justify-between items-center text-xs text-white/70 mb-1">
                                <span>Base Amount</span>
                                <span>₹{booking.baseAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-white/70">
                                <span>GST (18%)</span>
                                <span>₹{booking.taxAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="relative z-10 py-6">
                            <div className="text-[10px] font-bold text-[#BFA76A] uppercase tracking-[0.2em] mb-1 flex items-center justify-center gap-2">
                                Total Amount <span className="bg-[#BFA76A] text-[#1F3D2B] px-1.5 py-0.5 rounded-[4px] text-[9px] shadow-sm">PAID</span>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold tracking-tight">₹{booking.totalAmount?.toLocaleString()}</div>
                        </div>
                     </div>

                     {/* Action Buttons - Compact */}
                     <div className="grid sm:grid-cols-3 gap-3 mb-8">
                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`py-3 px-4 bg-[#BFA76A] hover:bg-[#a68d52] active:scale-[0.98] text-white font-bold rounded-lg transition-all shadow-md shadow-[#BFA76A]/20 flex items-center justify-center gap-2 group text-sm ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isDownloading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> 
                                    <span>Invoice</span>
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={() => {
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                                const id = booking._id || booking.bookingId;
                                window.open(`${apiUrl}/api/bookings/${id}/email-preview`, '_blank');
                            }}
                            className="py-3 px-4 bg-[#1F3D2B] hover:bg-[#2D6A4F] active:scale-[0.98] text-white font-bold rounded-lg transition-all shadow-md shadow-[#1F3D2B]/20 flex items-center justify-center gap-2 group text-sm"
                        >
                            <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Email Preview</span>
                        </button>
                        
                        <Link href="/my-bookings" className="py-3 px-4 bg-white border border-gray-200 hover:border-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white active:scale-[0.98] text-[#1F3D2B] font-bold rounded-lg transition-all flex items-center justify-center gap-2 group text-sm">
                            <span>My Bookings</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>

                      {/* What's Next Section - Compact */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                         <h4 className="text-[#1F3D2B] font-bold text-sm mb-4 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-[#1F3D2B]" />
                             What&apos;s Next?
                         </h4>
                          <ul className="space-y-3">
                             {( (booking.bookingDate || booking.packageName?.toLowerCase().includes('trek')) ? (
                                  // Guide-specific next steps
                                  [
                                      { text: `Your guide will contact you on ${booking.guestPhone} shortly.`, icon: Phone },
                                      { text: "Pack valid ID proof for trek registration.", icon: ShieldCheck },
                                      { text: `Meet at the trek start point 15 mins before ${booking.bookingSlot}.`, icon: Calendar }
                                  ]
                              ) : (
                                  // Standard package next steps
                                  [
                                      { text: "You'll receive a reminder email 3 days before check-in.", icon: Mail },
                                      { text: "Pack valid ID proof (Aadhar/Passport) for verification.", icon: ShieldCheck },
                                      { text: "Check-in time is between 2:00 PM - 6:00 PM.", icon: Calendar }
                                  ]
                              ) ).map((item, i) => (
                                 <li key={i} className="flex items-start gap-3 text-gray-600 text-xs bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                     <div className="bg-[#FAFBF9] p-1.5 rounded-md shrink-0">
                                         <item.icon className="w-3.5 h-3.5 text-[#BFA76A]" />
                                     </div>
                                     <span className="mt-0.5 leading-relaxed">{item.text}</span>
                                 </li>
                             ))}
                         </ul>
                      </div>
                </div>

                {/* Footer - Compact */}
                <div className="bg-[#f8f9fa] p-6 text-center border-t border-gray-100">
                    <h4 className="text-[#1F3D2B] font-bold text-[10px] uppercase tracking-wider mb-4 opacity-70">Need Assistance?</h4>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
                        <a href="mailto:support@yelagiri.com" className="flex items-center gap-2 text-gray-600 hover:text-[#1F3D2B] transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-[#1F3D2B] shadow-sm">
                             <Mail className="w-3.5 h-3.5 text-[#BFA76A]" />
                             support@yelagiri.com
                        </a>
                        <a href="tel:+919876543210" className="flex items-center gap-2 text-gray-600 hover:text-[#1F3D2B] transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-[#1F3D2B] shadow-sm">
                            <Phone className="w-3.5 h-3.5 text-[#BFA76A]" />
                            +91 98765 43210
                        </a>
                    </div>
                </div>

            </motion.div>
             <p className="mt-6 text-center text-gray-400 text-xs">© {new Date().getFullYear()} Go Yelagiri</p>
        </div>
    );
}
