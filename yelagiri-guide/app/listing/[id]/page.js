'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from '@/components/booking/BookingModal';
import OrderModal from '@/components/booking/OrderModal';
import ReviewsSection from '@/components/features/ReviewsSection';
import PhotoGallery from '@/components/features/PhotoGallery';
import FavoriteButton from '@/components/features/FavoriteButton';
import ShareButton from '@/components/features/ShareButton';
import { useAuth } from '@/app/context/AuthContext';

export default function ListingDetailPage({ params }) {
    const { id } = params;
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch listing');
                }
                const data = await res.json();
                setListing(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || "We couldn't find the listing you're looking for."}</p>
                    <Link href="/" className="text-indigo-600 hover:underline">Go back home</Link>
                </main>
                <Footer />
            </div>
        );
    }

    const isHotel = listing.category?.slug === 'hotels';
    const isRestaurant = listing.category?.slug === 'restaurants';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 to-go-green-50/30">
            <Navbar />

            <main className="flex-1">
                {/* Hero / Image Section */}
                <div className="h-[350px] md:h-[450px] relative">
                    {listing.image ? (
                        <Image src={listing.image} alt={listing.name} fill sizes="100vw" className="object-cover" />
                    ) : (
                        <div className={`flex items-center justify-center h-full w-full bg-gradient-to-br ${isHotel ? 'from-go-green-400 to-blue-500' : isRestaurant ? 'from-orange-400 to-amber-500' : 'from-green-400 to-emerald-600'}`}>
                            <div className="text-white text-8xl opacity-40 animate-float">
                                {listing.category?.icon || '📍'}
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Floating Action Buttons */}
                    <div className="absolute top-6 right-6 flex gap-3">
                        <FavoriteButton listingId={listing._id} listingName={listing.name} />
                        <ShareButton listingName={listing.name} />
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">{listing.name}</h1>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">{listing.description}</p>

                                {listing.features && listing.features.length > 0 && (
                                    <div className="mb-2">
                                        <h2 className="text-2xl font-semibold mb-6 text-slate-800 flex items-center gap-2">
                                            <span className="text-go-green-500">✨</span> Features & Amenities
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {listing.features.map((feature) => (
                                                <div key={feature} className="flex items-center gap-3 px-5 py-4 bg-go-green-50/50 text-go-green-800 rounded-2xl border border-go-green-100/50 hover:bg-go-green-50 transition-colors">
                                                    <svg className="w-5 h-5 text-go-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Photo Gallery */}
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
                                <PhotoGallery />
                            </div>

                            {/* Reviews Section */}
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
                                <ReviewsSection listingId={listing._id} />
                            </div>
                        </div>

                        {/* Sidebar / Contact Info */}
                        <div className="md:col-span-1">
                            <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-xl sticky top-24 space-y-8">
                                <h2 className="text-2xl font-semibold text-slate-800">Contact Information</h2>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-go-green-100 flex items-center justify-center flex-shrink-0 text-go-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">Address</p>
                                            <p className="text-slate-700 leading-snug">{listing.address}</p>
                                        </div>
                                    </div>
                                    {listing.phone && listing.phone !== 'N/A' && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Phone</p>
                                                <a href={`tel:${listing.phone}`} className="text-slate-700 hover:text-go-green-600 font-medium">{listing.phone}</a>
                                            </div>
                                        </div>
                                    )}
                                    {listing.email && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                                                <a href={`mailto:${listing.email}`} className="text-slate-700 hover:text-go-green-600 font-medium">{listing.email}</a>
                                            </div>
                                        </div>
                                    )}
                                    {listing.website && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Website</p>
                                                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-go-green-600 font-medium">Visit Website</a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    {isHotel && (
                                        <button
                                            onClick={() => user ? setShowBooking(true) : alert('Please sign in to book a room')}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-go-green-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-go-green-500/20"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {user ? 'Book a Room' : 'Sign in to Book'}
                                        </button>
                                    )}

                                    {isRestaurant && (
                                        <button
                                            onClick={() => user ? setShowOrder(true) : alert('Please sign in to order food')}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {user ? 'Order Food' : 'Sign in to Order'}
                                        </button>
                                    )}

                                    {listing.category?.slug === 'spots' && (
                                        <button
                                            onClick={() => user ? alert('Ticket booking feature coming soon!') : alert('Please sign in to book tickets')}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                            {user ? 'Book Tickets' : 'Sign in to Book Tickets'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => window.open(listing.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.name + ' ' + listing.address)}`, '_blank')}
                                        className="w-full px-6 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        Get Directions
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-slate-100 space-y-4">
                                    {listing.rating > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-amber-500">★</span>
                                                <span className="font-bold text-slate-800">{listing.rating}</span>
                                                <span className="text-slate-400 text-sm">({listing.reviewsCount} reviews)</span>
                                            </div>
                                        </div>
                                    )}
                                    {listing.price > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Entry Fee</span>
                                            <span className="font-bold text-go-green-600 text-lg">₹{listing.price}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Modals */}
            {showBooking && <BookingModal listing={listing} onClose={() => setShowBooking(false)} />}
            {showOrder && <OrderModal listing={listing} onClose={() => setShowOrder(false)} />}
        </div>
    );
}
