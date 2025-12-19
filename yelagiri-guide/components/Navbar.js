'use client';

import Link from 'next/link';
import AISearchBar from './ai/AISearchBar';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../app/context/AuthContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ dark = false }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const profileRef = useRef(null);

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

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${dark
                    ? 'bg-black/40 border-white/10 text-white'
                    : 'bg-white/40 border-white/20 text-slate-800'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="h-20 flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center shrink-0 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="transition-transform bg-white px-3 py-2 rounded-lg shadow-sm"
                            >
                                <Image src="/logo.png" alt="Go Elagiri" width={180} height={60} className="h-12 w-auto" priority />
                            </motion.div>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {['Hotels', 'Tourist Spots', 'Map', 'Emergency'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <Link
                                        href={`/${item.toLowerCase().replace(' ', '')}`}
                                        className="relative text-sm font-semibold text-slate-600 hover:text-forest-700 transition-colors whitespace-nowrap group"
                                    >
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-forest-500 to-go-green-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="w-72">
                                <AISearchBar />
                            </div>

                            {user ? (
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
                                                width={40}
                                                height={40}
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
                            ) : (
                                <div className="flex items-center gap-4 shrink-0">
                                    <Link href="/signin" className="text-sm font-semibold text-slate-600 hover:text-forest-700 transition-colors whitespace-nowrap">
                                        Sign In
                                    </Link>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href="/signup" className="inline-block px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-forest-600 to-go-green-500 rounded-full shadow-lg shadow-forest-500/30 hover:shadow-xl hover:shadow-forest-500/40 transition-all whitespace-nowrap">
                                            Sign Up
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-600"
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
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50 space-y-2">
                                    {['Hotels', 'Tourist Spots', 'Map', 'Emergency'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/${item.toLowerCase().replace(' ', '')}`}
                                            className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-all"
                                        >
                                            {item}
                                        </Link>
                                    ))}

                                    {user ? (
                                        <div className="pt-4 mt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    width={64}
                                                    height={64}
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
                                    ) : (
                                        <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                            <Link href="/signin" className="flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl">
                                                Sign In
                                            </Link>
                                            <Link href="/signup" className="flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-forest-600 to-go-green-500 rounded-xl shadow-lg shadow-forest-500/20">
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>
        </>
    );
}
