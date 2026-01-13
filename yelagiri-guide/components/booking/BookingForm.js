'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ packageId, packageTitle, packagePrice, packageDescription, bookingDate, bookingPeople, bookingSlot, guideEmail, guidePhone }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showMockModal, setShowMockModal] = useState(false);
    const [mockData, setMockData] = useState(null);
    
    // Convert price to number safely
    const basePrice = packagePrice ? parseInt(packagePrice.replace(/[^0-9]/g, '')) : 12000;

    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        packageName: packageTitle || 'Gold Package',
        packageDescription: packageDescription || 'Luxury travel experience in Yelagiri Hills',
        checkIn: '',
        checkOut: '',
        guests: 2,
        rooms: 1,
        accommodationType: 'standard',
        specialRequests: '',
        baseAmount: basePrice,
        bookingDate: bookingDate || '',
        bookingSlot: bookingSlot || '',
        bookingPeople: bookingPeople || '',
        guideEmail: guideEmail || '',
        guidePhone: guidePhone || ''
    });

    // Sync formData with props when they change (critical for dynamic updates)
    useEffect(() => {
        if (packageTitle || packagePrice || bookingDate || bookingPeople || bookingSlot) {
            setFormData(prev => ({
                ...prev,
                packageName: packageTitle || prev.packageName,
                baseAmount: packagePrice ? parseInt(packagePrice.replace(/[^0-9]/g, '')) : prev.baseAmount,
                packageDescription: packageDescription || prev.packageDescription,
                checkIn: bookingDate || prev.checkIn,
                // For guide bookings, check-in and check-out are same day
                checkOut: bookingDate || prev.checkOut,
                bookingDate: bookingDate || prev.bookingDate,
                bookingSlot: bookingSlot || prev.bookingSlot,
                bookingPeople: bookingPeople || prev.bookingPeople,
                guideEmail: guideEmail || prev.guideEmail,
                guidePhone: guidePhone || prev.guidePhone,
                guests: bookingPeople ? (parseInt(bookingPeople.split(' ')[0]) || prev.guests) : prev.guests
            }));
        }
    }, [packageTitle, packagePrice, packageDescription, bookingDate, bookingPeople, bookingSlot, guideEmail, guidePhone]);

    const isGuideBooking = packageId?.startsWith('guide-');

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
            // Validate mandatory fields
            if (isGuideBooking) {
                if (!formData.bookingDate || !formData.bookingSlot || !formData.bookingPeople) {
                    throw new Error('Please ensure all trekking details (Date, Slot, and Group Size) are selected.');
                }
            } else {
                const checkInDate = new Date(formData.checkIn);
                const checkOutDate = new Date(formData.checkOut);
                if (checkOutDate <= checkInDate) {
                    throw new Error('Check-out date must be after check-in date');
                }
            }

            // Ensure derived fields are set for guide bookings
            const submitData = { ...formData };
            if (isGuideBooking) {
                // Determine guests from bookingPeople string (e.g., "2-4 People" -> 2)
                const derivedGuests = submitData.bookingPeople 
                    ? parseInt(submitData.bookingPeople.split(' ')[0]) || 1 
                    : 1;

                submitData.guests = derivedGuests;
                submitData.rooms = 1; // Default
                submitData.accommodationType = 'standard'; // Default
                
                // Ensure dates are set for backend requirements
                if (submitData.bookingDate) {
                    submitData.checkIn = submitData.bookingDate;
                    submitData.checkOut = submitData.bookingDate; // Same day for trek
                }
            }

            // Create booking
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
            console.log('🚀 Submitting booking to:', `${apiUrl}/api/bookings`);
            console.log('📦 Payload:', submitData);

            const response = await fetch(`${apiUrl}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to create booking');
            }


            // Check for Mock Mode
            if (data.data.isMockMode) {
                setMockData(data.data);
                setShowMockModal(true);
                setLoading(false);
                return;
            }

            // Check for Redirect flow (PhonePe, Cashfree, etc.)
            if (data.data.isRedirect) {
                setLoading(true);
                window.location.href = data.data.paymentUrl;
                return;
            }

            // If we reach here and it's not a redirect, something went wrong
            throw new Error('Payment initialization failed. No redirect URL received.');

        } catch (err) {
            console.error('Booking error:', err);
            if (err.message === 'Failed to fetch') {
                setError('Unable to connect to the server. Please ensure the backend is running at http://127.0.0.1:5000');
            } else {
                setError(err.message || 'Failed to process booking');
            }
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
                        signature: 'mock_signature'
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
            setError('Payment cancelled. Your booking is still pending.');
            setLoading(false);
        }
    };

    return (
        <div className="booking-form-container">

            <div className="booking-form-card">
                <h2 className="form-title">{isGuideBooking ? 'Confirm Your Guide Booking' : 'Book Your Luxury Experience'}</h2>
                <p className="form-subtitle">{isGuideBooking ? 'Please verify the trekking details below' : 'Complete your booking details below'}</p>

                {error && (
                    <div className="error-alert">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Guest Information */}
                    <div className="form-section">
                        <h3 className="section-title">Guest Information</h3>
                        
                         <div className="form-group">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="guestName">Full Name *</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            guestName: 'Deepak Kumar',
                                            guestEmail: 'deepak@test.com',
                                            guestPhone: '+91 99887 76655',
                                            rooms: 1,
                                            checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                                            checkOut: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] // 4 days from now
                                        }));
                                    }}
                                    className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors uppercase font-bold"
                                >
                                    ⚡ Fill Test Data
                                </button>
                            </div>
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
                                <label htmlFor="guestEmail">Email Address <span className="text-red-500">*</span></label>
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
                                <label htmlFor="guestPhone">Phone Number <span className="text-red-500">*</span></label>
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

                    {/* Package/Guide Details */}
                    <div className="form-section">
                        <h3 className="section-title">{isGuideBooking ? 'Guide Appointment Summary' : 'Package Details'}</h3>
                        
                        <div className={`package-info ${isGuideBooking ? 'guide-mode' : ''}`}>
                            {isGuideBooking ? (
                                <div className="guide-summary-header flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 flex items-center justify-center text-3xl">
                                        🌲
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#BFA76A] font-bold mb-1">Professional Guide</div>
                                        <div className="text-xl font-bold text-[#1F3D2B]">{formData.packageName.replace('Trek with ', '')}</div>
                                        <div className="text-xs text-gray-400 font-medium">{formData.packageDescription}</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="package-name">{formData.packageName}</div>
                                    <div className="package-description">{formData.packageDescription}</div>
                                </>
                            )}
                            
                            {isGuideBooking && (
                                <div className="mt-6 flex flex-wrap gap-6 items-center border-t border-[#BFA76A]/10 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">
                                            📅
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</div>
                                            <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingDate}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">
                                            ⏰
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Time Slot</div>
                                            <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingSlot}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#BFA76A]/10 flex items-center justify-center text-[#BFA76A]">
                                            👥
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Group</div>
                                            <div className="text-sm font-bold text-[#1F3D2B]">{formData.bookingPeople}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="form-section">
                        <h3 className="section-title">{isGuideBooking ? 'Schedule & Preferences' : 'Booking Details'}</h3>
                        
                        {!isGuideBooking && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="checkIn">Check-in Date *</label>
                                        <input
                                            type="date"
                                            id="checkIn"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="checkOut">Check-out Date *</label>
                                        <input
                                            type="date"
                                            id="checkOut"
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleChange}
                                            required
                                            min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="guests">Number of Guests *</label>
                                    <select
                                        id="guests"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="accommodationType">Accommodation Type *</label>
                                    <select
                                        id="accommodationType"
                                        name="accommodationType"
                                        value={formData.accommodationType}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="standard">Standard Room</option>
                                        <option value="cottage">Cottage</option>
                                        <option value="villa">Villa</option>
                                        <option value="resort">Resort</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="homestay">Homestay</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="specialRequests">Special Requests (Optional)</label>
                            <textarea
                                id="specialRequests"
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                placeholder="Any special requirements or preferences..."
                                rows="3"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="pricing-summary">
                        <h3 className="section-title">Pricing Summary</h3>
                        
                        <div className="price-row">
                            <span>{isGuideBooking ? 'Trekking Base Fee' : 'Base Amount'}</span>
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span>🔒</span>
                                Proceed to Secure Payment
                            </>
                        )}
                    </button>

                    <p className="security-note">
                        🔐 Your payment is secured by our encrypted payment gateways. We never store your card details.
                    </p>
                </form>
            </div>

            {/* Mock Payment Modal */}
            {showMockModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-emerald-600 p-6 text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🧪</span>
                            </div>
                            <h3 className="text-2xl font-bold">Mock Payment Mode</h3>
                            <p className="opacity-90">Testing Environment Active</p>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
                                <strong>Note:</strong> Real payment gateways (Cashfree/Razorpay) are not configured. This is a simulated environment for testing.
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Booking ID</span>
                                    <span className="font-mono text-slate-800">{mockData?.bookingId?.substring(0, 8)}...</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-800">
                                    <span>Total Payable</span>
                                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleMockPayment('failure')}
                                    className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleMockPayment('success')}
                                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                >
                                    Pay Now
                                </button>
                            </div>
                            
                            <p className="text-[10px] text-center text-slate-400">
                                Clicking &quot;Pay Now&quot; will simulate a successful transaction and generate your invoice.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .booking-form-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .booking-form-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    padding: 40px;
                }

                .form-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1A4D2E;
                    margin-bottom: 8px;
                }

                .form-subtitle {
                    font-size: 16px;
                    color: #6C757D;
                    margin-bottom: 30px;
                }

                .error-alert {
                    background: #FEE;
                    border: 1px solid #FCC;
                    color: #C33;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .error-icon {
                    font-size: 20px;
                }

                .booking-form {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1A4D2E;
                    margin-bottom: 8px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #495057;
                }

                input, select {
                    padding: 12px 16px;
                    border: 1px solid #E9ECEF;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                textarea {
                    padding: 12px 16px;
                    border: 1px solid #E9ECEF;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    resize: vertical;
                    font-family: inherit;
                }

                .help-text {
                    font-size: 12px;
                    color: #6C757D;
                    margin-top: 4px;
                }

                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #C9A961;
                    box-shadow: 0 0 0 3px rgba(201, 169, 97, 0.1);
                }

                input:disabled, select:disabled, textarea:disabled {
                    background: #F8F9FA;
                    cursor: not-allowed;
                }

                .package-info {
                    background: #F8F9FA;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #C9A961;
                }

                .package-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1A4D2E;
                    margin-bottom: 8px;
                }

                .package-description {
                    font-size: 14px;
                    color: #6C757D;
                }

                .pricing-summary {
                    background: #F8F9FA;
                    padding: 24px;
                    border-radius: 12px;
                }

                .price-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    font-size: 16px;
                    color: #495057;
                }

                .price-row.total {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1A4D2E;
                }

                .price-divider {
                    height: 1px;
                    background: #DEE2E6;
                    margin: 12px 0;
                }

                .submit-button {
                    background: linear-gradient(135deg, #1A4D2E 0%, #2D6A4F 100%);
                    color: #ffffff;
                    padding: 16px 32px;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(26, 77, 46, 0.3);
                }

                .submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .security-note {
                    text-align: center;
                    font-size: 14px;
                    color: #6C757D;
                    margin-top: 16px;
                }


                @media (max-width: 768px) {
                    .booking-form-card {
                        padding: 24px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .form-title {
                        font-size: 24px;
                    }
                }
            `}</style>
        </div>
    );
}
