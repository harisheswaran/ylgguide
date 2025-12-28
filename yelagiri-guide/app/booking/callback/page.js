'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            const order_id = searchParams.get('order_id');
            const order_token = searchParams.get('order_token'); // Cashfree
            
            // Add other gateway params as needed (e.g. razorpay_payment_id)

            if (!order_id) {
                setStatus('error');
                setMessage('Invalid callback parameters');
                return;
            }

            try {
                // Call backend to verify
                // Note: The specific endpoint depends on the backend implementation which we are also restoring.
                // Assuming /api/bookings/verify-payment or similar.
                // Since the user deleted backend files too, we might need to verify that later.
                // For now, let's assume a generic verification or redirect for Cashfree.
                
                // If using Cashfree, we might just query the status
                const response = await fetch(`/api/bookings/check-status?transactionId=${order_id}`);
                const data = await response.json();

                if (data.success && data.paymentStatus === 'paid') {
                    setStatus('success');
                    setMessage('Payment successful! Redirecting...');
                    setTimeout(() => {
                        router.push(`/booking/confirmation?bookingId=${data.bookingId}`);
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('An error occurred during verification');
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
            <Navbar dark={true} />
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    {status === 'verifying' && (
                        <div className="space-y-4">
                            <Loader2 className="w-12 h-12 text-[#BFA76A] animate-spin mx-auto" />
                            <h2 className="text-xl font-bold text-[#1F3D2B]">Verifying Payment</h2>
                            <p className="text-gray-500">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F3D2B]">Payment Successful!</h2>
                            <p className="text-gray-500">{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F3D2B]">Payment Failed</h2>
                            <p className="text-gray-500">{message}</p>
                            <button 
                                onClick={() => router.push('/trip-packages')}
                                className="px-6 py-2 bg-[#1F3D2B] text-white rounded-xl text-sm font-bold mt-4"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer dark={false} />
        </div>
    );
}

export default function BookingCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
