'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { 
    Star, 
    Clock, 
    CheckCircle2, 
    ShieldCheck, 
    ChevronRight, 
    User, 
    Heart, 
    Languages, 
    Trophy,
    CreditCard,
    Mail,
    X,
    Calendar,
    Phone,
    MessageSquare,
    Search,
    Filter,
    Map as MapIcon,
    Mountain,
    Sparkles,
    Play,
    Award,
    Verified,
    Check,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';

const dummyGuides = [
    {
        id: '1',
        name: 'Arjun Swamy',
        bio: 'Local trekker with 10+ years of experience in Yelagiri hills. Specialist in night treks and bird watching. I will take you to the most unseen caves of Swamimalai hills and ensure you witness the best sunrise of your life.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        certifications: ['Certified Wilderness First Responder', 'Advanced Mountaineering Course', 'Eco-Tourism Specialist'],
        languages: ['English', 'Tamil', 'Hindi', 'Telugu'],
        expertise: ['Night Trekking', 'Bird Watching', 'Cave Exploration', 'Photography'],
        experience: 12,
        rating: 4.9,
        reviewsCount: 156,
        pricePerHour: 500,
        pricePerDay: 3000,
        pricePerGroup: 5000,
        isVerified: true,
        email: 'arjun.swamy@yelaguide.com',
        phone: '+91 94432 12345',
        badges: ['Top Rated', 'Local Expert', 'Eco-Warrior'],
        gallery: [
            'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: '2',
        name: 'Sravya Reddy',
        bio: 'Environmentalist and expert guide for hidden trails and nature photography. Passionate about preserving the local ecosystem while providing an immersive mountain experience.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        certifications: ['Environmental Conservation Certificate', 'Nature Photography Award 2023'],
        languages: ['English', 'Telugu', 'Tamil', 'Kannada'],
        expertise: ['Nature Photography', 'Eco Trails', 'Plant Identification'],
        experience: 6,
        rating: 4.8,
        reviewsCount: 89,
        pricePerHour: 400,
        pricePerDay: 2500,
        pricePerGroup: 4000,
        isVerified: true,
        email: 'sravya.reddy@yelaguide.com',
        phone: '+91 98845 67890',
        badges: ['Eco-Friendly', 'Rising Star'],
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b??auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: '3',
        name: 'Karthik Raja',
        bio: 'Born and raised in Yelagiri, I know every shortcut and waterfall in the region. Specialist in rock climbing and adventure camping.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        certifications: ['Certified Rock Climbing Instructor', 'NSS Volunteer'],
        languages: ['Tamil', 'English'],
        expertise: ['Rock Climbing', 'Adventure Camping', 'Survival Skills'],
        experience: 8,
        rating: 4.7,
        reviewsCount: 120,
        pricePerHour: 600,
        pricePerDay: 3500,
        pricePerGroup: 6000,
        isVerified: false,
        email: 'karthik.raja@yelaguide.com',
        phone: '+91 81223 34455',
        badges: ['Adventure Specialist'],
        gallery: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
        ]
    }
];

