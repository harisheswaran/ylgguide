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
      href: "/shop",
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

  const heroImages = [
    '/carousel/hero-1.png',
    '/carousel/hero-2.png',
    '/carousel/hero-3.png'
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
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
          {/* Animated Background Layers */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[currentHeroImage]}
                  alt="Yelagiri Landscape"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-10 mix-blend-overlay"></div>
          </div>

          <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-[-5vh]">
            {/* Trip to Nature - Script Font */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hero-script-intro text-[#BFA76A]"
              style={{ fontSize: 'clamp(2rem, 6vw, 56px)', fontFamily: 'var(--font-kaushan)' }}
            >
              Trip to Nature
            </motion.p>

            {/* YELAGIRI - Large Condensed Title with 3D Effect */}
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, type: "spring" }}
              className="hero-big-text relative"
              style={{ fontSize: 'clamp(4rem, 18vw, 220px)', lineHeight: 0.8 }}
            >
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">YELAGIRI</span>
              <span className="absolute left-0 top-0 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)] -z-10 blur-[1px]">YELAGIRI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/90 font-light tracking-wide mb-10 space-y-2 max-w-2xl mx-auto"
            >
              <p className="drop-shadow-lg">Travel is an investment in yourself</p>
            </motion.div>

            {/* PLAN YOUR TRIP - Outline Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center gap-6"
            >
              <motion.a
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                href="/trip-planner"
                className="group relative px-10 md:px-14 py-4 md:py-5 border border-white/40 bg-white/5 backdrop-blur-sm text-white font-semibold tracking-[0.2em] text-sm md:text-base uppercase overflow-hidden"
              >
                <span className="relative z-10">Start Joburney</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-[#1F3D2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300">Start Journey</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.5, repeat: Infinity, duration: 2 }}
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto mb-2"></div>
            <p className="text-[10px] text-white/60 uppercase tracking-[0.3em]">Scroll</p>
          </motion.div>

          {/* Organic Wave Separator */}
          <div className="absolute bottom-[-1px] left-0 w-full z-20 overflow-hidden leading-[0]">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] md:h-[100px] w-[calc(100%+1.3px)] fill-[#FAFBF9]">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>


        {/* Why Yelagiri Section - Enhanced Content */}
        <section className="py-20 md:py-32 bg-[#FAFBF9] bg-pattern-topographic relative">
          <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
              >
                <span className="inline-block px-4 py-1.5 bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 text-[#1F3D2B] text-[10px] font-bold tracking-[0.3em] rounded-full mb-6 uppercase">
                  Discover The Unseen
                </span>
                <h2
                  className="text-3xl md:text-5xl font-bold mb-6 text-[#1F3D2B]"
                  style={{ fontFamily: 'var(--font-poppins)', lineHeight: '1.1' }}
                >
                  Nature&apos;s Best Kept Secret
                </h2>
                <div className="w-20 h-1 bg-[#BFA76A] mx-auto mb-8"></div>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed font-light max-w-3xl mx-auto">
                  Nestled at 1,410 meters in the Eastern Ghats, Yelagiri is an ethereal sanctuary of mist-covered peaks and emerald valleys—the perfect escape for those seeking serenity and soul-stirring landscapes.
                </p>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                  { icon: "🍃", title: "Ethereal Landscapes", desc: "Wander through rolling hills and ancient forests where the clouds touch the earth." },
                  { icon: "✨", title: "Perpetual Spring", desc: "Experience a year-round cool breeze with mild summers and comfortably crisp winters." },
                  { icon: "🏔️", title: "Untouched Trails", desc: "Discover hidden viewpoints and serene lakes far away from the urban chaos." }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ y: -10 }}
                    className="group relative p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-20px_rgba(31,61,43,0.15)] transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform scale-150 group-hover:rotate-12">
                      <span className="text-8xl grayscale">{feature.icon}</span>
                    </div>

                    <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    <h3 className="text-xl font-bold text-[#1F3D2B] mb-3 group-hover:text-[#BFA76A] transition-colors">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Stats - Refined */}
              <div className="glass-premium rounded-[3rem] p-12 md:p-16 border border-white/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#BFA76A] to-transparent opacity-30"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  {[
                    { label: "Curated Stays", value: "50+" },
                    { label: "Hidden Gems", value: "30+" },
                    { label: "Authentic Eats", value: "40+" },
                    { label: "Live Support", value: "24/7" }
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className="text-4xl md:text-5xl font-extrabold text-[#1F3D2B] mb-2 tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-[#8a9a8f] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Yelagiri Section - Luxury Refinement */}
        <section id="explore" className="py-20 md:py-32 bg-white relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1F3D2B]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <span className="text-[#BFA76A] uppercase tracking-[0.4em] text-xs font-bold mb-4 block" style={{ fontFamily: 'var(--font-poppins)' }}>
                  • Exploration •
                </span>
                <h2
                  className="text-4xl md:text-6xl font-bold text-[#1F3D2B] leading-none mb-6"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Curated Experiences
                </h2>
                <p className="text-base leading-relaxed font-light text-[#5F6368] max-w-lg" style={{ fontFamily: 'var(--font-inter)' }}>
                  A collection of the finest experiences, from misty peaks to serene lakes and authentic local flavors, handpicked for you.
                </p>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full border border-[#1F3D2B]/10 flex items-center justify-center hover:bg-[#1F3D2B] hover:text-white transition-all duration-300 group"
                  aria-label="Previous slide"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full border border-[#1F3D2B]/10 flex items-center justify-center hover:bg-[#1F3D2B] hover:text-white transition-all duration-300 group"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-visible">
              <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: -(totalPages - 1) * 100 + "%", right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                  if (swipe) {
                    const direction = offset.x > 0 ? -1 : 1;
                    const newPage = Math.max(0, Math.min(totalPages - 1, currentPage + direction));
                    setCurrentPage(newPage);
                  }
                }}
                animate={{ x: `-${currentPage * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <div key={pageIndex} className="min-w-full flex gap-6 md:gap-8 items-stretch pr-6 md:pr-8">
                    {exploreItems.slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage).map((item, index) => (
                      <motion.div
                        key={item.title}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-1 group bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(31,61,43,0.15)] transition-all duration-500 h-auto flex flex-col border border-[#1F3D2B]/5 relative"
                      >
                        {/* Card Image */}
                        <div className="relative h-[280px] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

                          <div className="absolute top-6 left-6 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                            {item.icon}
                          </div>
                        </div>

                        {/* Card Content overlap */}
                        <div className="p-8 relative mt-[-40px] bg-white mx-6 mb-6 rounded-2xl shadow-sm border border-slate-100 flex-grow flex flex-col z-10">
                          <h3 className="text-xl font-bold text-[#1F3D2B] mb-3 tracking-tight group-hover:text-[#BFA76A] transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {item.title}
                          </h3>

                          <p className="text-[#5F6368] text-[14px] leading-relaxed mb-6 font-light line-clamp-3">
                            {item.description}
                          </p>

                          <div className="mt-auto pt-6 border-t border-dashed border-slate-200">
                            <Link
                              href={item.href}
                              className="inline-flex items-center gap-2 text-[#1F3D2B] text-sm font-bold uppercase tracking-wider group/link hover:text-[#BFA76A] transition-colors"
                            >
                              Explore
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Line */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentPage === i
                      ? 'w-12 bg-[#1F3D2B]'
                      : 'w-2 bg-[#1F3D2B]/20 hover:bg-[#1F3D2B]/40'
                      }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
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
