'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, ExternalLink, ArrowRight } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import { useState } from 'react';

export default function ExploreMapSection() {
    const locations = [
        { id: 1, name: 'Nature Park', lat: 12.5840, lng: 78.7510, category: 'Spots', icon: '🌳', color: 'bg-green-600' },
        { id: 2, name: 'Punganoor Lake', lat: 12.5833, lng: 78.7500, category: 'Spots', icon: '⛰️', color: 'bg-blue-600' },
        { id: 3, name: 'Jalagamparai Falls', lat: 12.5700, lng: 78.7400, category: 'Spots', icon: '💧', color: 'bg-cyan-600' },
        { id: 4, name: 'Swamimalai Hills', lat: 12.5950, lng: 78.7600, category: 'Spots', icon: '⛰️', color: 'bg-emerald-600' },
        { id: 5, name: 'Yelagiri Residency', lat: 12.5850, lng: 78.7520, category: 'Hotels', icon: '🏨', color: 'bg-indigo-600' }
    ];

    const [selectedPlace, setSelectedPlace] = useState(locations[0]);

    return (
        <section id="explore-map" className="py-12 md:py-16 bg-[#F8FAF9] overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-16">

                <div className="flex flex-col lg:flex-row gap-12 items-stretch">

                    {/* Left side: Interactive Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:flex-1 bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-[#1F3D2B]" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    Explore Nearby
                                </h2>
                                <p className="text-[13px] text-[#5F6368] font-light mt-1">
                                    Interactive guide to Yelagiri&apos;s most iconic destinations.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#BFA76A]/10 rounded-full border border-[#BFA76A]/20">
                                <MapPin className="w-4 h-4 text-[#BFA76A]" />
                                <span className="text-xs font-bold text-[#BFA76A] uppercase tracking-[0.2em]">Live Map</span>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="relative flex-grow h-[500px] md:h-auto min-h-[500px] bg-slate-100 group">
                            <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62534.89!2d78.75!3d12.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad4791e2345679%3A0x2b1e0c8c0c8c0c8c!2sYelagiri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
                            ></iframe>

                            {/* Custom Marker Overlay */}
                            <div className="absolute top-6 left-6 right-6 pointer-events-none flex flex-wrap gap-3">
                                {locations.map((loc) => (
                                    <motion.button
                                        key={loc.id}
                                        onClick={() => setSelectedPlace(loc)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full shadow-lg border-2 transition-all duration-300 ${selectedPlace.id === loc.id
                                                ? 'bg-[#1F3D2B] text-white border-[#BFA76A]'
                                                : 'bg-white/90 backdrop-blur-md text-[#1F3D2B] border-transparent hover:border-[#1F3D2B]/20'
                                            }`}
                                    >
                                        <span className="text-xs">{loc.icon}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{loc.name}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Place Info Card */}
                            <AnimatePresence mode="wait">
                                {selectedPlace && (
                                    <motion.div
                                        key={selectedPlace.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                        className="absolute bottom-8 left-8 right-8 md:right-auto md:w-80 bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/20"
                                    >
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className={`w-14 h-14 ${selectedPlace.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner text-white`}>
                                                {selectedPlace.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {selectedPlace.name}
                                                </h3>
                                                <span className="text-[9px] font-bold text-[#BFA76A] uppercase tracking-widest">{selectedPlace.category}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 py-3 bg-[#1F3D2B] text-white rounded-2xl text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#2D5A3F] transition-colors shadow-lg shadow-[#1F3D2B]/20"
                                            >
                                                <Navigation className="w-4 h-4" />
                                                Get Directions
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-3.5 bg-[#FAFBF9] text-[#1F3D2B] rounded-2xl border border-[#1F3D2B]/10 hover:bg-white transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right side: Informational Hub */}
                    <div className="w-full lg:w-96 flex flex-col gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full flex flex-col gap-10"
                        >
                            <WeatherWidget />

                            <div className="bg-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-black/5 flex-grow">
                                <h3 className="text-[11px] font-bold text-[#BFA76A] uppercase tracking-[0.3em] mb-8">
                                    Travel Hub
                                </h3>
                                <div className="space-y-6">
                                    <motion.a 
                                        href="tel:108"
                                        whileHover={{ y: -5 }}
                                        className="flex items-center gap-5 p-5 rounded-[2rem] bg-[#ef4444]/5 border border-[#ef4444]/10 hover:bg-[#ef4444]/10 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:bg-[#ef4444] transition-colors duration-500">
                                            <Phone className="w-5 h-5 text-[#ef4444] group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold text-[#ef4444] uppercase tracking-widest mb-1">Emergency</p>
                                            <p className="text-[15px] font-bold text-[#1F3D2B]">Dial 108</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-[#ef4444] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                                    </motion.a>

                                    <motion.button 
                                        whileHover={{ y: -5 }}
                                        className="w-full flex items-center gap-5 p-5 rounded-[2rem] bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 hover:bg-[#1F3D2B]/10 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:bg-[#1F3D2B] transition-colors duration-500">
                                            <MapPin className="w-5 h-5 text-[#1F3D2B] group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[9px] font-bold text-[#5F6368] uppercase tracking-widest mb-1">Resources</p>
                                            <p className="text-[15px] font-bold text-[#1F3D2B]">Official Travel Guide</p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-[#1F3D2B] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
