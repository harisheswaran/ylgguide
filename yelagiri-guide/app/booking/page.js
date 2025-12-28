'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/booking/BookingForm';

function BookingContent() {
    const searchParams = useSearchParams();
    const packageId = searchParams.get('id');
    const packageTitle = searchParams.get('title');
    const packagePrice = searchParams.get('price');
    const packageDescription = searchParams.get('description');

    return (
        <div className="min-h-screen bg-[#FAFBF9]">
            <Navbar dark={true} />
            
            <div className="container mx-auto px-4 py-24">
                <BookingForm 
                    packageId={packageId}
                    packageTitle={packageTitle}
                    packagePrice={packagePrice}
                    packageDescription={packageDescription}
                />
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
