'use client';

import { useAuth } from '../context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    // Modal states
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const [showAddBucketItem, setShowAddBucketItem] = useState(false);
    const [showEditPreference, setShowEditPreference] = useState(null);
    const [showNotification, setShowNotification] = useState(null);
    const [showMobileVerification, setShowMobileVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    // Form states
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        bloodGroup: user?.bloodGroup || '',
        emergencyContact: user?.emergencyContact || '',
        bio: 'Passionate traveler exploring the beautiful hills of Yelagiri. Love adventure sports, local cuisine, and discovering hidden gems!'
    });

    // Fetch real profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.email) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                        headers: { 'user-email': user.email }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setEditForm(prev => ({
                            ...prev,
                            name: data.name,
                            email: data.email,
                            mobile: data.mobile || '',
                            bloodGroup: data.bloodGroup || '',
                            emergencyContact: data.emergencyContact || ''
                        }));
                    }
                } catch (err) {
                    console.error('Failed to fetch profile:', err);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const [newPlace, setNewPlace] = useState({ name: '', icon: '🏞️', date: '' });
    const [newBucketItem, setNewBucketItem] = useState({ name: '', icon: '⭐', category: 'Tourist Spots' });

    // Data states
    const [travelStats, setTravelStats] = useState({
        placesVisited: 12,
        reviewsWritten: 8,
        bookingsMade: 5,
        favoriteSpots: 15
    });

    const [visitedPlaces, setVisitedPlaces] = useState([
        { id: 1, name: 'Punganoor Lake', icon: '🏞️', date: 'Dec 2024' },
        { id: 2, name: 'Swamimalai Hills', icon: '⛰️', date: 'Nov 2024' },
        { id: 3, name: 'Jalagamparai Falls', icon: '💧', date: 'Oct 2024' },
    ]);

    const [bucketList, setBucketList] = useState([
        { id: 1, name: 'Paragliding Adventure', icon: '🪂', category: 'Activities', completed: false },
        { id: 2, name: 'Nature Park Visit', icon: '🌳', category: 'Tourist Spots', completed: false },
        { id: 3, name: 'Local Cuisine Tour', icon: '🍽️', category: 'Restaurants', completed: false },
    ]);

    const [travelPreferences, setTravelPreferences] = useState({
        budget: 'Moderate',
        adventureLevel: 'High',
        accommodation: 'Resorts',
        travelStyle: 'Explorer'
    });

    // Notification helpers
    const showSuccessNotification = (message) => {
        setShowNotification(message);
        setTimeout(() => setShowNotification(null), 3000);
    };

    const showErrorNotification = (message) => {
        setShowNotification({ text: message, error: true });
        setTimeout(() => setShowNotification(null), 3000);
    };

    // Validation helpers
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setEditForm({ ...editForm, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Edit Profile Handler
    const handleEditProfile = async () => {
        // Validate fields
        if (editForm.mobile && !validateMobile(editForm.mobile)) {
            showErrorNotification('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': user.email
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                if (updateUser) {
                    updateUser(updatedUser);
                }
                setShowEditProfile(false);
                showSuccessNotification('Profile updated successfully! ✅');
            } else {
                const errorText = await res.text();
                console.error('Profile update failed:', res.status, errorText);
                showErrorNotification(`Failed to update profile: ${res.status}`);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            showErrorNotification('Error updating profile. Please try again.');
        }
    };

    // Send OTP
    const handleSendOtp = async () => {
        if (!editForm.mobile || !validateMobile(editForm.mobile)) {
            showErrorNotification('Please enter a valid 10-digit mobile number first');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/mobile-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, mobile: editForm.mobile })
            });

            if (res.ok) {
                showSuccessNotification('OTP sent! Check server console 📱');
            } else {
                showErrorNotification('Failed to send OTP');
            }
        } catch (err) {
            console.error(err);
            showErrorNotification('Error sending OTP');
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-mobile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, otp })
            });

            if (res.ok) {
                setShowMobileVerification(false);
                setOtp('');
                showSuccessNotification('Mobile verified successfully! ✅');
                // Refresh profile
                window.location.reload();
            } else {
                showErrorNotification('Invalid OTP');
            }
        } catch (err) {
            console.error(err);
            showErrorNotification('Error verifying OTP');
        }
    };

    // Add Visited Place Handler
    const handleAddPlace = () => {
        if (newPlace.name && newPlace.date) {
            const place = {
                id: Date.now(),
                ...newPlace
            };
            setVisitedPlaces([place, ...visitedPlaces]);
            setTravelStats({ ...travelStats, placesVisited: travelStats.placesVisited + 1 });
            setNewPlace({ name: '', icon: '🏞️', date: '' });
            setShowAddPlace(false);
            showSuccessNotification('Place added to your visited list! 🎉');
        }
    };

    // Add Bucket List Item Handler
    const handleAddBucketItem = () => {
        if (newBucketItem.name) {
            const item = {
                id: Date.now(),
                ...newBucketItem,
                completed: false
            };
            setBucketList([...bucketList, item]);
            setNewBucketItem({ name: '', icon: '⭐', category: 'Tourist Spots' });
            setShowAddBucketItem(false);
            showSuccessNotification('Item added to your bucket list! ⭐');
        }
    };

    // Mark Bucket Item as Done
    const handleMarkDone = (id) => {
        const updatedList = bucketList.map(item =>
            item.id === id ? { ...item, completed: true } : item
        );
        setBucketList(updatedList);
        showSuccessNotification('Awesome! Item marked as completed! 🎊');
    };

    // Update Preference Handler
    const handleUpdatePreference = (key, value) => {
        setTravelPreferences({ ...travelPreferences, [key]: value });
        setShowEditPreference(null);
        showSuccessNotification('Preference updated! ⚙️');
    };

    // Remove visited place
    const handleRemovePlace = (id) => {
        setVisitedPlaces(visitedPlaces.filter(p => p.id !== id));
        setTravelStats({ ...travelStats, placesVisited: Math.max(0, travelStats.placesVisited - 1) });
        showSuccessNotification('Place removed from your list');
    };

    // Remove bucket list item
    const handleRemoveBucketItem = (id) => {
        setBucketList(bucketList.filter(item => item.id !== id));
        showSuccessNotification('Item removed from bucket list');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-go-green-50 to-blue-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-white rounded-3xl shadow-xl"
                >
                    <div className="text-6xl mb-4">🔒</div>
                    <p className="text-xl text-slate-600 font-medium">Please sign in to view your profile.</p>
                    <a href="/signin" className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-go-green-500 to-blue-500 text-white rounded-full font-bold hover:shadow-lg transition-all">
                        Sign In
                    </a>
                </motion.div>
            </div>
        );
    }

    const iconOptions = ['🏞️', '⛰️', '💧', '🌳', '🏖️', '🎢', '🎡', '🎪', '🎭', '🎨'];
    const categoryOptions = ['Tourist Spots', 'Hotels', 'Restaurants', 'Activities', 'Shopping'];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/40 via-teal-50/20 to-blue-50/40">
            <Navbar />

            {/* Notification */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 right-4 z-50 ${typeof showNotification === 'object' && showNotification.error
                                ? 'bg-gradient-to-r from-red-500 to-rose-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}
                    >
                        <span className="text-2xl">
                            {typeof showNotification === 'object' && showNotification.error ? '⚠️' : '✓'}
                        </span>
                        <span className="font-semibold">
                            {typeof showNotification === 'object' ? showNotification.text : showNotification}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 container mx-auto px-4 py-12 pt-28">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 mb-8"
                    >
                        {/* Cover Background */}
                        <div className="relative h-48 bg-gradient-to-r from-go-green-400 via-blue-500 to-orange-400 overflow-hidden">
                            <motion.div
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-30"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
                                    backgroundSize: '30px 30px'
                                }}
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative"
                                >
                                    <div className="p-2 bg-gradient-to-r from-go-green-400 to-blue-500 rounded-full">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={160}
                                            height={160}
                                            className="rounded-full ring-4 ring-white shadow-2xl"
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                                </motion.div>

                                <div className="flex-1 text-center md:text-left mb-4">
                                    <h1 className="text-4xl font-bold text-slate-800 mb-2">{user.name}</h1>
                                    <p className="text-slate-600 mb-3">{user.email}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="px-4 py-1.5 bg-gradient-to-r from-go-green-100 to-blue-100 text-go-green-700 rounded-full text-sm font-semibold">
                                            🌟 Explorer
                                        </span>
                                        <span className="px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-sm font-semibold">
                                            ✈️ Travel Enthusiast
                                        </span>
                                        {editForm.emailVerified ? (
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold">
                                                ✅ Email Verified
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => alert('Email verification is mocked. Check server console for verification link on signup.')}
                                                className="px-4 py-1.5 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-full text-sm font-semibold hover:shadow-md transition-all"
                                            >
                                                ⚠️ Email Unverified (Click for info)
                                            </button>
                                        )}
                                        {editForm.mobile && (
                                            editForm.mobileVerified ? (
                                                <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold">
                                                    ✅ Mobile Verified
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => setShowMobileVerification(true)}
                                                    className="px-4 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 rounded-full text-sm font-semibold hover:shadow-md transition-all"
                                                >
                                                    📱 Verify Mobile
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowEditProfile(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-go-green-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        ✏️ Edit Profile
                                    </motion.button>
                                </div>
                            </div>

                            {/* Travel Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {[
                                    { label: 'Places Visited', value: travelStats.placesVisited, icon: '📍', color: 'from-go-green-500 to-blue-500' },
                                    { label: 'Reviews', value: travelStats.reviewsWritten, icon: '⭐', color: 'from-purple-500 to-pink-500' },
                                    { label: 'Bookings', value: travelStats.bookingsMade, icon: '🎫', color: 'from-orange-500 to-amber-500' },
                                    { label: 'Favorites', value: travelStats.favoriteSpots, icon: '❤️', color: 'from-red-500 to-rose-500' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="relative p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-100 overflow-hidden group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                        <div className="text-3xl mb-2">{stat.icon}</div>
                                        <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: '👤' },
                            { id: 'visited', label: 'Visited Places', icon: '📍' },
                            { id: 'wishlist', label: 'Bucket List', icon: '⭐' },
                            { id: 'preferences', label: 'Preferences', icon: '⚙️' }
                        ].map(tab => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-go-green-500 to-blue-500 text-white shadow-lg'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* About Section */}
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-white/50">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <span>📝</span> About Me
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        {editForm.bio}
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-go-green-50 to-blue-50 rounded-xl">
                                            <span className="text-2xl">📧</span>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium">Email</p>
                                                <p className="text-slate-800 font-semibold">{user.email}</p>
                                            </div>
                                        </div>
                                        {editForm.mobile && (
                                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                                <span className="text-2xl">📱</span>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Mobile</p>
                                                    <p className="text-slate-800 font-semibold">{editForm.mobile}</p>
                                                </div>
                                            </div>
                                        )}
                                        {editForm.bloodGroup && (
                                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl">
                                                <span className="text-2xl">🩸</span>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Blood Group</p>
                                                    <p className="text-slate-800 font-semibold">{editForm.bloodGroup}</p>
                                                </div>
                                            </div>
                                        )}
                                        {editForm.emergencyContact && (
                                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                                                <span className="text-2xl">🆘</span>
                                                <div>
                                                    <p className="text-xs text-slate-500 font-medium">Emergency Contact</p>
                                                    <p className="text-slate-800 font-semibold">{editForm.emergencyContact}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                                            <span className="text-2xl">📅</span>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium">Member Since</p>
                                                <p className="text-slate-800 font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-white/50">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <span>⚡</span> Quick Actions
                                    </h2>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'My Bookings', icon: '🎫', href: '/bookings', color: 'from-go-green-500 to-blue-500' },
                                            { label: 'Favorites', icon: '❤️', href: '/favorites', color: 'from-red-500 to-rose-500' },
                                            { label: 'Trip Planner', icon: '🗺️', href: '/trip-planner', color: 'from-purple-500 to-pink-500' },
                                            { label: 'Budget Tracker', icon: '💰', href: '/budget-tracker', color: 'from-orange-500 to-amber-500' }
                                        ].map((action, i) => (
                                            <motion.button
                                                key={action.label}
                                                onClick={() => router.push(action.href)}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r ${action.color} rounded-2xl text-white shadow-lg hover:shadow-xl transition-all group`}
                                            >
                                                <span className="text-3xl">{action.icon}</span>
                                                <span className="font-bold text-lg">{action.label}</span>
                                                <span className="ml-auto transform group-hover:translate-x-1 transition-transform">→</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'visited' && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-white/50">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span>📍</span> Places I&apos;ve Visited
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {visitedPlaces.map((place, i) => (
                                        <motion.div
                                            key={place.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="relative p-6 bg-gradient-to-br from-go-green-50 to-blue-50 rounded-2xl border border-go-green-100 hover:shadow-lg transition-all group"
                                        >
                                            <button
                                                onClick={() => handleRemovePlace(place.id)}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                            <div className="text-4xl mb-3">{place.icon}</div>
                                            <h3 className="font-bold text-slate-800 mb-1">{place.name}</h3>
                                            <p className="text-sm text-slate-500">{place.date}</p>
                                        </motion.div>
                                    ))}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setShowAddPlace(true)}
                                        className="p-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-go-green-400 hover:text-go-green-600 transition-all cursor-pointer"
                                    >
                                        <div className="text-4xl mb-2">➕</div>
                                        <p className="font-semibold">Add Place</p>
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-white/50">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <span>⭐</span> My Bucket List
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAddBucketItem(true)}
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg"
                                    >
                                        + Add Item
                                    </motion.button>
                                </div>
                                <div className="space-y-4">
                                    {bucketList.filter(item => !item.completed).map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all group"
                                        >
                                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                                {item.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-800">{item.name}</h3>
                                                <p className="text-sm text-slate-500">{item.category}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMarkDone(item.id)}
                                                    className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
                                                >
                                                    ✓ Mark Done
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveBucketItem(item.id)}
                                                    className="px-3 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {bucketList.filter(item => item.completed).length > 0 && (
                                        <>
                                            <h3 className="text-lg font-bold text-slate-600 mt-8 mb-4">✅ Completed</h3>
                                            {bucketList.filter(item => item.completed).map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 opacity-60"
                                                >
                                                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-slate-800 line-through">{item.name}</h3>
                                                        <p className="text-sm text-slate-500">{item.category}</p>
                                                    </div>
                                                    <span className="text-2xl">✓</span>
                                                </motion.div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-white/50">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span>⚙️</span> Travel Preferences
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { key: 'budget', label: 'Budget Range', value: travelPreferences.budget, icon: '💰', color: 'from-green-500 to-emerald-500', options: ['Budget', 'Moderate', 'Luxury'] },
                                        { key: 'adventureLevel', label: 'Adventure Level', value: travelPreferences.adventureLevel, icon: '🎢', color: 'from-red-500 to-orange-500', options: ['Low', 'Medium', 'High', 'Extreme'] },
                                        { key: 'accommodation', label: 'Accommodation', value: travelPreferences.accommodation, icon: '🏨', color: 'from-blue-500 to-indigo-500', options: ['Hotels', 'Resorts', 'Homestays', 'Camping'] },
                                        { key: 'travelStyle', label: 'Travel Style', value: travelPreferences.travelStyle, icon: '✈️', color: 'from-purple-500 to-pink-500', options: ['Explorer', 'Relaxer', 'Adventurer', 'Cultural'] }
                                    ].map((pref, i) => (
                                        <motion.div
                                            key={pref.key}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${pref.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                                                    {pref.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 font-medium">{pref.label}</p>
                                                    <p className="text-lg font-bold text-slate-800">{pref.value}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowEditPreference(pref)}
                                                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition-colors"
                                            >
                                                Update
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditProfile(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">✏️ Edit Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-go-green-400 to-blue-500 flex items-center justify-center overflow-hidden">
                                            {profileImage || editForm.image ? (
                                                <img src={profileImage || editForm.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl text-white">{user.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                        disabled // Email should not be editable directly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Mobile Number <span className="text-xs text-slate-500">(10 digits)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={editForm.mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ''); // Only digits
                                            setEditForm({ ...editForm, mobile: value });
                                        }}
                                        maxLength={10}
                                        placeholder="9876543210"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${editForm.mobile && !validateMobile(editForm.mobile)
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-slate-300 focus:ring-go-green-500'
                                            }`}
                                    />
                                    {editForm.mobile && !validateMobile(editForm.mobile) && (
                                        <p className="text-xs text-red-500 mt-1">Must be exactly 10 digits</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
                                        <select
                                            value={editForm.bloodGroup}
                                            onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                                        <input
                                            type="tel"
                                            value={editForm.emergencyContact}
                                            onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleEditProfile}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-go-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Place Modal */}
            <AnimatePresence>
                {showAddPlace && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddPlace(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">📍 Add Visited Place</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Place Name</label>
                                    <input
                                        type="text"
                                        value={newPlace.name}
                                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                                        placeholder="e.g., Punganoor Lake"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {iconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                onClick={() => setNewPlace({ ...newPlace, icon })}
                                                className={`text-3xl p-3 rounded-xl border-2 transition-all ${newPlace.icon === icon
                                                    ? 'border-go-green-500 bg-go-green-50'
                                                    : 'border-slate-200 hover:border-go-green-300'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Visit Date</label>
                                    <input
                                        type="text"
                                        value={newPlace.date}
                                        onChange={(e) => setNewPlace({ ...newPlace, date: e.target.value })}
                                        placeholder="e.g., Dec 2024"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAddPlace}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-go-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Add Place
                                </button>
                                <button
                                    onClick={() => setShowAddPlace(false)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Bucket Item Modal */}
            <AnimatePresence>
                {showAddBucketItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddBucketItem(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">⭐ Add Bucket List Item</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        value={newBucketItem.name}
                                        onChange={(e) => setNewBucketItem({ ...newBucketItem, name: e.target.value })}
                                        placeholder="e.g., Paragliding Adventure"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {iconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                onClick={() => setNewBucketItem({ ...newBucketItem, icon })}
                                                className={`text-3xl p-3 rounded-xl border-2 transition-all ${newBucketItem.icon === icon
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-slate-200 hover:border-orange-300'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                    <select
                                        value={newBucketItem.category}
                                        onChange={(e) => setNewBucketItem({ ...newBucketItem, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        {categoryOptions.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAddBucketItem}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Add Item
                                </button>
                                <button
                                    onClick={() => setShowAddBucketItem(false)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Preference Modal */}
            <AnimatePresence>
                {showEditPreference && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditPreference(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                {showEditPreference.icon} Update {showEditPreference.label}
                            </h2>
                            <div className="space-y-3">
                                {showEditPreference.options.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleUpdatePreference(showEditPreference.key, option)}
                                        className={`w-full px-6 py-4 rounded-xl font-bold transition-all ${travelPreferences[showEditPreference.key] === option
                                            ? `bg-gradient-to-r ${showEditPreference.color} text-white shadow-lg`
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowEditPreference(null)}
                                className="w-full mt-4 px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Verification Modal */}
            <AnimatePresence>
                {showMobileVerification && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowMobileVerification(false);
                            setOtp('');
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">📱 Verify Mobile Number</h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> This is a demo. OTP will be logged to the server console (not sent via SMS).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={editForm.mobile}
                                        disabled
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50"
                                    />
                                </div>

                                <button
                                    onClick={handleSendOtp}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Send OTP
                                </button>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-go-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-go-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Verify OTP
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMobileVerification(false);
                                        setOtp('');
                                    }}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
