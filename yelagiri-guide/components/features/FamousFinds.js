'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const famousFinds = [
    {
        title: "Golden Forest Honey",
        category: "Produce",
        location: "Vainu Bappu Observatory Road",
        time: "8:00 AM - 5:00 PM",
        description: "Pure, unprocessed honey collected by local tribes from the dense forests of Yelagiri. Famous for its medicinal properties and rich taste.",
        image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
        accent: "from-orange-500 to-red-600"
    },
    {
        title: "Artisan Woodworks",
        category: "Craft",
        location: "Punganoor Lake Stall",
        time: "10:00 AM - 7:00 PM",
        description: "Traditional bamboo work and clay pottery handcrafted by local artisans. Perfect souvenirs that represent the soul of the Eastern Ghats.",
        image: "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?auto=format&fit=crop&w=800&q=80",
        accent: "from-amber-400 to-amber-600"
    },
    {
        title: "Mountain Jackfruit",
        category: "Fruit",
        location: "Local Orchards & Athanavur Market",
        time: "9:00 AM - 6:00 PM",
        description: "Yelagiri's signature fruit, known for its incredible sweetness and distinct mountain-grown flavor. Best found in local stalls near the lake.",
        image: "https://images.unsplash.com/photo-1594916814238-164998064973?auto=format&fit=crop&w=800&q=80",
        accent: "from-lime-400 to-green-600"
    }
];

export default function FamousFinds() {
    return (
        <section id="famous-finds" className="py-16 md:py-24 bg-[#FAFBF9] relative overflow-hidden scroll-mt-20">
            {/* Background decoration matching EventsSection */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-forest-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <div className="w-12 h-[1px] bg-[#BFA76A]"></div>
                            <span className="text-[#BFA76A] uppercase tracking-[0.4em] text-sm font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>Local treasures</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-[#1F3D2B] leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Famous Finds of Yelagiri</h2>
                        <p className="text-sm md:text-base font-light mt-4 max-w-lg text-[#5F6368]">Handpicked specialities that define the authentic mountain experience.</p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/explore" className="group flex items-center gap-3 text-[#1F3D2B] font-bold px-8 py-4 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-500 border border-[#1F3D2B]/5">
                            <span className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>View More</span>
                            <div className="p-1.5 bg-[#1F3D2B] rounded-lg text-white group-hover:bg-[#BFA76A] transition-colors duration-500">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {famousFinds.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -12 }}
                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.12)] transition-all duration-500 border border-[#1F3D2B]/5 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transform group-hover:scale-[1.05] transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] uppercase tracking-widest font-bold border border-white/10">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 md:p-10 flex flex-col flex-grow">
                                <h3 className="text-xl md:text-2xl font-bold text-[#1F3D2B] mb-4 group-hover:text-forest-700 transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {item.title}
                                </h3>
                                <p className="text-[#5F6368] text-sm leading-relaxed mb-8 flex-grow">
                                    {item.description}
                                </p>

                                <div className="space-y-4 pt-6 border-t border-[#1F3D2B]/5">
                                    <div className="flex items-center gap-4 group/info">
                                        <div className="p-2 rounded-xl bg-[#FAFBF9] border border-[#1F3D2B]/5 text-forest-600 transition-colors group-hover/info:bg-forest-50">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                                            <p className="text-xs text-[#1F3D2B] font-medium">{item.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group/info">
                                        <div className="p-2 rounded-xl bg-[#FAFBF9] border border-[#1F3D2B]/5 text-forest-600 transition-colors group-hover/info:bg-forest-50">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Availability</p>
                                            <p className="text-xs text-[#1F3D2B] font-medium">{item.time}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
