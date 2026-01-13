'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuideBookingForm({ packageId, packageTitle, packagePrice, packageDescription, bookingDate, bookingPeople, bookingSlot, guideEmail, guidePhone }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showMockModal, setShowMockModal] = useState(false);
    const [mockData, setMockData] = useState(null);
    
    // Convert price to number safely
    const basePrice = packagePrice ? parseInt(packagePrice.replace(/[^0-9]/g, '')) : 5000;

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        packageName: packageTitle || 'Trek Experience',
        packageDescription: packageDescription || 'Professional guide service in Yelagiri Hills',
        bookingDate: bookingDate || '',
        bookingSlot: bookingSlot || '',
        bookingPeople: bookingPeople || '',
        guideEmail: guideEmail || '',
        guidePhone: guidePhone || '',
        baseAmount: basePrice
    });

    // Calculate tax and total
    const gstRate = 18; // 18% GST
    const taxAmount = (formData.baseAmount * gstRate) / 100;
    const totalAmount = formData.baseAmount + taxAmount;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.bookingDate || !formData.bookingSlot || !formData.bookingPeople) {
                throw new Error('Please ensure all trekking details are selected.');
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
            console.log('🚀 Submitting guide booking to:', `${apiUrl}/api/bookings`);

            const response = await fetch(`${apiUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to create booking');
            }

            if (data.data.isMockMode) {
                setMockData(data.data);
                setShowMockModal(true);
                setLoading(false);
                return;
            }

            if (data.data.isRedirect) {
                setLoading(true);
                window.location.href = data.data.paymentUrl;
                return;
            }

            throw new Error('Payment initialization failed.');

        } catch (err) {
            console.error('Booking error:', err);
            setError(err.message || 'Failed to process booking');
            setLoading(false);
        }
    };

    const handleMockPayment = async (status) => {
        setLoading(true);
        setShowMockModal(false);

        if (status === 'success') {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
                const response = await fetch(`${apiUrl}/api/bookings/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bookingId: mockData.bookingId,
                        order_id: mockData.orderId,
                        payment_id: 'mock_pay_' + Date.now(),
                        signature: 'mock_signature',
                        isGuide: true
                    })
                });

                const data = await response.json();
                if (data.success) {
                    router.push(`/booking/confirmation?bookingId=${mockData.bookingId}&invoiceId=${data.data.invoiceId}`);
                } else {
                    throw new Error(data.message || 'Mock payment verification failed');
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        } else {
            setError('Payment cancelled.');
            setLoading(false);
        }
    };

    return (
        <div className="booking-form-container">
            <div className="booking-form-card">
                <h2 className="form-title">Confirm Your Guide Booking</h2>
                <p className="form-subtitle">Please verify the trekking details below</p>

                {error && (
                    <div className="error-alert">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-section">
                        <h3 className="section-title">Guest Information</h3>
                        <div className="form-group">
                            <label htmlFor="guestName">Full Name *</label>
                            <input
                                type="text"
                                id="guestName"
                                name="guestName"
                                value={formData.guestName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="guestEmail">Email Address *</label>
                                <input
                                    type="email"
                                    id="guestEmail"
                                    name="guestEmail"
                                    value={formData.guestEmail}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="guestPhone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="guestPhone"
                                    name="guestPhone"
                                    value={formData.guestPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Guide Appointment Summary</h3>
                        <div className="package-info guide-mode">
                             <div className="guide-summary-header flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 flex items-center justify-center text-3xl">🌲</div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#BFA76A] font-bold mb-1">Professional Guide</div>
                                    <div className="text-xl font-bold text-[#1F3D2B]">{formData.packageName.replace('Trek with ', '')}</div>
                                    <div className="text-xs text-gray-400 font-medium">{formData.packageDescription}</div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex flex-wrap gap-6 items-center border-t border-[#BFA76A]/10 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">📅</div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</div>
                                        <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingDate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">⏰</div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Time Slot</div>
                                        <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingSlot}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">👥</div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Group</div>
                                        <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingPeople}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pricing-summary">
                        <h3 className="section-title">Pricing Summary</h3>
                        <div className="price-row">
                            <span>Trekking Base Fee</span>
                            <span>₹{formData.baseAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="price-row">
                            <span>GST ({gstRate}%)</span>
                            <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="price-divider"></div>
                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : 'Proceed to Secure Payment'}
                    </button>
                </form>
            </div>

            {showMockModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-emerald-600 p-6 text-white text-center">
                            <h3 className="text-2xl font-bold">Mock Payment</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between text-lg font-bold text-slate-800">
                                <span>Total Payable</span>
                                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleMockPayment('failure')} className="px-6 py-3 rounded-xl border-2 border-slate-200">Cancel</button>
                                <button onClick={() => handleMockPayment('success')} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold">Pay Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .booking-form-container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .booking-form-card { background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 40px; }
                .form-title { font-size: 32px; font-weight: 700; color: #1A4D2E; margin-bottom: 8px; }
                .form-subtitle { font-size: 16px; color: #6C757D; margin-bottom: 30px; }
                .error-alert { background: #FEE; border: 1px solid #FCC; color: #C33; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
                .booking-form { display: flex; flex-direction: column; gap: 30px; }
                .form-section { display: flex; flex-direction: column; gap: 16px; }
                .section-title { font-size: 20px; font-weight: 600; color: #1A4D2E; margin-bottom: 8px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                label { font-size: 14px; font-weight: 600; color: #495057; }
                input, select { padding: 12px 16px; border: 1px solid #E9ECEF; border-radius: 8px; font-size: 16px; }
                .package-info { background: #F8F9FA; padding: 20px; border-radius: 8px; border-left: 4px solid #C9A961; }
                .pricing-summary { background: #F8F9FA; padding: 24px; border-radius: 12px; }
                .price-row { display: flex; justify-content: space-between; padding: 12px 0; color: #495057; }
                .price-row.total { font-size: 24px; font-weight: 700; color: #1A4D2E; }
                .price-divider { height: 1px; background: #DEE2E6; margin: 12px 0; }
                .submit-button { background: linear-gradient(135deg, #1A4D2E 0%, #2D6A4F 100%); color: #fff; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; }
                @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
