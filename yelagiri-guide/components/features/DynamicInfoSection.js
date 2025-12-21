'use client';

import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DynamicInfoSection() {
    const [currentTime, setCurrentTime] = useState(new Date('2025-12-21T14:51:36+05:30'));

    // Update time every minute (simulated for the demo based on the provided fixed time)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(prev => new Date(prev.getTime() + 60000));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const spots = [
        { name: "Nature Park", closingTime: "18:00", description: "Musical fountains & bamboo groves" },
        { name: "Punganoor Boat House", closingTime: "18:00", description: "Serene rowing & pedal boating" },
        { name: "Jalagamparai Falls", closingTime: "17:00", description: "Breathtaking seasonal cascades" },
        { name: "Nilavoor Lake", closingTime: "18:00", description: "Quiet gardens & sunset views" },
        { name: "Swamimalai Hills", closingTime: "17:00", description: "Highest peak trek in Yelagiri" }
    ];

    const getTimeRemaining = (closingTimeStr) => {
        const [hours, minutes] = closingTimeStr.split(':').map(Number);
        const closingDate = new Date(currentTime);
        closingDate.setHours(hours, minutes, 0, 0);

        const diff = closingDate - currentTime;
        if (diff <= 0) return "Closed";

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);

        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const bestTimes = [
        { category: "BEST FOR SUNRISE", spot: "Swamimalai Trek", time: "5:30 AM", advice: "Start early for misty peak views." },
        { category: "BEST FOR SUNSET", spot: "Punganoor Lake", time: "5:45 PM", advice: "Golden hour reflection on water." },
        { category: "IDEAL VISIT MONTH", spot: "Peak Season", time: "Nov - Feb", advice: "Misty mornings and chilly nights." }
    ];

    return (
        <section id="live-info" className="bg-[#FAFBF9] py-12 md:py-16 px-6 md:px-8 lg:px-16 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-black/5">

                    {/* Left Section: Closing Soon */}
                    <div className="flex-1 bg-[#FDFBF7] p-8 lg:p-20 relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#BFA76A]/5 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <div className="flex items-start gap-5 mb-14">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#BFA76A]/10">
                                    <Clock className="w-7 h-7 text-[#BFA76A]" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-[24px] font-bold text-[#1F3D2B] tracking-tight leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        Closing Soon
                                    </h2>
                                    <p className="text-[13px] text-[#5F6368] mt-2 font-light">
                                        Real-time operational status for major attractions.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {spots.map((spot, idx) => (
                                    <motion.div 
                                        key={spot.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ x: 10 }}
                                        className="flex justify-between items-center group/item p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#BFA76A]/10"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-[17px] font-bold text-[#1F3D2B] mb-1 transition-colors group-hover/item:text-[#BFA76A]">{spot.name}</h3>
                                            <p className="text-[13px] text-[#5F6368] font-light">{spot.description}</p>
                                        </div>
                                        <div className="ml-4 bg-white px-4 py-2 rounded-full border border-[#BFA76A]/20 shadow-sm transition-transform group-hover/item:scale-105">
                                            <span className="text-[11px] font-bold text-[#BFA76A] tracking-wide whitespace-nowrap">
                                                {getTimeRemaining(spot.closingTime)} left
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-[12px] text-[#5F6368]/50 mt-12 italic">
                                *Operational hours may vary based on weather or local holidays.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Section: Travel Timeline */}
                    <div className="flex-1 bg-[#1A4D2E] p-8 lg:p-20 text-white relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-150" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="relative z-10"
                        >
                            <div className="flex items-start gap-5 mb-14">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
                                    <Calendar className="w-7 h-7 text-[#86EFAC]" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-[24px] font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        Travel Timeline
                                    </h2>
                                    <p className="text-[13px] text-white/60 mt-2 font-light">
                                        Optimization guide for your hilltop journey.
                                    </p>
                                </div>
                            </div>

                            <div className="relative pl-12 space-y-12">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/10" />

                                {bestTimes.map((item, idx) => (
                                    <motion.div 
                                        key={item.category} 
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative group/timeline"
                                    >
                                        {/* Timeline Dot/Icon wrapper */}
                                        <div className="absolute -left-[45px] top-1 p-2.5 rounded-full bg-[#1A4D2E] border-2 border-white/20 z-10 shadow-xl group-hover/timeline:border-[#86EFAC] transition-colors duration-500">
                                            {idx === 0 && <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Clock className="w-4 h-4 text-[#86EFAC]" /></motion.div>}
                                            {idx === 1 && <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Sun className="w-4 h-4 text-[#86EFAC]" /></motion.div>}
                                            {idx === 2 && <Calendar className="w-4 h-4 text-[#86EFAC]" />}
                                        </div>

                                        <div className="space-y-3 pb-2 transition-transform duration-500 group-hover/timeline:translate-x-2">
                                            <span className="text-[8px] font-bold text-[#86EFAC] tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded">
                                                {item.category}
                                            </span>
                                            <h3 className="text-[18px] font-bold leading-tight group-hover/timeline:text-[#86EFAC] transition-colors">{item.spot}</h3>
                                            <p className="text-[13px] text-white/50 leading-relaxed font-light">
                                                {item.advice}
                                            </p>
                                            <div className="inline-block mt-3 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                                                <span className="text-[11px] font-bold text-white tracking-wide">
                                                    {item.time}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
