'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageBookingForm from '@/components/booking/PackageBookingForm';
import GuideBookingForm from '@/components/booking/GuideBookingForm';

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();

    // Redirect to sign-in if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            const currentUrl = window.location.pathname + window.location.search;
            router.push(`/signin?redirect=${encodeURIComponent(currentUrl)}`);
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBF9]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#1F3D2B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Don't render content if not authenticated
    if (!user) {
        return null;
    }
    const packageId = searchParams.get('id');
    const packageTitle = searchParams.get('title');
    const packagePrice = searchParams.get('price');
    const packageDescription = searchParams.get('description');
    const bookingDate = searchParams.get('date');
    const bookingPeople = searchParams.get('people');
    const bookingSlot = searchParams.get('slot');

    const guideEmail = searchParams.get('guideEmail');
    const guidePhone = searchParams.get('guidePhone');

    const isGuideBooking = packageId?.startsWith('guide-');

    return (
        <div className="min-h-screen bg-[#FAFBF9]">
            <Navbar dark={true} />
            
            <div className="container mx-auto px-4 py-24">
                {isGuideBooking ? (
                    <GuideBookingForm 
                        packageId={packageId}
                        packageTitle={packageTitle}
                        packagePrice={packagePrice}
                        packageDescription={packageDescription}
                        bookingDate={bookingDate}
                        bookingPeople={bookingPeople}
                        bookingSlot={bookingSlot}
                        guideEmail={guideEmail}
                        guidePhone={guidePhone}
                    />
                ) : (
                    <PackageBookingForm 
                        packageId={packageId}
                        packageTitle={packageTitle}
                        packagePrice={packagePrice}
                        packageDescription={packageDescription}
                    />
                )}
            </div>

            <Footer dark={false} />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}
