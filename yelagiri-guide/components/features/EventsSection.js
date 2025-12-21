'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const events = [
    {
        id: 1,
        title: "Summer Festival Carnival",
        category: "Festival",
        date: "May 24 - May 26, 2024",
        time: "10:00 AM - 9:00 PM",
        location: "Nature Park Grounds",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
        description: "The biggest annual event featuring flower shows, dog shows, and cultural performances."
    },
    {
        id: 2,
        title: "Hill Station Marathon",
        category: "Sports",
        date: "August 15, 2024",
        time: "6:00 AM - 11:00 AM",
        location: "Kottaiyur Base",
        image: "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800&q=80",
        description: "Experience the thrill of running through the misty hairpin bends of Yelagiri."
    },
    {
        id: 3,
        title: "New Year Star Gazing",
        category: "Experience",
        date: "Dec 31, 2024",
        time: "8:00 PM - 2:00 AM",
        location: "Vainu Bappu Observatory",
        image: "https://images.unsplash.com/photo-1467341303251-067e69c06509?auto=format&fit=crop&w=800&q=80",
        description: "A magical night under the crystal clear skies of the hills with expert guides."
    }
];

export default function EventsSection() {
    return (
        <section id="events" className="py-12 md:py-16 bg-[#FAFBF9] relative overflow-hidden scroll-mt-20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BFA76A]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
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
                            <span className="text-[#BFA76A] uppercase tracking-[0.4em] text-sm font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>Occasions</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-[#1F3D2B] leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Upcoming Events</h2>
                        <p className="text-sm md:text-base font-light mt-4 max-w-lg text-[#5F6368]">Curated seasonal festivals and exclusive experiences in the hills.</p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/events" className="group flex items-center gap-3 text-[#1F3D2B] font-bold px-8 py-4 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-500 border border-[#1F3D2B]/5">
                            <span className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>View Calendar</span>
                            <div className="p-1.5 bg-[#1F3D2B] rounded-lg text-white group-hover:bg-[#BFA76A] transition-colors duration-500">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.12)] transition-all duration-500 border border-[#1F3D2B]/5 flex flex-col h-full"
                        >
                            <div className="relative h-72 overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transform group-hover:scale-[1.05] transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-bold text-[#1F3D2B] uppercase tracking-[0.2em] border border-white/20 shadow-xl">
                                    {event.category}
                                </div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-3 text-sm font-medium bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                                        <span className="text-[#BFA76A]">📅</span> {event.date}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl md:text-2xl font-bold text-[#1F3D2B] mb-4 tracking-tight group-hover:text-[#BFA76A] transition-colors duration-500" style={{ fontFamily: 'var(--font-poppins)' }}>{event.title}</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 text-[#5F6368] text-[15px] font-light">
                                        <div className="w-8 h-8 rounded-xl bg-[#FAFBF9] flex items-center justify-center border border-[#1F3D2B]/5">
                                            <span className="text-[#BFA76A] text-xs">🕒</span>
                                        </div>
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-4 text-[#5F6368] text-[15px] font-light">
                                        <div className="w-8 h-8 rounded-xl bg-[#FAFBF9] flex items-center justify-center border border-[#1F3D2B]/5">
                                            <span className="text-[#BFA76A] text-xs">📍</span>
                                        </div>
                                        {event.location}
                                    </div>
                                </div>

                                <p className="text-[#5F6368] text-[14px] leading-relaxed font-light line-clamp-3 mb-8 overflow-hidden">
                                    {event.description}
                                </p>
 
                                <div className="mt-auto flex justify-end">
                                    <motion.button 
                                        whileHover={{ x: 5 }}
                                        className="text-[#1F3D2B] font-bold flex items-center gap-2 group/link text-sm"
                                    >
                                        <span className="relative z-10">Details</span>
                                        <div className="w-7 h-7 rounded-full bg-[#FAFBF9] flex items-center justify-center border border-[#1F3D2B]/5 group-hover/link:bg-[#BFA76A] group-hover/link:text-white transition-all duration-300">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
