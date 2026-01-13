'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageBookingConfirmation from '@/components/booking/PackageBookingConfirmation';
import GuideBookingConfirmation from '@/components/booking/GuideBookingConfirmation';
import { Loader2 } from 'lucide-react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setError('Booking ID is missing');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings/confirmation/${bookingId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setBooking(data.data || data); 
                } else {
                    throw new Error('Could not fetch booking details');
                }

            } catch (err) {
                console.warn('Fetching booking failed:', err);
                setError('Could not load booking details. Please check your email.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#BFA76A] animate-spin" />
            </div>
        );
    }

    if (!booking) {
         return (
            <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
                <Navbar dark={true} />
                <div className="flex-1 container mx-auto px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold text-[#1F3D2B] mb-4">Booking Confirmed</h1>
                    <p className="text-gray-500">Reference ID: {bookingId}</p>
                    <p className="text-sm text-gray-400 mt-2">Check your email for full details.</p>
                </div>
                <Footer dark={false} />
            </div>
         );
    }

    const isGuideBooking = (booking.bookingId || booking._id || '').includes('guide') || 
                          (!!booking.bookingSlot && !!booking.bookingDate) ||
                          (booking.packageName && (booking.packageName.toLowerCase().includes('trek') || booking.packageName.toLowerCase().includes('guide')));

    return (
        <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
            <Navbar dark={true} />
            <div className="flex-1 container mx-auto px-4 py-12 md:py-24">
                {isGuideBooking ? (
                    <GuideBookingConfirmation booking={booking} />
                ) : (
                    <PackageBookingConfirmation booking={booking} />
                )}
            </div>
            <Footer dark={false} />
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
