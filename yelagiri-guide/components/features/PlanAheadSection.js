'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Package, 
    UserCheck, 
    Car, 
    Utensils, 
    Home, 
    Hotel, 
    ArrowRight,
    Minus
} from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        title: "Tourist Packages",
        category: "PREMIUM EXPERIENCE",
        description: "Curated travel programs designed to showcase the authentic essence of Yelagiri's landscape.",
        icon: <Package className="w-5 h-5" />,
        href: "/trip-packages",
        features: [
            "Premium accommodation stays",
            "Professional sightseeing tours",
            "Curated breakfast experiences",
            "Dedicated concierge support"
        ]
    },
    {
        title: "Trekking Guides",
        category: "ADVENTURE",
        description: "Guided experiences led by certified local experts through exclusive mountain trails.",
        icon: <UserCheck className="w-5 h-5" />,
        href: "/trekking-guides",
        features: [
            "Certified mountain guides",
            "Technical trekking expertise",
            "Cultural & historical insights",
            "Bespoke trail itineraries"
        ]
    },
    {
        title: "Private Transport",
        category: "CHAUFFEUR",
        description: "Discreet and professional transportation services for local and regional transit.",
        icon: <Car className="w-5 h-5" />,
        href: "/transport",
        features: [
            "Executive vehicle selection",
            "Professional chauffeur service",
            "Regional & intercity transfers",
            "Luxury airport connections"
        ]
    },
    {
        title: "Fine Dining",
        category: "CULINARY",
        description: "Exceptional culinary experiences and professional catering for private events.",
        icon: <Utensils className="w-5 h-5" />,
        href: "/restaurants",
        features: [
            "Priority table reservations",
            "Authentic regional cuisine",
            "Private event catering",
            "Tailored dietary requests"
        ]
    },
    {
        title: "Home Concierge",
        category: "HOSPITALITY",
        description: "Professional maintenance and housekeeping services for an effortless stay.",
        icon: <Home className="w-5 h-5" />,
        href: "/emergency",
        features: [
            "Executive housekeeping",
            "Technical maintenance",
            "Professional errand services",
            "Security & safety protocols"
        ]
    },
    {
        title: "Luxury Homestays",
        category: "ESTATES",
        description: "Refined residential experiences in hand-picked countryside villas and estates.",
        icon: <Hotel className="w-5 h-5" />,
        href: "/hotels",
        features: [
            "Curated estate properties",
            "Breathtaking mountain vistas",
            "Traditional gourmet dining",
            "Family-oriented privacy"
        ]
    }
];

export default function PlanAheadSection() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const cardsPerPage = isMobile ? 1 : 3;
    const totalPages = Math.ceil(services.length / cardsPerPage);

    return (
        <section id="plan-ahead" className="py-12 md:py-16 bg-[#FAFBF9] relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-16">
                
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-12 h-[1px] bg-[#BFA76A]"></div>
                            <span className="text-[#BFA76A] uppercase tracking-[0.4em] text-sm font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Planning
                            </span>
                            <div className="w-12 h-[1px] bg-[#BFA76A]"></div>
                        </div>
                        <h2 
                            className="text-3xl md:text-4xl font-bold text-[#1F3D2B] leading-tight mb-6"
                            style={{ fontFamily: 'var(--font-poppins)' }}
                        >
                            Plan Ahead
                        </h2>
                        <p className="text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto text-[#5F6368]" style={{ fontFamily: 'var(--font-inter)' }}>
                            A curated selection of the finest professional local services for your seamless trip.
                        </p>
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: -(totalPages - 1) * 100 + "%", right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                            if (swipe) {
                                const direction = offset.x > 0 ? -1 : 1;
                                const newPage = Math.max(0, Math.min(totalPages - 1, currentPage + direction));
                                setCurrentPage(newPage);
                            }
                        }}
                        animate={{ x: `-${currentPage * 100}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <div key={pageIndex} className="min-w-full flex gap-6 md:gap-10 items-stretch py-4">
                                {services.slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage).map((service, index) => (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className="flex-1 group bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col border border-[#1F3D2B]/5"
                                    >
                                        <div className="p-8 md:p-10 flex-grow flex flex-col">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#1F3D2B]/5 group-hover:bg-[#1F3D2B]/5 transition-colors duration-500 text-[#1F3D2B]">
                                                    {service.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] tracking-[0.2em] text-[#BFA76A] uppercase font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                        {service.category}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-[#1F3D2B] tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                        {service.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <p className="text-[#5F6368] text-[14px] leading-relaxed mb-8 font-light line-clamp-2" style={{ fontFamily: 'var(--font-inter)' }}>
                                                {service.description}
                                            </p>

                                            <ul className="space-y-4 mb-10 border-l border-[#FAFBF9] pl-6">
                                                {service.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-center gap-3 text-[#5F6368] text-[13px] group/item">
                                                        <Minus className="w-3 h-3 text-[#BFA76A]/40 flex-shrink-0 group-hover/item:text-[#BFA76A] transition-colors" />
                                                        <span style={{ fontFamily: 'var(--font-inter)' }}>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="mt-auto flex justify-end">
                                                <Link
                                                    href={service.href}
                                                    className="inline-flex items-center gap-2 text-[#1F3D2B] text-base font-bold relative group/btn"
                                                >
                                                    <span className="relative z-10" style={{ fontFamily: 'var(--font-poppins)' }}>Explore</span>
                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                                                    <div className="absolute bottom-[-4px] left-0 w-6 h-[2px] bg-[#BFA76A] group-hover/btn:w-full transition-all duration-300"></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-10 md:mt-16 gap-3 md:gap-4">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === i
                                ? 'bg-[#BFA76A] scale-125'
                                : 'bg-[#1F3D2B]/20 hover:bg-[#1F3D2B]/40'
                                }`}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
