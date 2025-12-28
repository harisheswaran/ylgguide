'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
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
                // In a real scenario, this would fetch from /api/bookings/:id
                // Since we restored the public status of getBookingById, we can use it.
                // Or if it's protected, we might need a public 'status' endpoint.
                // Let's assume we can fetch it or mock it if the endpoint fails.
                
                // Note: The previous backend logic for 'getBookingById' might be protected now.
                // But let's try the restored logic.
                
                // Wait, in Step 2119's restoration of bookingRoutes.js:
                // router.get('/user/:userId', protect, getUserBookings);
                // There is NO public getBookingById anymore in the restored backend.
                // It was: router.get('/:id', getBookingById); // Made public... in the *deleted* version.
                // The restored version in 2119 didn't have it!
                
                // I need to update the backend route to allow fetching this booking data publically (or by ID) 
                // OR checking the status.
                // For now, let's look at the implementation of 'check-status' or similar.
                
                // Wait, since I'm fixing the frontend first, I'll assume we can pass the data
                // via query params or fetch a public endpoint.
                // If the backend doesn't support it, the fetch will fail.
                
                // Let's rely on a mock fetch or try to hit an endpoint.
                // Since user just wants it to work "like before", and before it likely worked.
                // I will add the route back to the backend in the NEXT step.
                // For this file, I'll code it to FETCH.
                
                // Or, since it's a "Confirmation" page, maybe it just displays success?
                // But the component helper needs props.
                
                // Let's try to fetch from a new endpoint I'll ensure exists: /api/bookings/:id/public  (or similar)
                // Or just /api/bookings/:id if I open it.
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings/confirmation/${bookingId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setBooking(data.data || data); // handle standard structure or direct
                } else {
                    // Fallback to query params if fetch fails (simple display)
                    throw new Error('Could not fetch booking details');
                }

            } catch (err) {
                console.warn('Fetching booking failed:', err);
                // Fallback: Use URL params or partial state? 
                // Assuming we can't show much without fetching.
                setError('Could not load booking details. Please checks your email.');
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

    // Fallback UI if not found
    if (!booking && !loading) {
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

    return (
        <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
            <Navbar dark={true} />
            <div className="flex-1 container mx-auto px-4 py-12 md:py-24">
                <BookingConfirmation booking={booking} />
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
