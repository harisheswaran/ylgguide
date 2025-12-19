'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categoryGradients = {
    hotels: 'from-purple-500 to-indigo-600',
    spots: 'from-pink-500 to-rose-600',
    restaurants: 'from-blue-400 to-cyan-500',
    emergency: 'from-red-400 to-yellow-500',
    activities: 'from-teal-400 to-purple-900',
    shopping: 'from-teal-200 to-pink-300'
};

export default function ListingCard(props) {
    const { id, name, description, address, phone, image, category } = props;
    const categorySlug = category?.slug || 'hotels';
    const gradientClass = categoryGradients[categorySlug] || 'from-gray-400 to-gray-600';

    const listingId = id || props._id;

    return (
        <Link href={`/listing/${listingId}`}>
            <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
            >
                <div className="relative h-56 overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    ) : (
                        <div className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                            <div className="text-white text-6xl opacity-50 animate-float">
                                {category?.icon || '🏨'}
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-lg">
                        {category?.name || 'Listing'}
                    </div>
                </div>

                <div className="p-6 relative">
                    <div className="absolute -top-6 right-6 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                        {props.rating > 0 && (
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                <span className="text-amber-500">★</span>
                                <span className="text-slate-700 font-bold text-sm">{props.rating}</span>
                                <span className="text-slate-400 text-xs">({props.reviewsCount})</span>
                            </div>
                        )}
                        {props.price > 0 && (
                            <div className="text-teal-600 font-bold text-sm bg-teal-50 px-2 py-1 rounded-lg">
                                ₹{props.price}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1">{address}</span>
                        </div>
                        {phone && phone !== 'N/A' && (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{phone}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <span className="text-teal-600 font-bold text-sm flex items-center group-hover:gap-2 transition-all">
                            View Details
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
