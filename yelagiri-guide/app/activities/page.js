'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ActivitiesContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || '';

    return (
        <div className="min-h-screen bg-[#FAFBF9]">
            <Navbar dark={true} />
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl font-bold text-[#1F3D2B] mb-4">Activities</h1>
                <p className="text-gray-500">Explore exciting activities in Yelagiri.</p>
            </div>
            <Footer dark={false} />
        </div>
    );
}

export default function ActivitiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1F3D2B]/20 border-t-[#1F3D2B] rounded-full animate-spin" /></div>}>
            <ActivitiesContent />
        </Suspense>
    );
}
