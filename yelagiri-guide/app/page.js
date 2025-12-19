'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppleSection from '@/components/AppleSection';
import WeatherWidget from '@/components/features/WeatherWidget';
import RecommendedSection from '@/components/features/RecommendedSection';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const categories = [
    {
      title: "Hotels & Resorts",
      icon: "🏨",
      href: "/hotels",
      description: "Find the best places to stay in Yelagiri.",
      className: "md:col-span-2 md:row-span-2",
      gradient: "from-forest-500/10 to-go-green-400/10",
      border: "group-hover:border-forest-200"
    },
    {
      title: "Tourist Spots",
      icon: "⛰️",
      href: "/spots",
      description: "Explore beautiful attractions.",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-go-green-400/10 to-mint-400/10",
      border: "group-hover:border-go-green-200"
    },
    {
      title: "Restaurants",
      icon: "🍽️",
      href: "/restaurants",
      description: "Discover local cuisine.",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-earth-500/10 to-amber-500/10",
      border: "group-hover:border-earth-200"
    },
    {
      title: "Emergency",
      icon: "🚑",
      href: "/emergency",
      description: "Help centers.",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-red-500/10 to-rose-500/10",
      border: "group-hover:border-red-200"
    },
    {
      title: "Activities",
      icon: "🚣",
      href: "/activities",
      description: "Adventure sports.",
      className: "md:col-span-1 md:row-span-1",
      gradient: "from-mint-500/10 to-go-green-400/10",
      border: "group-hover:border-mint-200"
    },
    {
      title: "Shopping",
      icon: "🛍️",
      href: "/shopping",
      description: "Local markets.",
      className: "md:col-span-2 md:row-span-1",
      gradient: "from-sage-500/10 to-mint-400/10",
      border: "group-hover:border-sage-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50/60 via-white to-mint-50/40 font-sans selection:bg-go-green-100 selection:text-forest-900">
      <Navbar dark={false} />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Greenery Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/greenery-bg.png"
              alt="Lush greenery background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
          </div>

          {/* Animated Overlay */}
          <motion.div
            className="absolute inset-0 z-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, #6ee7b7 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, #84cc16 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, #10b981 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, #10b981 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-forest-300/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-300/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 text-forest-800 text-sm font-bold shadow-sm flex items-center gap-2">
                <span className="animate-pulse">✨</span> Discover the Jewel of the South
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-slate-800"
            >
              <span className="bg-gradient-to-r from-white to-mint-100 bg-clip-text text-transparent drop-shadow-lg">Yelagiri</span> <span className="text-white drop-shadow-lg">Hills.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-2xl md:text-3xl text-white font-medium tracking-wide mb-12 drop-shadow-lg"
            >
              Nature. Adventure. Serenity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#explore"
                className="px-8 py-4 bg-gradient-to-r from-forest-600 to-go-green-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-forest-500/30 transition-all text-lg"
              >
                Explore Guide
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-lg shadow-sm"
              >
                Join Community
              </motion.a>
            </motion.div>
          </div>

          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden xl:block z-20">
            <WeatherWidget />
          </div>

          <div className="xl:hidden mt-12 relative z-20">
            <WeatherWidget />
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-8 h-8 text-forest-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-forest-600 to-go-green-500 bg-clip-text text-transparent"
            >
              Beyond the ordinary.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light"
            >
              Experience a hill station that feels like a world away. With pleasant weather year-round, Yelagiri offers the perfect escape for those seeking peace or adventure.
            </motion.p>
          </div>
        </section>

        {/* Bento Grid Categories */}
        <section id="explore" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-slate-800"
              >
                Everything you need.
              </motion.h2>
              <p className="text-xl text-slate-500">Curated experiences for every traveler.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${category.className || ''} ${category.border}`}
                >
                  <a href={category.href} className="block h-full p-8 flex flex-col justify-between min-h-[240px]">
                    <div className="relative z-10">
                      <span className="text-5xl mb-6 block transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{category.icon}</span>
                      <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-forest-700 transition-colors">{category.title}</h3>
                      <p className="text-slate-500 group-hover:text-slate-600 transition-colors">{category.description}</p>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-forest-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Minimalist */}
        <section className="py-32 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Hotels", value: "50+" },
                { label: "Spots", value: "30+" },
                { label: "Restaurants", value: "40+" },
                { label: "Support", value: "24/7" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-forest-600 to-go-green-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 font-bold tracking-wide uppercase text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-go-green-400" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          ></motion.div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
                Your journey starts here.
              </h2>
              <p className="text-xl text-go-green-50 mb-12 font-light">
                Join thousands of travelers who have discovered the magic of Yelagiri.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
                className="inline-block px-12 py-5 bg-white text-forest-700 font-bold rounded-full text-lg hover:shadow-xl transition-all duration-300 shadow-lg"
              >
                Get Started
              </motion.a>
            </motion.div>
          </div>
        </section>

        <RecommendedSection />
      </main>

      <Footer dark={false} />
    </div>
  );
}
