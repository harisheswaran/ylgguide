'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Footer from '@/components/Footer';
import AppleSection from '@/components/AppleSection';
import EventsSection from '@/components/features/EventsSection';
import DynamicInfoSection from '@/components/features/DynamicInfoSection';
import ExploreMapSection from '@/components/features/ExploreMapSection';
import PlanAheadSection from '@/components/features/PlanAheadSection';
import FamousFinds from '@/components/features/FamousFinds';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Hotel,
  Mountain,
  Utensils,
  Tent,
  ShoppingBag,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const exploreItems = [
    {
      title: "Hotels & Resorts",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      description: "Experience premium hospitality in Yelagiri with a curated selection of luxury resorts and comfortable hotels that offer stunning hill views.",
      href: "/hotels",
      icon: <Hotel className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    },
    {
      title: "Tourist Spots",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      description: "Discover the natural beauty of the Eastern Ghats, from serene lakes to breathtaking viewpoints that capture the essence of this misty hill station.",
      href: "/spots",
      icon: <Mountain className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    },
    {
      title: "Restaurants",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      description: "Indulge in authentic local flavors and multi-cuisine dining options with a view of the rolling hills and lush greenery.",
      href: "/restaurants",
      icon: <Utensils className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    },
    {
      title: "Adventure Activities",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
      description: "Pulse-pounding adventures await, including paragliding, rock climbing, and guided treks through the beautiful forest trails.",
      href: "/trekking-guides",
      icon: <Tent className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    },
    {
      title: "Shopping",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      description: "Take a piece of Yelagiri home with you. Explore local markets for fresh forest honey, jackfruit, and hill station specialties.",
      href: "/shopping",
      icon: <ShoppingBag className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    },
    {
      title: "Emergency",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      description: "Stay safe with quick access to 24/7 medical facilities, local law enforcement, and critical emergency services for a worry-free experience.",
      href: "/emergency",
      icon: <PhoneCall className="w-5 h-5 text-[#1F3D2B]" strokeWidth={1.5} />
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(exploreItems.length / cardsPerPage);

  const nextSlide = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50/60 via-white to-mint-50/40 font-sans selection:bg-go-green-100 selection:text-forest-900">
      <Navbar dark={false} />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Misty Forest Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hills yelagiri.avif"
              alt="Misty forest background"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Trip to Nature - Script Font */}
            <p className="hero-script-intro" style={{ fontSize: 'clamp(1.5rem, 5vw, 40px)' }}>
              Trip to Nature
            </p>

            {/* YELAGIRI - Large Condensed Title with 3D Effect */}
            <h1 className="hero-big-text" style={{ fontSize: 'clamp(3.5rem, 15vw, 192px)' }}>
              YELAGIRI
            </h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-base md:text-xl text-white/90 font-light tracking-wide mb-8 space-y-2 mt-4 md:mt-12"
            >
              <p>Travel is an investment in yourself</p>
              <p className="hidden md:block">Discover serene stays, thrilling adventures, and hidden trails.</p>
            </motion.div>

            {/* PLAN YOUR TRIP - Outline Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 md:mt-10"
            >
              <motion.a
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                href="/trip-planner"
                className="inline-block px-8 md:px-12 py-4 md:py-5 border-2 border-white text-white font-semibold tracking-widest text-sm md:text-base uppercase transition-all duration-300 hover:shadow-lg"
              >
                BOOK YOUR TRIP
              </motion.a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>


        {/* Why Yelagiri Section - Enhanced Content */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-forest-50/30">
          <div className="container mx-auto px-6 md:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="inline-block px-5 py-2 bg-forest-100 text-forest-700 text-[11px] font-bold tracking-[0.2em] rounded-full mb-6 uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>
                  A Journey Awaits
                </span>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-4 text-[#1F3D2B]"
                  style={{ lineHeight: '1.2', fontFamily: 'var(--font-poppins)' }}
                >
                  Nature&apos;s Best Kept Secret
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
                  Nestled at 1,410 meters in the Eastern Ghats, Yelagiri is an ethereal sanctuary of mist-covered peaks and emerald valleys—the perfect escape for those seeking serenity and soul-stirring landscapes.
                </p>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                  { icon: "🍃", title: "Ethereal Landscapes", desc: "Wander through rolling hills and ancient forests where the clouds touch the earth." },
                  { icon: "✨", title: "Perpetual Spring", desc: "Experience a year-round cool breeze with mild summers and comfortably crisp winters." },
                  { icon: "🏔️", title: "Untouched Trails", desc: "Discover hidden viewpoints and serene lakes far away from the urban chaos." }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] transition-all duration-300"
                  >
                    <span className="text-3xl mb-4 block transform group-hover:scale-110 transition-transform">{feature.icon}</span>
                    <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Stats - Refined */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-10 px-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/50 shadow-inner">
                {[
                  { label: "Curated Stays", value: "50+" },
                  { label: "Hidden Gems", value: "30+" },
                  { label: "Authentic Eats", value: "40+" },
                  { label: "Live Support", value: "24/7" }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-2xl md:text-3xl font-extrabold text-[#1F3D2B] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[#BFA76A] font-bold tracking-[0.15em] uppercase text-[9px] md:text-[10px]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Yelagiri Section - Luxury Refinement */}
        <section id="explore" className="py-12 md:py-16 bg-[#FAFBF9] relative scroll-mt-20 overflow-hidden">
          <div className="container mx-auto px-6 md:px-8 lg:px-16">
            {/* Header */}
            <div className="text-center mb-12 md:mb-24 space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-[#BFA76A]"></div>
                  <span className="text-[#BFA76A] uppercase tracking-[0.4em] text-sm font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>Discovery</span>
                  <div className="w-12 h-[1px] bg-[#BFA76A]"></div>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#1F3D2B] leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Explore Yelagiri
                </h2>
                <p className="text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto text-[#5F6368]" style={{ fontFamily: 'var(--font-inter)' }}>
                  A curated collection of the finest experiences, from misty peaks to serene lakes and authentic local flavors.
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
                  <div key={pageIndex} className="min-w-full flex gap-6 md:gap-10 items-stretch">
                    {exploreItems.slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage).map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.15 }}
                        whileHover={{ y: -10 }}
                        className="flex-1 group bg-white rounded-3xl overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.12)] transition-all duration-500 h-auto flex flex-col border border-[#1F3D2B]/5"
                      >
                        {/* Image Container */}
                        <div className="relative h-[180px] md:h-[220px] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-[1.05] transition-transform duration-1000 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40"></div>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10 flex-grow flex flex-col">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#1F3D2B]/5 group-hover:bg-[#1F3D2B]/5 transition-colors duration-500">
                              {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1F3D2B] tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {item.title}
                            </h3>
                          </div>

                          <p className="text-[#5F6368] text-[15px] leading-relaxed mb-10 font-light line-clamp-3" style={{ fontFamily: 'var(--font-inter)' }}>
                            {item.description}
                          </p>

                          <div className="mt-auto flex justify-end">
                            <Link
                              href={item.href}
                              className="inline-flex items-center gap-2 text-[#1F3D2B] text-base font-bold relative group/btn"
                            >
                              <span className="relative z-10">Explore</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                              <div className="absolute bottom-[-4px] left-0 w-8 h-[2px] bg-[#BFA76A] group-hover/btn:w-full transition-all duration-300"></div>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots - Circle Carousel */}
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

        <DynamicInfoSection />

        <PlanAheadSection />

        <ExploreMapSection />

        <FamousFinds />

        <EventsSection />
      </main>

      <Footer dark={false} />
    </div >
  );
}
