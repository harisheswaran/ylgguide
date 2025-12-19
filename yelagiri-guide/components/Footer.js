'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Hotels & Resorts', href: '/hotels', icon: '🏨' },
        { name: 'Tourist Spots', href: '/touristspots', icon: '⛰️' },
        { name: 'Restaurants', href: '/restaurants', icon: '🍽️' },
        { name: 'Map', href: '/map', icon: '🗺️' },
        { name: 'Emergency', href: '/emergency', icon: '🚑' },
    ];

    const features = [
        { name: 'Trip Planner', href: '/trip-planner', icon: '✈️' },
        { name: 'Budget Tracker', href: '/budget-tracker', icon: '💰' },
        { name: 'Favorites', href: '/favorites', icon: '❤️' },
        { name: 'Reviews', href: '/reviews', icon: '⭐' },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: '📘', href: '#' },
        { name: 'Instagram', icon: '📸', href: '#' },
        { name: 'Twitter', icon: '🐦', href: '#' },
        { name: 'YouTube', icon: '📺', href: '#' },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-forest-900 via-slate-800 to-forest-900 text-white overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="mb-6">
                            <Image src="/logo.png" alt="Go Elagiri" width={200} height={70} className="h-14 w-auto" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            Your guide to Yelagiri, your way! Discover, plan, and experience the magic of the hills! ✨
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-xl hover:from-forest-500 hover:to-go-green-400 transition-all shadow-lg"
                                    title={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="text-mint-400">🔗</span> Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-2 text-slate-300 hover:text-mint-400 transition-colors group"
                                    >
                                        <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                                        <span className="text-sm font-medium">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="text-sage-400">⚡</span> Features
                        </h3>
                        <ul className="space-y-3">
                            {features.map((feature) => (
                                <li key={feature.name}>
                                    <Link
                                        href={feature.href}
                                        className="flex items-center gap-2 text-slate-300 hover:text-sage-400 transition-colors group"
                                    >
                                        <span className="text-lg group-hover:scale-110 transition-transform">{feature.icon}</span>
                                        <span className="text-sm font-medium">{feature.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact & Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="text-go-green-400">📞</span> Get in Touch
                        </h3>
                        <div className="space-y-4 mb-6">
                            <a href="mailto:info@yelagiriguide.com" className="flex items-center gap-3 text-slate-300 hover:text-mint-400 transition-colors group">
                                <div className="w-8 h-8 bg-gradient-to-br from-mint-500/20 to-mint-600/20 rounded-lg flex items-center justify-center group-hover:from-mint-500 group-hover:to-mint-600 transition-all">
                                    <span className="text-sm">📧</span>
                                </div>
                                <span className="text-sm">info@yelagiriguide.com</span>
                            </a>
                            <a href="tel:+919876543210" className="flex items-center gap-3 text-slate-300 hover:text-forest-400 transition-colors group">
                                <div className="w-8 h-8 bg-gradient-to-br from-forest-500/20 to-go-green-600/20 rounded-lg flex items-center justify-center group-hover:from-forest-500 group-hover:to-go-green-600 transition-all">
                                    <span className="text-sm">📱</span>
                                </div>
                                <span className="text-sm">+91 98765 43210</span>
                            </a>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30">
                            <p className="text-xs text-slate-300 mb-3 font-medium">Subscribe to our newsletter 📬</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-mint-500 transition-colors"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-forest-600 to-go-green-500 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-forest-500/20 transition-all">
                                    →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-slate-700/50 pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400">
                            © {currentYear} <span className="font-semibold bg-gradient-to-r from-forest-400 to-mint-400 bg-clip-text text-transparent">Go Elagiri</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs text-slate-400">
                            <Link href="/privacy" className="hover:text-mint-400 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-mint-400 transition-colors">Terms of Service</Link>
                            <Link href="/about" className="hover:text-mint-400 transition-colors">About Us</Link>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-forest-500/10 to-mint-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-sage-500/10 to-mint-500/10 rounded-full blur-3xl -z-10"></div>
            </div>
        </footer>
    );
}
