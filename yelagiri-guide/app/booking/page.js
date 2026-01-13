'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageBookingForm from '@/components/booking/PackageBookingForm';
import GuideBookingForm from '@/components/booking/GuideBookingForm';

function BookingContent() {
    const searchParams = useSearchParams();
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
