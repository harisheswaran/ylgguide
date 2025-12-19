'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CategoryPage({ params }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category } = params;
    const title = category.charAt(0).toUpperCase() + category.slice(1);

    useEffect(() => {
        async function fetchListings() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings?category=${category}`);
                const data = await res.json();
                setListings(data.listings || []);
            } catch (error) {
                console.error('Failed to fetch listings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchListings();
    }, [category]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-go-green-50/40">
            <Navbar dark={false} />

            <main className="flex-1 container mx-auto px-4 py-12 pt-28">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-go-green-600 to-blue-600 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-slate-500 text-lg">
                        {loading ? 'Loading...' : `Found ${listings.length} amazing places`}
                    </p>
                </motion.div>

                {/* Listings Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing, index) => (
                            <motion.div
                                key={listing.id || listing._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ListingCard {...listing} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-slate-600">No listings found for this category.</p>
                        <p className="text-slate-500 mt-2">Try exploring other categories!</p>
                    </motion.div>
                )}
            </main>

            <Footer dark={false} />
        </div>
    );
}