export default function TrekkingGuides() {
    const router = useRouter();
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [bookingMode, setBookingMode] = useState(null); // 'profile' or 'booking'
    const [viewMode, setViewMode] = useState('grid'); // grid or map
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(5000);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedExpertise, setSelectedExpertise] = useState([]);
    const [minRating, setMinRating] = useState(0);

    // Booking Details States
    const [bookingDate, setBookingDate] = useState('');
    const [bookingPeople, setBookingPeople] = useState('');
    const [bookingSlot, setBookingSlot] = useState('');

    const languages = ['Tamil', 'English', 'Hindi', 'Telugu', 'Kannada'];
    const expertiseOptions = ['Night Trekking', 'Bird Watching', 'Cave Exploration', 'Eco Trails', 'Photography', 'Rock Climbing'];

    useEffect(() => {
        async function fetchGuides() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/guides`);
                const data = await res.json();
                if (data.success && data.guides && data.guides.length > 0) {
                    setGuides(data.guides);
                } else {
                    // Fallback to dummy data if API fails or is empty
                    console.log('Using dummy guides as fallback');
                    setGuides(dummyGuides);
                }
            } catch (error) {
                console.error('Failed to fetch guides:', error);
                setGuides(dummyGuides);
            } finally {
                setLoading(false);
            }
        }
        fetchGuides();
    }, []);

    const filteredGuides = guides.filter(guide => {
        const matchesSearch = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             guide.bio.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = guide.pricePerHour <= priceRange;
        const matchesLang = selectedLanguages.length === 0 || 
                           selectedLanguages.some(lang => guide.languages.includes(lang));
        const matchesExpertise = selectedExpertise.length === 0 || 
                                selectedExpertise.some(exp => guide.expertise.includes(exp));
        const matchesRating = guide.rating >= minRating;

        return matchesSearch && matchesPrice && matchesLang && matchesExpertise && matchesRating;
    });

    const handleBookNow = (guide) => {
        setSelectedGuide(guide);
        setBookingMode('booking');
    };

    const handleViewProfile = (guide) => {
        setSelectedGuide(guide);
        setBookingMode('profile');
        setIsPlayingVideo(false);
    };

    const handleConfirmBooking = () => {
        if (!bookingDate) {
            alert('Please select a preferred date for your trek.');
            return;
        }

        if (!bookingPeople) {
            alert('Please select the number of people for your trek.');
            return;
        }

        if (!bookingSlot) {
            alert('Please select a time slot for your trek.');
            return;
        }
        
        const price = calculatePrice();
        const params = new URLSearchParams({
            id: `guide-${selectedGuide.id}`,
            title: `Trek with ${selectedGuide.name}`,
            price: price.toString(),
            description: `${selectedGuide.expertise[0]} - ${selectedGuide.experience} years experience`,
            date: bookingDate,
            people: bookingPeople,
            slot: bookingSlot,
            guideEmail: selectedGuide.email || 'info@goyelagiri.com',
            guidePhone: selectedGuide.phone || '+91 98765 43210'
        });
        router.push(`/booking?${params.toString()}`);
    };

    const calculatePrice = () => {
        if (!selectedGuide) return 0;
        
        // Accurate pricing calculation
        // If they have a per group price, use that as base
        // If not, use per hour * 6 (average trek duration)
        const basePrice = selectedGuide.pricePerGroup || (selectedGuide.pricePerHour * 6);
        
        // Adjust based on group size if needed
        let multiplier = 1;
        if (bookingPeople.includes('5-8')) multiplier = 1.25;
        if (bookingPeople.includes('8+')) multiplier = 1.5;
        
        return Math.round(basePrice * multiplier);
    };

    return (
        <div className="min-h-screen bg-[#FAFBF9] font-sans">
            <Navbar dark={true} />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1920&q=80"
                    alt="Trekking in Yelagiri"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
                <div className="relative z-10 text-center text-white px-4 mt-[-5vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    >
                        <ShieldCheck className="w-4 h-4 text-[#BFA76A]" />
                        <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Certified Local Guides</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        Professional Guides
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90 drop-shadow-md lg:mb-12"
                    >
                        Explore hidden trails and misty peaks with Yelagiri's most experienced trekking experts.
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-6 md:px-12 lg:px-24 -mt-16 relative z-30 pb-24">
                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-white/50 flex flex-col md:flex-row gap-4 mb-16 ring-1 ring-black/5"
                >
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1F3D2B] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by name, expertise or trail..."
                            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-gray-50/50 border-none focus:ring-2 focus:ring-[#1f3d2b]/10 text-[#1f3d2b] font-medium placeholder:text-gray-400 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                            className="px-8 py-5 bg-[#1f3d2b] text-white rounded-[2rem] font-bold flex items-center gap-3 hover:bg-[#2a523a] transition-all shadow-lg shadow-[#1f3d2b]/20 active:scale-95"
                        >
                            {viewMode === 'grid' ? <MapIcon className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            <span className="hidden sm:inline">{viewMode === 'grid' ? 'Show Map' : 'Show Grid'}</span>
                        </button>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4 space-y-10">
                        {/* Price Range */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[#1F3D2B]">Hourly Rate</h3>
                                <span className="text-sm font-medium text-[#BFA76A]">₹{priceRange}</span>
                            </div>
                            <input 
                                type="range" 
                                min="200" 
                                max="5000" 
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1F3D2B]"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-bold">
                                <span>₹200</span>
                                <span>₹5k</span>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Languages Spoken</h3>
                            <div className="flex flex-wrap gap-2">
                                {languages.map(lang => (
                                    <button 
                                        key={lang}
                                        onClick={() => {
                                            if (selectedLanguages.includes(lang)) {
                                                setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                                            } else {
                                                setSelectedLanguages([...selectedLanguages, lang]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                            selectedLanguages.includes(lang)
                                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                                            : 'bg-white text-gray-600 border-gray-100 hover:border-[#BFA76A]'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Expertise */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Expertise</h3>
                            <div className="space-y-2">
                                {expertiseOptions.map(exp => (
                                    <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                            selectedExpertise.includes(exp)
                                            ? 'bg-[#1F3D2B] border-[#1F3D2B] text-white'
                                            : 'border-gray-200 group-hover:border-[#BFA76A]'
                                        }`}>
                                            {selectedExpertise.includes(exp) && <Check className="w-3 h-3" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={selectedExpertise.includes(exp)}
                                            onChange={() => {
                                                if (selectedExpertise.includes(exp)) {
                                                    setSelectedExpertise(selectedExpertise.filter(e => e !== exp));
                                                } else {
                                                    setSelectedExpertise([...selectedExpertise, exp]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 font-medium group-hover:text-[#1F3D2B] transition-colors">{exp}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Minimum Rating */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-[#1F3D2B]">Minimum Rating</h3>
                            <div className="flex gap-2">
                                {[3, 4, 4.5].map(rate => (
                                    <button 
                                        key={rate}
                                        onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                                            minRating === rate
                                            ? 'bg-[#BFA76A] text-white border-[#BFA76A]'
                                            : 'bg-white text-gray-600 border-gray-100'
                                        }`}
                                    >
                                        {rate}+ ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(searchQuery || selectedLanguages.length > 0 || selectedExpertise.length > 0 || minRating > 0 || priceRange < 5000) && (
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setPriceRange(5000);
                                    setSelectedLanguages([]);
                                    setSelectedExpertise([]);
                                    setMinRating(0);
                                }}
                                className="w-full py-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest hover:border-[#BFA76A] hover:text-[#BFA76A] transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" /> Reset All Filters
                            </button>
                        )}
                    </aside>

                    {/* Main Content Grid */}
                    <div className="flex-1">
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 gap-8">
                                <AnimatePresence>
                                    {filteredGuides.length > 0 ? (
                                        filteredGuides.map((guide, idx) => (
                                            <div key={guide.id || idx}>
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="group bg-white rounded-[2rem] p-4 border border-gray-100 hover:border-[#BFA76A]/30 hover:shadow-2xl hover:shadow-[#BFA76A]/10 transition-all duration-500 flex flex-col md:flex-row gap-6 items-stretch"
                                                >
                                                    {/* Image Section */}
                                                    <div className="w-full md:w-72 h-64 md:h-auto relative rounded-[1.5rem] overflow-hidden flex-shrink-0">
                                                        <Image 
                                                            src={guide.image}
                                                            alt={guide.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1F3D2B] flex items-center gap-1.5">
                                                            <Star className="w-3 h-3 fill-[#BFA76A] text-[#BFA76A]" />
                                                            {guide.rating}
                                                        </div>
                                                        {guide.isVerified && (
                                                            <div className="absolute top-4 right-4 px-3 py-1 bg-[#1F3D2B]/80 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                                                                <Verified className="w-3 h-3" />
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="flex-1 flex flex-col justify-center py-2">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                                    {guide.name}
                                                                </h3>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-400/10 rounded-md">
                                                                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                                        <span className="text-xs font-bold text-yellow-700">{guide.rating}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                                        <Clock className="w-3.5 h-3.5 text-[#BFA76A]" />
                                                                        {guide.experience} Years Experience
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starting from</div>
                                                                <div className="text-2xl font-bold text-[#1F3D2B]">₹{guide.pricePerHour}<span className="text-xs font-normal text-gray-400">/hr</span></div>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 max-w-2xl">
                                                            {guide.bio}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mb-8">
                                                            {guide.expertise.slice(0, 4).map(exp => (
                                                                <span key={exp} className="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-500 border border-gray-100 uppercase tracking-wider">
                                                                    {exp}
                                                                </span>
                                                            ))}
                                                            {guide.expertise.length > 4 && (
                                                                <span className="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-bold text-[#BFA76A] border border-gray-100 uppercase tracking-wider">
                                                                    +{guide.expertise.length - 4} More
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Base Rate</span>
                                                                <span className="text-lg font-bold text-[#1F3D2B]">₹{guide.pricePerGroup || (guide.pricePerHour * 6)} / Experience</span>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button 
                                                                    onClick={() => handleViewProfile(guide)}
                                                                    className="px-6 py-3 border border-[#1F3D2B]/10 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-all shadow-sm"
                                                                >
                                                                    Profile
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleBookNow(guide)}
                                                                    className="px-6 py-3 bg-[#BFA76A] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#a68d52] shadow-lg shadow-[#BFA76A]/20 transition-all flex items-center gap-2"
                                                                >
                                                                    Book Now
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">No guides found</h3>
                                            <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your filters or search query to find available trekking experts.</p>
                                            <button 
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setPriceRange(5000);
                                                    setSelectedLanguages([]);
                                                    setSelectedExpertise([]);
                                                    setMinRating(0);
                                                }}
                                                className="mt-6 text-[#BFA76A] font-bold text-sm hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-4 border border-gray-100 h-[800px] relative overflow-hidden shadow-2xl shadow-black/5">
                                {/* Map Placeholder Styled Like Premium Map */}
                                <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-[#1f3d2b]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <MapIcon className="w-10 h-10 text-[#1f3d2b]/20" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1f3d2b] mb-2">Interactive Trail Map</h3>
                                        <p className="text-gray-400 text-sm max-w-xs mx-auto">Explore guides based on their current locations and nearby trails in Neel Hills and Swamimalai.</p>
                                    </div>
                                    
                                    {/* Mock Pointers */}
                                    {filteredGuides.map((guide, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="absolute cursor-pointer group"
                                            style={{ 
                                                top: `${20 + (i * 15) % 60}%`, 
                                                left: `${20 + (i * 25) % 60}%` 
                                            }}
                                            onClick={() => handleViewProfile(guide)}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
                                                    <Image src={guide.image} alt="" fill className="object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#BFA76A] rounded-full border-2 border-white flex items-center justify-center">
                                                    <Star className="w-3 h-3 text-white fill-white" />
                                                </div>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white px-3 py-2 rounded-xl shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="text-xs font-bold text-[#1F3D2B]">{guide.name}</div>
                                                <div className="text-[10px] text-[#BFA76A] font-bold uppercase tracking-wider">₹{guide.pricePerHour}/hr</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                                    <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-white/20 shadow-xl pointer-events-auto">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Legend</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#1F3D2B]">
                                                <div className="w-3 h-3 bg-[#BFA76A] rounded-full" /> Top Rated Guides
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#1F3D2B]">
                                                <div className="w-3 h-3 bg-[#1F3D2B] rounded-full" /> Verified Local Experts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Guide Profile / Booking Modal */}
            <AnimatePresence>
                {bookingMode && selectedGuide && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBookingMode(null)} />
                        
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="relative w-full max-w-5xl bg-[#FAFBF9] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setBookingMode(null)}
                                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white md:text-[#1F3D2B] md:bg-gray-100 md:hover:bg-gray-200 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Left Side: Images & Video */}
                            <div className="w-full md:w-2/5 relative h-64 md:h-auto group">
                                <Image 
                                    src={selectedGuide.image}
                                    alt={selectedGuide.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                
                                {selectedGuide.videoUrl && !isPlayingVideo && (
                                    <button 
                                        onClick={() => setIsPlayingVideo(true)}
                                        className="absolute inset-0 flex items-center justify-center group/play bg-black/20 hover:bg-black/40 transition-all"
                                    >
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </button>
                                )}

                                {isPlayingVideo && selectedGuide.videoUrl && (
                                    <div className="absolute inset-0 bg-black z-10">
                                        <iframe 
                                            className="w-full h-full"
                                            src={selectedGuide.videoUrl.replace('watch?v=', 'embed/')} 
                                            title="Guide Intro Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                        <button 
                                            onClick={() => setIsPlayingVideo(false)}
                                            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        {selectedGuide.badges.map(badge => (
                                            <span key={badge} className="px-3 py-1 bg-[#BFA76A] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedGuide.name}</h2>
                                    <div className="flex items-center gap-4 text-white/80 text-sm">
                                        <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#BFA76A] fill-[#BFA76A]" /> {selectedGuide.rating}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedGuide.experience}y Exp</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Details & Booking */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-12">
                                <div className="max-w-xl mx-auto space-y-10">
                                    {bookingMode === 'profile' ? (
                                        <>
                                            <section className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFA76A]">About the Guide</h4>
                                                <p className="text-gray-600 leading-relaxed text-lg font-light">
                                                    {selectedGuide.bio}
                                                </p>
                                            </section>

                                            <div className="grid grid-cols-2 gap-8">
                                                <section className="space-y-4">
                                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFA76A]">Languages</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedGuide.languages.map(lang => (
                                                            <span key={lang} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500">
                                                                {lang}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </section>
                                                <section className="space-y-4">
                                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFA76A]">Certifications</h4>
                                                    <div className="space-y-2">
                                                        {selectedGuide.certifications.map((cert, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-xs font-medium text-gray-600">
                                                                <Award className="w-4 h-4 text-[#BFA76A] flex-shrink-0" />
                                                                {cert}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>

                                            <section className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFA76A]">Verified Reviews</h4>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-[#BFA76A] text-[#BFA76A]" />
                                                        <span className="text-sm font-bold text-[#1F3D2B]">{selectedGuide.rating}</span>
                                                        <span className="text-xs text-gray-400">({selectedGuide.reviewsCount} reviews)</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        { user: "Rahul K.", date: "2 days ago", rating: 5, comment: "Arjun is a legendary guide. The night trek was safe and the views were breathtaking!" },
                                                        { user: "Sarah M.", date: "1 week ago", rating: 4.5, comment: "Very professional and knowledgeable about the local flora and fauna. Highly recommended." }
                                                    ].map((rev, i) => (
                                                        <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-bold text-[#1F3D2B]">{rev.user}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{rev.date}</span>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, starI) => (
                                                                    <Star key={starI} className={`w-3 h-3 ${starI < Math.floor(rev.rating) ? 'fill-[#BFA76A] text-[#BFA76A]' : 'text-gray-200'}`} />
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-gray-500 leading-relaxed italic">"{rev.comment}"</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Price per experience</div>
                                                        <div className="text-3xl font-bold text-[#1F3D2B]">₹{selectedGuide.pricePerGroup || (selectedGuide.pricePerHour * 6)}</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setBookingMode('booking')}
                                                    className="px-8 py-5 bg-[#1F3D2B] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2a523a] shadow-xl shadow-[#1F3D2B]/20 transition-all flex items-center gap-3"
                                                >
                                                    Book Experience <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    ) : bookingMode === 'booking' ? (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                                            <div className="flex items-center gap-4 mb-2 sticky top-0 bg-[#FAFBF9] z-20 py-2">
                                                <button 
                                                    onClick={() => setBookingMode('profile')}
                                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                                </button>
                                                <h3 className="text-2xl font-bold text-[#1F3D2B]">Book Experience</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preferred Date <span className="text-red-500">*</span></label>
                                                    <input 
                                                        type="date" 
                                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-medium text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#BFA76A]/20" 
                                                        value={bookingDate}
                                                        onChange={(e) => setBookingDate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Number of People</label>
                                                    <select 
                                                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 font-medium text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#BFA76A]/20"
                                                        value={bookingPeople}
                                                        onChange={(e) => setBookingPeople(e.target.value)}
                                                        required
                                                    >
                                                        <option value="" disabled>Number of Persons</option>
                                                        <option value="1 Person">1 Person</option>
                                                        <option value="2-4 People">2-4 People</option>
                                                        <option value="5-8 People">5-8 People</option>
                                                        <option value="Large Group (8+)">Large Group (8+)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Slots</label>
                                                    {bookingSlot && (
                                                        <span className="text-[9px] bg-[#BFA76A]/10 text-[#BFA76A] px-2 py-0.5 rounded-full font-bold uppercase border border-[#BFA76A]/20 animate-pulse">
                                                            Currently Selected: {bookingSlot}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {['06:00 AM', '09:00 AM', '02:00 PM', '04:00 PM'].map(slot => (
                                                        <button 
                                                            key={slot} 
                                                            onClick={() => setBookingSlot(slot)}
                                                            className={`py-4 border rounded-2xl text-xs font-bold transition-all relative overflow-hidden group ${
                                                                bookingSlot === slot 
                                                                ? 'bg-[#1F3D2B] border-[#1F3D2B] text-white shadow-xl scale-[1.02]'
                                                                : 'border-gray-100 text-[#1F3D2B] bg-white hover:border-[#BFA76A] hover:text-[#BFA76A]'
                                                            }`}
                                                        >
                                                            <span className="relative z-10">{slot}</span>
                                                            {bookingSlot === slot && (
                                                                <motion.div 
                                                                    layoutId="activeSlot"
                                                                    className="absolute inset-0 bg-gradient-to-tr from-[#BFA76A]/20 to-transparent pointer-events-none"
                                                                />
                                                            )}
                                                            {bookingSlot !== slot && (
                                                                <div className="absolute inset-0 bg-gray-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-6 bg-[#1F3D2B] rounded-[2.5rem] text-white border border-white/10 shadow-2xl relative overflow-hidden">
                                                {/* Decorative background circle */}
                                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#BFA76A]/10 rounded-full blur-2xl" />
                                                
                                                <div className="space-y-4 mb-6 relative z-10">
                                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                                        <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Cost Breakdown</span>
                                                        <span className="text-[10px] text-[#BFA76A] font-bold uppercase tracking-widest">Base Rate Included</span>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-start text-sm">
                                                            <div className="flex flex-col">
                                                                <span className="text-white/60">1. Base Experience Fee</span>
                                                                <span className="text-[9px] text-white/30 font-mono mt-1">
                                                                    ₹{selectedGuide.pricePerHour}/hr × 10 Hours (Standard)
                                                                </span>
                                                            </div>
                                                            <span className="font-bold">₹{(selectedGuide.pricePerGroup || (selectedGuide.pricePerHour * 6)).toLocaleString('en-IN')}</span>
                                                        </div>

                                                        {bookingPeople.includes('5-8') && (
                                                            <div className="flex justify-between items-start text-sm text-[#BFA76A]">
                                                                <div className="flex flex-col">
                                                                    <span className="opacity-80">2. Group Size Adjustment</span>
                                                                    <span className="text-[9px] opacity-40 font-mono mt-1">
                                                                        Base Price × 0.25 (5-8 People)
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold">+ ₹{Math.round((selectedGuide.pricePerGroup || (selectedGuide.pricePerHour * 6)) * 0.25).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}

                                                        {bookingPeople.includes('8+') && (
                                                            <div className="flex justify-between items-start text-sm text-[#BFA76A]">
                                                                <div className="flex flex-col">
                                                                    <span className="opacity-80">2. Large Group Adjustment</span>
                                                                    <span className="text-[9px] opacity-40 font-mono mt-1">
                                                                        Base Price × 0.50 (8+ People)
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold">+ ₹{Math.round((selectedGuide.pricePerGroup || (selectedGuide.pricePerHour * 6)) * 0.5).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}

                                                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">Total Estimated Cost</div>
                                                                <div className="text-[9px] text-[#BFA76A] font-bold uppercase tracking-wider">Final Calculation Step</div>
                                                            </div>
                                                            <div className="text-3xl font-bold text-white tracking-tight">₹{calculatePrice().toLocaleString('en-IN')}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={handleConfirmBooking}
                                                    className="w-full py-5 bg-[#BFA76A] text-white rounded-[1.5rem] font-bold uppercase tracking-widest hover:bg-[#a68d52] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/30 group active:scale-95"
                                                >
                                                    Secure This Slot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-center gap-6 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-[#BFA76A]" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Payment</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer dark={true} />
        </div>
    );
}


