'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
    Star, 
    Clock, 
    CheckCircle2, 
    ShieldCheck, 
    ChevronRight, 
    User, 
    Heart, 
    Users, 
    Trophy,
    CreditCard,
    Mail,
    X,
    Calendar,
    Phone,
    Smartphone,
    Building2,
    MessageSquare,
    Plus,
    ThumbsUp,
    Search,
    SlidersHorizontal,
    Filter,
    ArrowUpDown,
    Gem,
    Map,
    Mountain,
    Plane,
    Sparkles
} from 'lucide-react';
import Image from 'next/image';



// Trip Packages Component 
export default function TripPackages() {
    const router = useRouter();
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const showFavoritesOnly = searchParams.get('filter') === 'favorites';

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [bookingStep, setBookingStep] = useState('none'); // none, reviews, form, payment, success
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', user: '' });
    
    // Missing States for Payment Logic
    const [isEmailSending, setIsEmailSending] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/packages`);
                const json = await res.json();
                if (json.success) {
                    setPackages(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch packages:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    // Favorites State
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('ylg_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const toggleFavorite = (pkgId) => {
        let newFavorites;
        if (favorites.includes(pkgId)) {
            newFavorites = favorites.filter(id => id !== pkgId);
        } else {
            newFavorites = [...favorites, pkgId];
        }
        setFavorites(newFavorites);
        localStorage.setItem('ylg_favorites', JSON.stringify(newFavorites));
    };

    // Filter States
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [durationFilter, setDurationFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Recommended');
    // New Sidebar Filter States
    const [priceRange, setPriceRange] = useState(30000); // Max default
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    // Derived Data
    const filteredPackages = packages
        .filter(pkg => {
            // 1. Category Filter
            const matchesCategory = categoryFilter === 'All' || 
                                  pkg.type.toLowerCase().includes(categoryFilter.toLowerCase()) ||
                                  pkg.title.toLowerCase().includes(categoryFilter.toLowerCase());
            
            // 2. Duration Filter
            const matchesDuration = durationFilter === 'All' || 
                                  pkg.duration.includes(durationFilter);

            // 3. Price Filter
            const pkgPrice = parseInt(pkg.price.replace(/[^0-9]/g, ''));
            const matchesPrice = pkgPrice <= priceRange;

            // 4. Stars Filter
            const matchesStars = selectedStars.length === 0 || selectedStars.includes(pkg.stars);

            // 5. Amenities Filter
            const matchesAmenities = selectedAmenities.length === 0 || 
                                   selectedAmenities.every(amenity => pkg.amenities?.includes(amenity));
            
            // 6. Rating Filter
            const matchesRating = selectedRatings.length === 0 || selectedRatings.some(criteria => {
                 if (criteria === '9+') return pkg.rating >= 4.5;
                 if (criteria === '8+') return pkg.rating >= 4.0;
                 if (criteria === '7+') return pkg.rating >= 3.5;
                 return true;
            });

            // 7. Location Filter
            const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(pkg.locationName);

            // 8. Favorites Filter (from URL)
            const matchesFavorite = !showFavoritesOnly || favorites.includes(pkg.id);

            return matchesCategory && matchesDuration && matchesPrice && matchesStars && matchesAmenities && matchesRating && matchesLocation && matchesFavorite;
        })
        .sort((a, b) => {
            if (sortBy === 'Price: Low to High') {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                return priceA - priceB;
            }
            if (sortBy === 'Price: High to Low') {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                return priceB - priceA;
            }
            if (sortBy === 'Highest Rated') {
                return b.rating - a.rating;
            }
            return 0; // Recommended / Default
        });

    const categories = [
        { name: 'All', icon: <Map className="w-3.5 h-3.5" /> },
        { name: 'Luxury', icon: <Gem className="w-3.5 h-3.5" /> },
        { name: 'Adventure', icon: <Mountain className="w-3.5 h-3.5" /> },
        { name: 'Family', icon: <Users className="w-3.5 h-3.5" /> },
        { name: 'Couple', icon: <Heart className="w-3.5 h-3.5" /> },
        { name: 'Friends', icon: <Sparkles className="w-3.5 h-3.5" /> }
    ];
    // Expanded Filters Data
    const starOptions = [3, 4, 5];
    const amenityOptions = ['Wifi', 'Pool', 'Spa', 'Parking', 'Gym', 'Restaurant', 'Bar'];
    const ratingOptions = [
        { label: '9+ Wonderful', value: '9+' },
        { label: '8+ Very Good', value: '8+' },
        { label: '7+ Good', value: '7+' }
    ];
    const locationOptions = [
        { name: 'Athanavur', icon: '🏪' },
        { name: 'Nilavur', icon: '🏡' },
        { name: 'Swamimalai', icon: '🏔️' },
        { name: 'Punganoor', icon: '⛵' },
        { name: 'Mangalam', icon: '🌲' }
    ];

    const handleBookNow = (pkg) => {
        if (!user) {
            router.push(`/signin?redirect=/trip-packages`);
            return;
        }
        // Navigate to the new booking page with package info
        const params = new URLSearchParams({
            id: pkg.id,
            title: pkg.title,
            price: pkg.price.replace(/[^0-9]/g, ''), // Extract number
            description: pkg.duration + ' - ' + pkg.type
        });
        router.push(`/booking?${params.toString()}`);
    };

    const handleViewReviews = (pkg) => {
        if (!user) {
            router.push(`/signin?redirect=/trip-packages`);
            return;
        }
        setSelectedPackage(pkg);
        setBookingStep('reviews');
    };

    const handleViewDetails = (pkg) => {
        if (!user) {
            router.push(`/signin?redirect=/trip-packages`);
            return;
        }
        setSelectedPackage(pkg);
        setBookingStep('details');
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setBookingStep('payment');
        
        // Simulate payment processing then send email
        setTimeout(async () => {
            setBookingStep('processing');
            setIsEmailSending(true);
            
            // Generate booking ID
            const bookingId = `YLG-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // Send email
            try {
                const response = await fetch('/api/send-booking-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name,
                        phone,
                        packageTitle: selectedPackage?.title,
                        packagePrice: selectedPackage?.price,
                        fromDate,
                        toDate,
                        bookingId
                    })
                });
                
                const data = await response.json();
                console.log('Email sent:', data);
            } catch (error) {
                console.error('Email sending failed:', error);
            } finally {
                setIsEmailSending(false);
                setTimeout(() => setBookingStep('success'), 1000);
            }
        }, 2500);
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push(`/signin?redirect=/trip-packages`);
            return;
        }
        if (!newReview.comment || !newReview.user) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: selectedPackage.id,
                    user: newReview.user,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            const data = await response.json();
            
            // Even if API fails (e.g. mock mode without real DB), update local state for the user
            const updatedPackages = packages.map(pkg => {
                if (pkg.id === selectedPackage.id) {
                    return {
                        ...pkg,
                        reviewsCount: (pkg.reviewsCount || 0) + 1,
                        reviews: [{
                            ...newReview,
                            date: new Date().toISOString().split('T')[0]
                        }, ...(pkg.reviews || [])]
                    };
                }
                return pkg;
            });
            setPackages(updatedPackages);
            setSelectedPackage(updatedPackages.find(p => p.id === selectedPackage.id));
            setNewReview({ rating: 5, comment: '', user: '' });
            
            // Show success message or just keep modal open to see the new review
        } catch (error) {
            console.error('Failed to add review:', error);
            // Fallback to local state update anyway for UX in mock mode
            const updatedPackages = packages.map(pkg => {
                if (pkg.id === selectedPackage.id) {
                    return {
                        ...pkg,
                        reviewsCount: (pkg.reviewsCount || 0) + 1,
                        reviews: [{
                            ...newReview,
                            date: new Date().toISOString().split('T')[0]
                        }, ...(pkg.reviews || [])]
                    };
                }
                return pkg;
            });
            setPackages(updatedPackages);
            setSelectedPackage(updatedPackages.find(p => p.id === selectedPackage.id));
            setNewReview({ rating: 5, comment: '', user: '' });
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBF9] font-sans">
            <Navbar dark={true} />

            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/green-hills.png"
                    alt="Lush Green Yelagiri Hills"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent"></div>
                <div className="relative z-10 text-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    >
                        <ShieldCheck className="w-4 h-4 text-[#BFA76A]" />
                        <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Certified Experiences</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-8xl font-bold mb-6 drop-shadow-2xl"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        Trip Packages
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90 drop-shadow-md"
                    >
                        Discover the emerald heart of Yelagiri with our curated travel collections.
                    </motion.p>
                </div>
                
                {/* Scroll hint */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
                >
                    <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/40 to-white/0 mx-auto" />
                </motion.div>
            </section>

            {/* Main Content Area */}
            <section className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* LEFT SIDEBAR FILTERS */}
                    <div className="w-full lg:w-1/4 flex-shrink-0 space-y-10">
                        {/* Price Filter */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[#1F3D2B]">Price</h3>
                                <span className="text-sm font-medium text-[#BFA76A]">₹{priceRange.toLocaleString()}</span>
                            </div>
                            <input 
                                type="range" 
                                min="5000" 
                                max="50000" 
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1F3D2B]"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-bold">
                                <span>₹5k</span>
                                <span>₹50k</span>
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Rating</h3>
                            <div className="space-y-3">
                                {ratingOptions.map((option) => (
                                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedRatings.includes(option.value) ? 'border-[#BFA76A] bg-[#BFA76A]' : 'border-gray-300 group-hover:border-[#BFA76A]'}`}>
                                            {selectedRatings.includes(option.value) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={selectedRatings.includes(option.value)}
                                            onChange={() => {
                                                if(selectedRatings.includes(option.value)) {
                                                    setSelectedRatings(selectedRatings.filter(r => r !== option.value));
                                                } else {
                                                    setSelectedRatings([...selectedRatings, option.value]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium group-hover:text-[#1F3D2B] transition-colors">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Location</h3>
                            <div className="space-y-3">
                                {locationOptions.map((loc) => (
                                    <label key={loc.name} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedLocations.includes(loc.name) ? 'border-[#1F3D2B] bg-[#1F3D2B]' : 'border-gray-300 group-hover:border-[#1F3D2B]'}`}>
                                            {selectedLocations.includes(loc.name) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={selectedLocations.includes(loc.name)}
                                            onChange={() => {
                                                if(selectedLocations.includes(loc.name)) {
                                                    setSelectedLocations(selectedLocations.filter(l => l !== loc.name));
                                                } else {
                                                    setSelectedLocations([...selectedLocations, loc.name]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium group-hover:text-[#1F3D2B] transition-colors flex items-center gap-2">
                                            <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{loc.icon}</span>
                                            {loc.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Type of Stay (Categories) */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Type of stay</h3>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                                         <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${categoryFilter === cat.name ? 'border-[#1F3D2B] bg-[#1F3D2B]' : 'border-gray-300 group-hover:border-[#1F3D2B]'}`}>
                                            {categoryFilter === cat.name && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="category"
                                            className="hidden"
                                            checked={categoryFilter === cat.name}
                                            onChange={() => setCategoryFilter(cat.name)}
                                        />
                                        <span className={`text-sm font-medium transition-colors ${categoryFilter === cat.name ? 'text-[#1F3D2B]' : 'text-gray-600 group-hover:text-[#1F3D2B]'}`}>
                                            {cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Services (Amenities) */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Services</h3>
                            <div className="space-y-3">
                                {amenityOptions.map((amenity) => (
                                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(amenity) ? 'border-[#1F3D2B] bg-[#1F3D2B]' : 'border-gray-300 group-hover:border-[#1F3D2B]'}`}>
                                            {selectedAmenities.includes(amenity) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={() => {
                                                if(selectedAmenities.includes(amenity)) {
                                                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                                } else {
                                                    setSelectedAmenities([...selectedAmenities, amenity]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium group-hover:text-[#1F3D2B] transition-colors">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                         {/* Stars */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Stars</h3>
                            <div className="flex gap-2">
                                {starOptions.map((star) => (
                                    <button 
                                        key={star}
                                        onClick={() => {
                                            if(selectedStars.includes(star)) {
                                                setSelectedStars(selectedStars.filter(s => s !== star));
                                            } else {
                                                setSelectedStars([...selectedStars, star]);
                                            }
                                        }}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${
                                            selectedStars.includes(star) 
                                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#BFA76A]'
                                        }`}
                                    >
                                        {star}★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reset Filters Button */}
                        <button 
                            onClick={() => {
                                setCategoryFilter('All');
                                setPriceRange(50000); // Reset to max default
                                setSelectedStars([]);
                                setSelectedAmenities([]);
                                setSelectedRatings([]);
                                setSelectedLocations([]);
                            }}
                            className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 border border-transparent transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Filters
                        </button>
                    </div>

                    {/* RIGHT CONTENT GRID */}
                    <div className="flex-1">
                        
                        {/* Favorites Mode Banner */}
                        {showFavoritesOnly && (
                            <div className="mb-8 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#1F3D2B]">Your Favorites</h2>
                                        <p className="text-sm text-gray-500">Viewing only your saved collections</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => router.push('/trip-packages')}
                                    className="px-5 py-2.5 bg-white text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 border border-gray-100 transition-colors"
                                >
                                    Show All
                                </button>
                            </div>
                        )}

                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-gray-100 gap-4">
                             <div>
                                <h2 className="text-2xl font-bold text-[#1F3D2B] mb-1">Properties found</h2>
                                <p className="text-sm text-gray-400 font-medium">{filteredPackages.length} collections match your search</p>
                             </div>

                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort By:</span>
                                <div className="relative group">
                                     <button className="flex items-center gap-2 text-sm font-bold text-[#1F3D2B] hover:text-[#BFA76A] transition-colors">
                                        {sortBy} <ChevronRight className="w-4 h-4 rotate-90" />
                                     </button>
                                     <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50">
                                        {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'].map(opt => (
                                            <button 
                                                key={opt}
                                                onClick={() => setSortBy(opt)}
                                                className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 ${sortBy === opt ? 'text-[#BFA76A]' : 'text-gray-600'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                     </div>
                                </div>
                             </div>
                        </div>

                         {/* Packages Grid */}
                        {filteredPackages.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">No matches found</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">Try adjusting your filters or price range to find what you&apos;re looking for.</p>
                                <button 
                                    onClick={() => {
                                        setCategoryFilter('All');
                                        setPriceRange(50000);
                                setSelectedStars([]);
                                        setSelectedAmenities([]);
                                        setSelectedRatings([]);
                                        setSelectedLocations([]);
                                    }}
                                    className="px-8 py-3 bg-[#1F3D2B] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#2a523a] transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8"> 
                                {/* Changed to Single Column List View or Keep Grid? Design shows List View blocks. Let's stick to Grid or List provided. Design image shows List View with Image on Left. I will keep Grid for now but maybe Stacked Cards for 'List View' feel? The user said "Test if it works". I'll keep the Card design but maybe make it stacked if needed. For now preserving the Grid but with 2 columns it fits nicely. */}
                                
                                <AnimatePresence mode='popLayout'>
                                    {filteredPackages.map((pkg) => (
                                        <motion.div
                                            layout
                                            key={pkg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group bg-white rounded-[2rem] p-4 border border-gray-100 hover:border-[#BFA76A]/30 hover:shadow-2xl hover:shadow-[#BFA76A]/10 transition-all duration-500 flex flex-col md:flex-row gap-6 items-stretch"
                                        >
                                            {/* Image Section */}
                                            <div className="w-full md:w-72 h-64 md:h-auto relative rounded-[1.5rem] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={pkg.image}
                                                    alt={pkg.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1F3D2B]">
                                                    {pkg.type}
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 flex flex-col justify-center py-2">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                            {pkg.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex gap-0.5">
                                                                {[...Array(pkg.stars)].map((_, i) => (
                                                                    <Star key={i} className="w-3.5 h-3.5 fill-[#BFA76A] text-[#BFA76A]" />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-slate-400 font-medium">• {pkg.duration}</span>
                                                            <span className="text-xs text-[#BFA76A] font-bold px-2 py-0.5 bg-amber-50 rounded ml-2 flex items-center gap-1">
                                                                <Map className="w-3 h-3" /> {pkg.locationName || 'Yelagiri'}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleViewReviews(pkg)}
                                                                className="text-xs text-[#BFA76A] font-bold hover:underline flex items-center gap-1 ml-2"
                                                            >
                                                                <MessageSquare className="w-3 h-3" /> {pkg.reviewsCount} Reviews
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* Favorite Button */}
                                                    <button 
                                                        onClick={() => toggleFavorite(pkg.id)}
                                                        className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${favorites.includes(pkg.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-500'}`}
                                                    >
                                                        <Heart className={`w-5 h-5 ${favorites.includes(pkg.id) ? 'fill-current' : ''}`} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-3 mb-6">
                                                     {pkg.amenities?.slice(0, 4).map((am, i) => (
                                                         <span key={i} className="px-3 py-1 rounded-lg bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100">
                                                            {am}
                                                         </span>
                                                     ))}
                                                     {pkg.amenities?.length > 4 && (
                                                         <span className="px-3 py-1 rounded-lg bg-gray-50 text-xs font-medium text-[#BFA76A]">
                                                            +{pkg.amenities.length - 4} More
                                                         </span>
                                                     )}
                                                </div>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Price per couple</span>
                                                        <span className="text-2xl font-bold text-[#1F3D2B]">{pkg.price}</span>
                                                    </div>
                                                    
                                                    <div className="flex gap-3">
                                                         <button 
                                                            onClick={() => handleViewDetails(pkg)}
                                                            className="px-6 py-3 border border-[#1F3D2B]/10 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-colors"
                                                         >
                                                            More Details
                                                         </button>
                                                         <button 
                                                            onClick={() => handleBookNow(pkg)}
                                                            className="px-6 py-3 bg-[#BFA76A] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#a68d52] shadow-lg shadow-[#BFA76A]/20 transition-all"
                                                         >
                                                            Book Now
                                                         </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modals Container */}
            <AnimatePresence>
                {bookingStep !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setBookingStep('none')}></div>
                        
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-20 overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setBookingStep('none')}
                                className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 transition-colors z-30 bg-white/80"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>

                            {/* Modal Content Scrollable Area */}
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                
                                {/* 0. DETAILS MODAL */}
                                {bookingStep === 'details' && (
                                    <div className="p-0">
                                        {/* Header Image */}
                                        <div className="relative h-64 md:h-80 w-full">
                                            <Image 
                                                src={selectedPackage.image} 
                                                alt={selectedPackage.title} 
                                                fill 
                                                className="object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 md:left-10 text-white">
                                                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                                                    {selectedPackage.icon} {selectedPackage.type}
                                                </div>
                                                <h2 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {selectedPackage.title}
                                                </h2>
                                                <div className="flex items-center gap-3 text-sm font-medium">
                                                    <span className="flex items-center gap-1 text-yellow-400">
                                                        <Star className="w-4 h-4 fill-current" /> {selectedPackage.rating} ({selectedPackage.reviewsCount} reviews)
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" /> {selectedPackage.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 md:p-10 space-y-8">
                                            {/* Description */}
                                            <div>
                                                <h3 className="text-lg font-bold text-[#1F3D2B] mb-3">About this Collection</h3>
                                                <p className="text-gray-600 leading-relaxed font-inter">
                                                    {selectedPackage.longDescription}
                                                </p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                {/* Inclusions */}
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#1F3D2B] uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" /> What&apos;s Included
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {selectedPackage.includes.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Amenities */}
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#1F3D2B] uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-[#BFA76A]" /> Key Amenities
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPackage.amenities.map((am, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-gray-50 text-xs font-bold text-gray-500 rounded-lg border border-gray-100">
                                                                {am}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                                {/* Exclusions */}
                                                <div>
                                                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <X className="w-4 h-4" /> Exclusions
                                                    </h3>
                                                     <ul className="space-y-2">
                                                        {selectedPackage.exclusions?.map((exc, i) => (
                                                            <li key={i} className="text-sm text-gray-500 italic decoration-slate-300">
                                                                • {exc}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                {/* Special Offers */}
                                                <div className="bg-gold-50/50 p-5 rounded-2xl border border-[#BFA76A]/20">
                                                    <h3 className="text-sm font-bold text-[#BFA76A] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <Gem className="w-4 h-4" /> Exclusive Offers
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {selectedPackage.offers?.map((off, i) => (
                                                            <li key={i} className="text-sm font-medium text-[#1F3D2B] flex items-center gap-2">
                                                                <Sparkles className="w-3 h-3 text-[#BFA76A]" /> {off}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Bottom Bar */}
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Price</p>
                                                    <p className="text-3xl font-bold text-[#1F3D2B]">{selectedPackage.price}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleBookNow(selectedPackage)}
                                                    className="px-8 py-4 bg-[#1F3D2B] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-forest-800 shadow-xl shadow-[#1F3D2B]/20 transition-all transform hover:-translate-y-1"
                                                >
                                                    Proceed to Book
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 1. REVIEWS MODAL */}
                                {bookingStep === 'reviews' && (
                                    <div className="p-10 md:p-14">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-4 rounded-3xl bg-gold-50">
                                                <MessageSquare className="w-8 h-8 text-[#BFA76A]" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-[#1F3D2B]" style={{ fontFamily: 'var(--font-poppins)' }}>Guest Reviews</h2>
                                                <p className="text-gray-500 font-inter">{selectedPackage?.title}</p>
                                            </div>
                                        </div>

                                        {/* Add Review Form */}
                                        <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-100">
                                            <h3 className="text-lg font-bold text-[#1F3D2B] mb-6 flex items-center gap-2">
                                                <Plus className="w-5 h-5" /> Write a Review
                                            </h3>
                                            <form onSubmit={handleAddReview} className="space-y-5">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Your Name</label>
                                                        <input 
                                                            required
                                                            type="text" 
                                                            value={newReview.user}
                                                            onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                                                            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-[#BFA76A] focus:outline-none text-sm" 
                                                            placeholder="John Doe" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Rating</label>
                                                        <select 
                                                            value={newReview.rating}
                                                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                                            className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-[#BFA76A] focus:outline-none text-sm"
                                                        >
                                                            <option value="5">5 Stars - Exceptional</option>
                                                            <option value="4">4 Stars - Great</option>
                                                            <option value="3">3 Stars - Good</option>
                                                            <option value="2">2 Stars - Fair</option>
                                                            <option value="1">1 Star - Poor</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Your Feedback</label>
                                                    <textarea 
                                                        required
                                                        value={newReview.comment}
                                                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                                        className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 focus:border-[#BFA76A] focus:outline-none text-sm h-24 resize-none" 
                                                        placeholder="Share your experience..." 
                                                    />
                                                </div>
                                                <button className="w-full py-4 bg-[#BFA76A] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#a68d52] shadow-lg shadow-[#BFA76A]/20 transition-all">Submit My Review</button>
                                            </form>
                                        </div>

                                        {/* Reviews List */}
                                        <div className="space-y-8">
                                            {selectedPackage?.reviews.map((rev, i) => (
                                                <div key={i} className="pb-8 border-b border-gray-100 last:border-0 flex gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B]/5 flex items-center justify-center text-[#1F3D2B] font-bold flex-shrink-0">
                                                        {rev.user.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-[#1F3D2B]">{rev.user}</h4>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{rev.date}</span>
                                                        </div>
                                                        <div className="flex gap-0.5 mb-3">
                                                            {[...Array(5)].map((_, starI) => (
                                                                <Star key={starI} className={`w-3 h-3 ${starI < rev.rating ? 'text-[#BFA76A] fill-current' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                        <p className="text-sm text-gray-600 font-inter leading-relaxed">{rev.comment}</p>
                                                        <button className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#BFA76A] uppercase hover:opacity-80">
                                                            <ThumbsUp className="w-3 h-3" /> Helpful
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer dark={false} />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}

