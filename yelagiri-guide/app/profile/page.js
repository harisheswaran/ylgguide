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
    // Modal states
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const [showAddBucketItem, setShowAddBucketItem] = useState(false);
    const [showEditPreference, setShowEditPreference] = useState(null);
    const [showNotification, setShowNotification] = useState(null);

    // Verification States
    const [showMobileVerification, setShowMobileVerification] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [verificationStep, setVerificationStep] = useState('initial');
    const [isVerifying, setIsVerifying] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // Form states
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        bloodGroup: user?.bloodGroup || '',
        emergencyContact: user?.emergencyContact || '',
        emergencyContactName: user?.emergencyContactName || '',
        bio: 'Passionate traveler exploring the beautiful hills of Yelagiri. Love adventure sports, local cuisine, and discovering hidden gems!',
        emailVerified: false,
        mobileVerified: false,
        profileCompleted: false
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
                            emergencyContact: data.emergencyContact || '',
                            emergencyContactName: data.emergencyContactName || '',
                            emailVerified: data.emailVerified || false,
                            mobileVerified: data.mobileVerified || false,
                            profileCompleted: data.profileCompleted || false
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

        if (editForm.emergencyContact && !validateMobile(editForm.emergencyContact)) {
            showErrorNotification('Please enter a valid 10-digit emergency contact number');
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

    // Verification Handlers
    const handleSendEmailOtp = async () => {
        setIsVerifying(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/send-email-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, email: user.email })
            });
            if (res.ok) {
                setVerificationStep('sent');
                showSuccessNotification('OTP sent to your email!');
            } else {
                showErrorNotification('Failed to send OTP');
            }
        } catch (error) {
            showErrorNotification('Error sending OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        setIsVerifying(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-email-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, otp: emailOtp })
            });
            if (res.ok) {
                const data = await res.json();
                setShowEmailVerification(false);
                showSuccessNotification('Email verified successfully! ✅');
                setEditForm(prev => ({
                    ...prev,
                    emailVerified: true,
                    profileCompleted: data.profileCompleted || prev.profileCompleted
                }));
                if (updateUser) updateUser({
                    emailVerified: true,
                    profileCompleted: data.profileCompleted
                });
                setVerificationStep('initial');
                setEmailOtp('');
            } else {
                showErrorNotification('Invalid OTP. Please try again.');
            }
        } catch (error) {
            showErrorNotification('Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSendMobileOtp = async () => {
        if (!editForm.mobile || editForm.mobile.length !== 10) {
            showErrorNotification('Please save a valid mobile number first');
            return;
        }
        setIsVerifying(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/mobile-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, mobile: editForm.mobile })
            });
            if (res.ok) {
                setVerificationStep('sent');
                showSuccessNotification('OTP sent to your mobile!');
            } else {
                showErrorNotification('Failed to send OTP');
            }
        } catch (error) {
            showErrorNotification('Error sending OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyMobileOtp = async () => {
        setIsVerifying(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-mobile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, otp: mobileOtp })
            });
            if (res.ok) {
                const data = await res.json();
                setShowMobileVerification(false);
                showSuccessNotification('Mobile number verified! ✅');
                setEditForm(prev => ({
                    ...prev,
                    mobileVerified: true,
                    profileCompleted: data.profileCompleted || prev.profileCompleted
                }));
                if (updateUser) updateUser({
                    mobileVerified: true,
                    profileCompleted: data.profileCompleted
                });
                setVerificationStep('initial');
                setMobileOtp('');
            } else {
                showErrorNotification('Invalid OTP');
            }
        } catch (error) {
            showErrorNotification('Verification failed');
        } finally {
            setIsVerifying(false);
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-forest-50/60 via-white to-mint-50/40 font-sans selection:bg-go-green-100 selection:text-forest-900">
            <Navbar />

            {/* Notification */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 right-4 z-50 ${typeof showNotification === 'object' && showNotification.error
                            ? 'bg-red-500'
                            : 'bg-[#1F3D2B]'
                            } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}
                    >
                        <span className="text-2xl">
                            {typeof showNotification === 'object' && showNotification.error ? '⚠️' : '✓'}
                        </span>
                        <span className="font-medium tracking-wide">
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
                        className="relative bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-[#1F3D2B]/5 mb-12"
                    >
                        {/* Elegant Cover Background */}
                        <div className="relative h-64 bg-[#1F3D2B] overflow-hidden">
                            <div className="absolute inset-0 opacity-40">
                                <Image
                                    src="/hills yelagiri.avif"
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B] via-transparent to-transparent"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-10 relative">
                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                {/* Profile Image / Avatar */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative flex-shrink-0 -mt-24"
                                >
                                    <div className="p-2 bg-white rounded-full shadow-2xl">
                                        <div className="w-44 h-44 rounded-full overflow-hidden relative bg-[#1F3D2B] flex items-center justify-center border-4 border-[#1F3D2B]/5">
                                            {user.avatar ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-5xl font-bold text-white tracking-widest">
                                                    {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'USER'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* User Details */}
                                <div className="flex-1 pb-2 w-full text-center md:text-left pt-6">
                                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 mb-3">
                                        <h1 className="text-4xl font-bold text-[#1F3D2B] drop-shadow-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                                            {user.name}
                                        </h1>
                                        {editForm.profileCompleted && (
                                            <span className="bg-[#1F3D2B] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-[#BFA76A] shadow-sm tracking-wider flex items-center gap-1" title="Profile Completed">
                                                ✓ VERIFIED
                                            </span>
                                        )}
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
                                                        className="px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-amber-100 transition-all"
                                                    >
                                                        📱 Verify Mobile
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[#5F6368] font-medium text-lg mb-5 flex items-center justify-center md:justify-start gap-2">
                                        <span>📧</span> {user.email}
                                    </p>
                                </div>

                                {/* Edit Button */}
                                <div className="mb-4 mt-6 w-full md:w-auto flex justify-center md:block">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowEditProfile(true)}
                                        className="px-8 py-3 bg-[#1F3D2B] text-white font-bold rounded-xl shadow-[0_10px_20px_-10px_rgba(31,61,43,0.4)] hover:shadow-[0_15px_30px_-10px_rgba(31,61,43,0.5)] transition-all text-sm uppercase tracking-wide flex items-center gap-2"
                                    >
                                        <span>✏️</span> Edit Profile
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Travel Stats - Minimalist */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-slate-100">
                            {[
                                { label: 'Places Visited', value: travelStats.placesVisited, icon: '📍' },
                                { label: 'Reviews', value: travelStats.reviewsWritten, icon: '⭐' },
                                { label: 'Bookings', value: travelStats.bookingsMade, icon: '🎫' },
                                { label: 'Favorites', value: travelStats.favoriteSpots, icon: '❤️' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center group cursor-default"
                                >
                                    <div className="text-3xl font-bold text-[#1F3D2B] mb-1 group-hover:scale-110 transition-transform duration-300">
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-[#5F6368] uppercase tracking-[0.15em] font-semibold">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tabs - Underlined Style */}
                    <div className="flex justify-center mb-10 border-b border-slate-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: '👤' },
                            { id: 'visited', label: 'Visited', icon: '📍' },
                            { id: 'wishlist', label: 'Bucket List', icon: '⭐' },
                            { id: 'preferences', label: 'Preferences', icon: '⚙️' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-4 font-medium text-sm transition-all relative ${activeTab === tab.id
                                    ? 'text-[#1F3D2B]'
                                    : 'text-[#5F6368] hover:text-[#1F3D2B]'
                                    }`}
                            >
                                <span className="mr-2 opacity-80">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#BFA76A]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* About Section */}
                                    <div className="bg-white rounded-3xl p-8 border border-[#1F3D2B]/5 shadow-sm">
                                        <h2 className="text-xl font-bold text-[#1F3D2B] mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                            <span className="p-2 bg-[#1F3D2B]/5 rounded-lg">📝</span> About Me
                                        </h2>
                                        <p className="text-[#5F6368] leading-relaxed mb-8 font-light italic">
                                            &quot;{editForm.bio}&quot;
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-[#FAFBF9] rounded-2xl border border-slate-100">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-slate-50">📧</div>
                                                <div>
                                                    <p className="text-[10px] text-[#BFA76A] uppercase tracking-wider font-bold">Email</p>
                                                    <p className="text-[#1F3D2B] font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                            {editForm.mobile && (
                                                <div className="flex items-center gap-4 p-4 bg-[#FAFBF9] rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-slate-50">📱</div>
                                                    <div>
                                                        <p className="text-[10px] text-[#BFA76A] uppercase tracking-wider font-bold">Mobile</p>
                                                        <p className="text-[#1F3D2B] font-medium">{editForm.mobile}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {editForm.bloodGroup && (
                                                <div className="flex items-center gap-4 p-4 bg-[#FAFBF9] rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-slate-50">🩸</div>
                                                    <div>
                                                        <p className="text-[10px] text-[#BFA76A] uppercase tracking-wider font-bold">Blood Group</p>
                                                        <p className="text-[#1F3D2B] font-medium">{editForm.bloodGroup}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {editForm.emergencyContact && (
                                                <div className="flex items-center gap-4 p-4 bg-[#FAFBF9] rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-slate-50">🆘</div>
                                                    <div>
                                                        <p className="text-[10px] text-[#BFA76A] uppercase tracking-wider font-bold">Emergency Contact</p>
                                                        <p className="text-[#1F3D2B] font-medium">{editForm.emergencyContact}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions - Tiles */}
                                    <div className="bg-white rounded-3xl p-8 border border-[#1F3D2B]/5 shadow-sm">
                                        <h2 className="text-xl font-bold text-[#1F3D2B] mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                            <span className="p-2 bg-[#1F3D2B]/5 rounded-lg">⚡</span> Quick Actions
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { label: 'My Bookings', icon: '🎫', href: '/my-bookings', desc: 'Manage your hotel stats' },
                                                { label: 'Favorites', icon: '❤️', href: '/favorites', desc: 'Your saved spots' },
                                                { label: 'Trip Planner', icon: '🗺️', href: '/trip-planner', desc: 'Create new itineraries' },
                                                { label: 'Budget Tracker', icon: '💰', href: '/budget-tracker', desc: 'Track your expenses' }
                                            ].map((action, i) => (
                                                <motion.button
                                                    key={action.label}
                                                    onClick={() => router.push(action.href)}
                                                    whileHover={{ scale: 1.01, backgroundColor: '#F5F7F5' }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 transition-all text-left bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
                                                >
                                                    <span className="text-2xl opacity-80 grayscale group-hover:grayscale-0">{action.icon}</span>
                                                    <div>
                                                        <span className="font-bold text-[#1F3D2B] block">{action.label}</span>
                                                        <span className="text-xs text-[#5F6368]">{action.desc}</span>
                                                    </div>
                                                    <span className="ml-auto text-slate-300">→</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'visited' && (
                                <div className="bg-white rounded-3xl p-8 border border-[#1F3D2B]/5 shadow-sm">
                                    <h2 className="text-xl font-bold text-[#1F3D2B] mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        <span className="p-2 bg-[#1F3D2B]/5 rounded-lg">📍</span> Places Visited
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {visitedPlaces.map((place, i) => (
                                            <div key={place.id} className="group relative p-6 rounded-2xl bg-[#FAFBF9] border border-slate-100 hover:border-[#BFA76A]/30 transition-all">
                                                <button
                                                    onClick={() => handleRemovePlace(place.id)}
                                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-500 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                                <div className="text-4xl mb-4 opacity-90">{place.icon}</div>
                                                <h3 className="font-bold text-[#1F3D2B] mb-1">{place.name}</h3>
                                                <p className="text-xs font-semibold text-[#BFA76A] uppercase tracking-wider">{place.date}</p>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setShowAddPlace(true)}
                                            className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#1F3D2B]/40 hover:text-[#1F3D2B] transition-all bg-transparent"
                                        >
                                            <span className="text-2xl mb-2 opacity-50">+</span>
                                            <span className="text-sm font-medium">Add Place</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div className="bg-white rounded-3xl p-8 border border-[#1F3D2B]/5 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-bold text-[#1F3D2B]">Bucket List</h2>
                                        <button
                                            onClick={() => setShowAddBucketItem(true)}
                                            className="px-5 py-2 bg-[#1F3D2B] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                                        >
                                            Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {bucketList.filter(item => !item.completed).map((item) => (
                                            <div key={item.id} className="flex items-center gap-5 p-5 rounded-2xl bg-[#FAFBF9] border border-slate-100 hover:shadow-sm transition-all">
                                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-50">{item.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-[#1F3D2B]">{item.name}</h3>
                                                    <p className="text-xs text-[#5F6368] mt-0.5">{item.category}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleMarkDone(item.id)}
                                                        className="px-4 py-2 bg-white border border-slate-200 text-[#1F3D2B] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#1F3D2B] hover:text-white transition-all"
                                                    >
                                                        Mark Done
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveBucketItem(item.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {bucketList.filter(item => item.completed).length > 0 && (
                                            <div className="pt-8 mt-8 border-t border-slate-100">
                                                <h3 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider mb-6 opacity-60">Completed</h3>
                                                <div className="space-y-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                                                    {bucketList.filter(item => item.completed).map((item) => (
                                                        <div key={item.id} className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                            <div className="text-2xl">{item.icon}</div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-slate-700 line-through">{item.name}</h3>
                                                            </div>
                                                            <span className="text-[#1F3D2B]">✓</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="bg-white rounded-3xl p-8 border border-[#1F3D2B]/5 shadow-sm">
                                    <h2 className="text-xl font-bold text-[#1F3D2B] mb-8">Travel Preferences</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'budget', label: 'Budget Range', value: travelPreferences.budget, icon: '💰', options: ['Budget', 'Moderate', 'Luxury'] },
                                            { key: 'adventureLevel', label: 'Adventure Level', value: travelPreferences.adventureLevel, icon: '🎢', options: ['Low', 'Medium', 'High', 'Extreme'] },
                                            { key: 'accommodation', label: 'Accommodation', value: travelPreferences.accommodation, icon: '🏨', options: ['Hotels', 'Resorts', 'Homestays', 'Camping'] },
                                            { key: 'travelStyle', label: 'Travel Style', value: travelPreferences.travelStyle, icon: '✈️', options: ['Explorer', 'Relaxer', 'Adventurer', 'Cultural'] }
                                        ].map((pref) => (
                                            <div key={pref.key} className="p-6 bg-[#FAFBF9] rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="text-3xl opacity-80">{pref.icon}</div>
                                                    <div>
                                                        <p className="text-xs text-[#5F6368] uppercase tracking-wider font-bold">{pref.label}</p>
                                                        <p className="text-lg font-bold text-[#1F3D2B]">{pref.value}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowEditPreference(pref)}
                                                    className="w-full py-2 bg-white border border-slate-200 text-xs font-bold text-[#5F6368] uppercase tracking-wider rounded-lg hover:border-[#BFA76A] hover:text-[#BFA76A] transition-all"
                                                >
                                                    Edit Preference
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence >
                </div >
            </main >


            <Footer />

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {showEditProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowEditProfile(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] max-w-2xl w-full p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                                <h2 className="text-2xl font-bold text-[#1F3D2B] flex items-center gap-2">
                                    <span className="p-2 bg-[#1F3D2B]/10 rounded-lg text-xl">✏️</span> Edit Profile
                                </h2>
                                <button onClick={() => setShowEditProfile(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    ✕
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Left Column: Image Upload */}
                                <div className="md:col-span-1 flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1F3D2B]/10 shadow-lg relative bg-[#1F3D2B] flex items-center justify-center">
                                            {profileImage || editForm.image || user.avatar ? (
                                                <Image
                                                    src={profileImage || editForm.image || user.avatar}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-4xl font-bold text-white tracking-widest">
                                                    {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ME'}
                                                </span>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-[#5F6368] text-center max-w-[150px]">
                                        Click image to update your avatar
                                    </p>
                                </div>

                                {/* Right Column: Form Fields */}
                                <div className="md:col-span-2 space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#FAFBF9] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]/20 focus:border-[#1F3D2B]"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2 flex justify-between items-center">
                                            <span>Email Address</span>
                                            {editForm.emailVerified ? (
                                                <span className="text-green-600 flex items-center gap-1 text-[10px]">
                                                    Verified ✅
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setVerificationStep('initial');
                                                        setShowEmailVerification(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700 text-[10px] font-bold"
                                                >
                                                    VERIFY NOW
                                                </button>
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email || user?.email || ''}
                                            disabled
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2 flex justify-between items-center">
                                                <span>Mobile Number</span>
                                                {editForm.mobileVerified ? (
                                                    <span className="text-green-600 flex items-center gap-1 text-[10px]">
                                                        Verified ✅
                                                    </span>
                                                ) : (
                                                    editForm.mobile && editForm.mobile.length === 10 && (
                                                        <button
                                                            onClick={() => {
                                                                setVerificationStep('initial');
                                                                setShowMobileVerification(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-700 text-[10px] font-bold"
                                                        >
                                                            VERIFY
                                                        </button>
                                                    )
                                                )}
                                            </label>
                                            <input
                                                type="tel"
                                                value={editForm.mobile}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    setEditForm({ ...editForm, mobile: value });
                                                }}
                                                maxLength={10}
                                                placeholder="9876543210"
                                                className={`w-full px-4 py-3 bg-[#FAFBF9] border rounded-xl focus:outline-none focus:ring-2 ${editForm.mobile && !validateMobile(editForm.mobile)
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-slate-200 focus:ring-[#1F3D2B]/20 focus:border-[#1F3D2B]'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2">Blood Group</label>
                                            <select
                                                value={editForm.bloodGroup}
                                                onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#FAFBF9] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]/20 focus:border-[#1F3D2B]"
                                            >
                                                <option value="">Select</option>
                                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2">Emergency Contact</label>
                                        <input
                                            type="tel"
                                            value={editForm.emergencyContact}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setEditForm({ ...editForm, emergencyContact: value });
                                            }}
                                            maxLength={10}
                                            placeholder="Parent/Spouse Number"
                                            className={`w-full px-4 py-3 bg-[#FAFBF9] border rounded-xl focus:outline-none focus:ring-2 ${editForm.emergencyContact && !validateMobile(editForm.emergencyContact)
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-slate-200 focus:ring-[#1F3D2B]/20 focus:border-[#1F3D2B]'
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-2">Bio</label>
                                        <textarea
                                            value={editForm.bio}
                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-[#FAFBF9] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]/20 focus:border-[#1F3D2B] custom-scrollbar"
                                            placeholder="Share a bit about yourself..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wide text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditProfile}
                                    className="flex-[2] px-6 py-4 bg-[#1F3D2B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-sm"
                                >
                                    Save Changes
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
                                    className="flex-1 px-6 py-3 bg-[#1F3D2B] text-white font-bold rounded-xl hover:bg-[#163320] transition-all uppercase tracking-wider text-sm"
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
                                    className="flex-1 px-6 py-3 bg-[#BFA76A] text-white font-bold rounded-xl hover:bg-[#a38d53] transition-all uppercase tracking-wider text-sm"
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

            {/* Email Verification Modal */}
            <AnimatePresence>
                {showEmailVerification && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEmailVerification(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6"
                        >
                            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">Verify Email</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                {verificationStep === 'initial'
                                    ? `Send a verification code to ${user.email}`
                                    : `Enter the code sent to ${user.email}`}
                            </p>

                            {verificationStep === 'initial' ? (
                                <button
                                    onClick={handleSendEmailOtp}
                                    disabled={isVerifying}
                                    className="w-full py-3 bg-[#1F3D2B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                                >
                                    {isVerifying ? 'Sending...' : 'Send Verification Code'}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl tracking-widest font-mono uppercase focus:ring-2 focus:ring-[#1F3D2B]"
                                        placeholder="AB1234"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyEmailOtp}
                                        disabled={isVerifying || emailOtp.length !== 6}
                                        className="w-full py-3 bg-[#1F3D2B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                                    >
                                        {isVerifying ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Verification Modal */}
            <AnimatePresence>
                {showMobileVerification && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileVerification(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6"
                        >
                            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2">Verify Mobile</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                {verificationStep === 'initial'
                                    ? `Send verification code to ${editForm.mobile}`
                                    : `Enter the code sent to ${editForm.mobile}`}
                            </p>

                            {verificationStep === 'initial' ? (
                                <button
                                    onClick={handleSendMobileOtp}
                                    disabled={isVerifying}
                                    className="w-full py-3 bg-[#1F3D2B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                                >
                                    {isVerifying ? 'Sending...' : 'Send SMS Code'}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={mobileOtp}
                                        onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-[#1F3D2B]"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyMobileOtp}
                                        disabled={isVerifying || mobileOtp.length !== 6}
                                        className="w-full py-3 bg-[#1F3D2B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                                    >
                                        {isVerifying ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
