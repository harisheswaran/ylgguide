'use client';

import Link from 'next/link';
import AISearchBar from './ai/AISearchBar';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../app/context/AuthContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ dark = true }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const profileRef = useRef(null);

    // Handle scroll to change navbar style
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isProfileOpen]);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Stays', href: '/hotels' },
        { label: 'Activities', href: '/activities' },
        { label: 'Dining', href: '/restaurants' },
        { label: 'Guide', href: '/map' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/90 backdrop-blur-md shadow-lg'
                        : 'bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="h-20 flex items-center justify-between">
                        {/* Script Logo */}
                        <Link href="/" className="flex items-center shrink-0 group">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`text-3xl font-satisfy transition-colors ${isScrolled ? 'text-forest-700' : 'text-white'
                                    }`}
                                style={{ fontFamily: 'var(--font-satisfy)' }}
                            >
                                Go Yelagiri
                            </motion.span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`relative text-sm font-medium transition-colors whitespace-nowrap group ${isScrolled
                                                ? 'text-slate-600 hover:text-forest-700'
                                                : 'text-white/90 hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full ${isScrolled
                                                ? 'bg-gradient-to-r from-forest-500 to-go-green-400'
                                                : 'bg-white'
                                            }`}></span>
                                    </Link>
                                </motion.div>
                            ))}

                            {/* BOOK TRIP Button */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/trip-planner"
                                    className="inline-block px-6 py-2.5 text-sm font-bold text-white bg-forest-600 hover:bg-forest-700 rounded-lg shadow-lg shadow-forest-500/30 hover:shadow-xl hover:shadow-forest-500/40 transition-all whitespace-nowrap"
                                >
                                    BOOK TRIP
                                </Link>
                            </motion.div>

                            {user && (
                                <div className="relative" ref={profileRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="p-1 rounded-full bg-gradient-to-r from-forest-500 to-go-green-400">
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={36}
                                                height={36}
                                                className="rounded-full border-2 border-white"
                                            />
                                        </div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-64 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl border border-white/50 overflow-hidden"
                                            >
                                                <div className="px-6 py-4 bg-gradient-to-r from-forest-50/50 to-mint-50/50 border-b border-slate-100">
                                                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <span>👤</span> My Profile
                                                    </Link>
                                                    <Link
                                                        href="/favorites"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-all"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <span>❤️</span> Favorites
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all text-left"
                                                    >
                                                        <span>🚪</span> Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 ${isScrolled ? 'text-slate-600' : 'text-white'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </motion.button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden pb-6 overflow-hidden"
                            >
                                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50 space-y-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}

                                    <Link
                                        href="/trip-planner"
                                        className="block px-4 py-3 text-sm font-bold text-white bg-forest-600 rounded-xl text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        BOOK TRIP
                                    </Link>

                                    {user ? (
                                        <div className="pt-4 mt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full ring-2 ring-forest-500"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <Link href="/profile" className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">
                                                My Profile
                                            </Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>
        </>
    );
}

