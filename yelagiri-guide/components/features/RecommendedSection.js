'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const recommendedPlaces = [
    {
        id: 1,
        title: "Yelagiri Residency",
        category: "Hotel",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        price: "₹2,500/night",
        location: "Athanavur"
    },
    {
        id: 3,
        title: "Punganoor Lake",
        category: "Tourist Spot",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80",
        price: "Entry ₹20",
        location: "Center of Town"
    },
    {
        id: 5,
        title: "Hilltop Dining",
        category: "Restaurant",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        price: "₹800 for two",
        location: "Mangalam Road"
    }
];

export default function RecommendedSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-go-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Recommended for you</h2>
                        <p className="text-slate-500 text-lg">Top rated places you shouldn&apos;t miss.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/explore" className="hidden md:flex items-center gap-2 text-go-green-600 font-bold hover:gap-3 transition-all px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md">
                            View All
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendedPlaces.map((place, index) => (
                        <motion.div
                            key={place.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
                        >
                            <Link href={`/listing/${place.id}`} className="block h-full cursor-pointer">
                                <div className="relative h-72 overflow-hidden">
                                    <Image
                                        src={place.image}
                                        alt={place.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold text-slate-800 flex items-center gap-1 shadow-lg">
                                        <span className="text-yellow-500">★</span> {place.rating}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wide border border-white/20">
                                        {place.category}
                                    </div>
                                </div>
                                <div className="p-8 relative">
                                    <div className="absolute -top-6 right-8 w-12 h-12 bg-go-green-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-go-green-600 transition-colors">{place.title}</h3>
                                    <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-go-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {place.location}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        <span className="text-slate-400 text-sm font-medium">Starting from</span>
                                        <span className="text-xl font-bold bg-gradient-to-r from-go-green-600 to-blue-600 bg-clip-text text-transparent">{place.price}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white bg-go-green-600 px-8 py-3 rounded-full font-bold shadow-lg shadow-go-green-500/30">
                        View All Places
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
