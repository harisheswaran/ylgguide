'use client';

import Link from 'next/link';
import AISearchBar from './ai/AISearchBar';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ dark = true }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const profileRef = useRef(null);
    const searchRef = useRef(null);

    // Handle scroll to change navbar style
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const [activeSection, setActiveSection] = useState('home');

    const navItems = [
        { label: 'Home', href: '/', id: 'home' },
        { label: 'Explore', href: '/#explore', id: 'explore' },
        { label: 'Services', href: '/#plan-ahead', id: 'plan-ahead' },
        { label: 'Map', href: '/#explore-map', id: 'explore-map' },
        { label: 'Events', href: '/#events', id: 'events' },
    ];

    // Track active section on scroll
    useEffect(() => {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        const sections = ['explore', 'plan-ahead', 'explore-map', 'events'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Special case for home (top of page)
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('home');
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1920px] mx-auto px-4 md:px-12">
                    <div className={`flex items-center justify-between transition-all duration-300 ${(isScrolled || !isHome) ? 'h-14' : 'h-16 md:h-20'}`}>
                        {/* Script Logo */}
                        <Link href="/" className="flex items-center shrink-0 group ml-2">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`text-[24px] md:text-[32px] transition-colors ${(isScrolled || !isHome) ? 'text-forest-700' : 'text-white'
                                    }`}
                                style={{ fontFamily: 'var(--font-kaushan)' }}
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
                                        className={`relative text-[15px] md:text-[17px] font-bold transition-colors whitespace-nowrap group ${(isScrolled || !isHome)
                                            ? activeSection === item.id ? 'text-forest-700' : 'text-slate-600 hover:text-forest-700'
                                            : activeSection === item.id ? 'text-white' : 'text-white/80 hover:text-white'
                                            }`}
                                    >
                                        {item.label}
                                        <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 rounded-full ${(isScrolled || !isHome)
                                            ? 'bg-gradient-to-r from-forest-500 to-go-green-400'
                                            : 'bg-white'
                                            } ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </Link>
                                </motion.div>
                            ))}

                            {/* AI Search Icon */}
                            <div className="relative" ref={searchRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isScrolled || !isHome
                                        ? 'text-slate-600 bg-slate-100/80 hover:bg-slate-200'
                                        : 'text-white bg-white/10 hover:bg-white/20'
                                        }`}
                                    aria-label="Search"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </motion.button>

                                <AnimatePresence>
                                    {isSearchOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-4 w-[380px] z-[60]"
                                        >
                                            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 p-3">
                                                <AISearchBar dark={false} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Auth Section */}
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="p-0.5 rounded-full bg-[#BFA76A]">
                                            <Image
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`}
                                                alt={user.name}
                                                width={28}
                                                height={28}
                                                className="rounded-full border border-white"
                                            />
                                        </div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 py-2"
                                            >
                                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                                                </div>
                                                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </Link>
                                                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/signin"
                                        className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-xl transition-all border shadow-sm ${isScrolled || !isHome
                                            ? 'text-[#1F3D2B] border-[#BFA76A] hover:bg-[#BFA76A]/5'
                                            : 'text-white border-white/40 hover:bg-white/10'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Sign In
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 ${isScrolled || !isHome ? 'text-slate-600' : 'text-white'}`}
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
                                    {/* Mobile Search */}
                                    <div className="px-2 pb-3 border-b border-slate-100">
                                        <AISearchBar dark={false} />
                                    </div>

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

                                    {user ? (
                                        <div className="pt-4 mt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                                <Image
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`}
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
                                            <Link href="/profile" className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>
                                                My Profile
                                            </Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl">
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/signin"
                                            className="block px-4 py-3 text-sm font-bold text-white bg-forest-600 rounded-xl text-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In / Sign Up
                                        </Link>
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
