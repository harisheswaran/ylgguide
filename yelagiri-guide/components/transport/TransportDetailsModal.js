'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, MapPin, Navigation, Phone, Globe, Star, 
    ArrowRight, Info, Car, Fuel, Users, CreditCard,
    Map as MapIcon, Shield, Check, Clock, AlertCircle, 
    Zap, Sparkles, MessageSquare, ExternalLink,
    ShieldCheck, Bus, Cloud
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TransportDetailsModal({ item, onClose }) {
    const { user } = useAuth();
    const router = useRouter();
    if (!item) return null;

    // Helper to render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
            />
        ));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="w-full max-w-2xl bg-[#FAFBF9] h-full shadow-[-20px_0_50px_rgba(0,0,0,0.2)] overflow-y-auto scrollbar-hide"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Hero Section with Parallax Effect */}
                    <div className="relative h-80 w-full overflow-hidden">
                        <motion.div 
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={item.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBF9] via-black/20 to-black/40"></div>
                        
                        {/* Top Controls */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                            <button 
                                onClick={onClose}
                                className="p-3 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/30 transition-all border border-white/20 shadow-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white/10 backdrop-blur-xl text-white rounded-full hover:bg-white/30 transition-all border border-white/20 shadow-xl">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="absolute bottom-10 left-8 text-white">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="px-4 py-1.5 bg-[#BFA76A] text-[#1F3D2B] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3 inline-block shadow-lg">
                                    {item.category}
                                </span>
                                <h1 className="text-4xl font-black mb-2 drop-shadow-lg tracking-tight">{item.name}</h1>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    {item.ratings?.overall && (
                                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                            <div className="flex gap-0.5">{renderStars(item.ratings.overall)}</div>
                                            <span className="font-bold">{item.ratings.overall}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-white/90">
                                        <Clock className="w-4 h-4 text-[#BFA76A]" />
                                        <span>{item.availability?.operatingHours || '24/7 Available'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Layers */}
                    <div className="p-8 space-y-12">
                        
                        {/* 1. Real-Time Status Card */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 -mt-16 relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-bold text-[#1F3D2B]">{item.realTime?.status || item.liveUpdates?.status || 'Available'}</span>
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                                    <span className="font-bold text-[#1F3D2B]">~15 Mins</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Count</p>
                                    <span className="font-bold text-[#1F3D2B]">{item.fleet?.length || 'Single Provider'}</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Score</p>
                                    <div className="flex items-center justify-center md:justify-start gap-1">
                                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-[#1F3D2B]">4.9/5</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Fleet Catalog */}
                        {item.fleet && item.fleet.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-[#1F3D2B] flex items-center gap-3">
                                        <div className="p-2 bg-[#BFA76A]/10 rounded-xl">
                                            <Car className="w-6 h-6 text-[#96824d]" />
                                        </div>
                                        Choose Your Vehicle
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {item.fleet.map((vehicle, idx) => (
                                        <motion.div 
                                            key={idx} 
                                            whileHover={{ x: 10 }}
                                            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-lg shadow-slate-200/20 group cursor-pointer transition-all hover:border-[#1F3D2B]/30"
                                        >
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="relative w-full md:w-32 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                                                    <Image 
                                                        src={vehicle.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80'} 
                                                        alt={vehicle.model} 
                                                        fill 
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="text-lg font-black text-[#1F3D2B]">{vehicle.model}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 uppercase">{vehicle.category}</span>
                                                                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium italic"><Sparkles className="w-3 h-3"/> Top Rated</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-black text-[#1F3D2B]">₹{vehicle.price}</p>
                                                            <p className="text-[10px] font-bold text-[#BFA76A] uppercase tracking-wider">{vehicle.priceUnit}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                            <Users className="w-4 h-4 text-[#1F3D2B]" /> {vehicle.capacity} Seats
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                            <Fuel className="w-4 h-4 text-[#1F3D2B]" /> {vehicle.fuelType}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                            <Shield className="w-4 h-4 text-[#1F3D2B]" /> Fully Insured
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 4. Safari Expedition Details */}
                        {item.safariDetails && (
                            <section>
                                <h3 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-xl">
                                        <MapIcon className="w-6 h-6 text-amber-600" />
                                    </div>
                                    Safari Itinerary
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-6">Key Destinations</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {item.safariDetails.coveredSpots?.map((spot, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-amber-100 shadow-sm">
                                                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                                                    <span className="text-sm font-bold text-amber-900">{spot}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Duration</p>
                                            <p className="font-black text-[#1F3D2B]">{item.safariDetails.duration}</p>
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Best Time</p>
                                            <p className="font-black text-[#1F3D2B]">{item.safariDetails.bestTime}</p>
                                        </div>
                                        <div className="bg-[#1F3D2B] p-5 rounded-2xl border border-[#162e20] text-white col-span-2 md:col-span-1">
                                            <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Group Size</p>
                                            <p className="font-black">Up to {item.capacity || 6} Pax</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 5. Bus Route & Connectivity */}
                        {item.route && (
                            <section>
                                <h3 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-xl">
                                        <Bus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    Route Intelligence
                                </h3>
                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                                    <div className="flex items-center justify-between mb-8 px-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Departure</p>
                                            <p className="text-lg font-black text-[#1F3D2B]">{item.route.from}</p>
                                        </div>
                                        <div className="flex-1 px-8 relative">
                                            <div className="h-[2px] bg-slate-100 w-full relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Arrival</p>
                                            <p className="text-lg font-black text-[#1F3D2B]">{item.route.to}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Stop Breakdown</p>
                                        <div className="flex flex-wrap gap-2 px-4">
                                            {item.route.stops?.map((stop, i) => (
                                                <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">{stop}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 6. Driver & Service Excellence */}
                        {item.driverDetails && (
                            <section>
                                <h3 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-[#1F3D2B]/10 rounded-xl">
                                        <MessageSquare className="w-6 h-6 text-[#1F3D2B]" />
                                    </div>
                                    Driver Profile
                                </h3>
                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA76A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex flex-col md:flex-row gap-8 items-center cursor-default">
                                        <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                                            <Image src={item.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'} alt="Driver" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                                {item.driverDetails.isVerified && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1.5"><Check className="w-3 h-3" /> Identity Verified</span>}
                                                {item.driverDetails.isLicensed && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1.5"><Shield className="w-3 h-3" /> Professional License</span>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Driving Experience</p>
                                                    <p className="text-2xl font-black text-[#1F3D2B]">{item.driverDetails.experience}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bilingual Mastery</p>
                                                    <p className="text-sm font-bold text-[#1F3D2B] leading-tight">{item.driverDetails.languages?.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 4. Live Journey Tracker (Same as before but polished) */}
                        {item.liveUpdates && (
                            <section className="relative overflow-hidden bg-[#1F3D2B] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#1F3D2B]/30">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <MapIcon className="w-48 h-48 rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                                        <h3 className="text-xl font-bold tracking-tight">Live Journey Analytics</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                                        <div>
                                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-3">Live ETA</p>
                                            <p className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">{item.liveUpdates.etaToPickup || 'Live'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-3">Geo-Location</p>
                                            <p className="text-sm font-bold truncate">{item.liveUpdates.currentLocation || 'Updating...'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-3">Traffic Load</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.liveUpdates.trafficStatus === 'Clear' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>{item.liveUpdates.trafficStatus}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-3">Atmosphere</p>
                                            <p className="text-sm font-bold flex items-center gap-2"><Cloud className="w-4 h-4 text-sky-400" /> {item.liveUpdates.weatherCondition || 'Normal'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 5. Pricing & Special Conditions */}
                        <section>
                            <h3 className="text-xl font-black text-[#1F3D2B] mb-6">Price Transparency</h3>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-4">
                                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-500">Base Fare ({item.pricingDetails?.unit || 'Flat'})</span>
                                    <span className="text-lg font-black text-[#1F3D2B]">₹{item.pricingDetails?.amount || item.price?.amount || '0'}</span>
                                </div>
                                {item.pricingDetails?.perKmRate && (
                                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Additional Kilometers</span>
                                        <span className="text-sm font-black text-[#1F3D2B]">₹{item.pricingDetails.perKmRate} / km</span>
                                    </div>
                                )}
                                {item.pricingDetails?.driverAllowance && (
                                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">Driver Bata (Outstation)</span>
                                        <span className="text-sm font-black text-[#1F3D2B]">₹{item.pricingDetails.driverAllowance} / day</span>
                                    </div>
                                )}
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 italic">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                    <p className="text-xs text-amber-800 font-medium">Tolls, State Permits, and Parking charges are actuals. Night driving surcharge may apply after 10 PM.</p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Safety Protocol */}
                        <section className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
                            <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" /> 
                                Safety & Hygiene Protocol
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: <Zap className="w-4 h-4" />, text: 'Daily Cabin Sanitization' },
                                    { icon: <Users className="w-4 h-4" />, text: 'Staff Background Checked' },
                                    { icon: <MapPin className="w-4 h-4" />, text: '24/7 GPS Tracking Enabled' },
                                    { icon: <Shield className="w-4 h-4" />, text: 'No-Contact Ride Options' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl shadow-sm border border-emerald-50 transition-all hover:scale-105">
                                        <div className="p-2 bg-emerald-500 text-white rounded-lg">{s.icon}</div>
                                        <span className="text-sm font-bold text-emerald-800">{s.text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 7. Location & Navigation */}
                        <section>
                            <h3 className="text-xl font-black text-[#1F3D2B] mb-6 flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-red-500" /> Pickup Hub
                            </h3>
                             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl overflow-hidden relative">
                                <p className="font-bold text-[#1F3D2B] text-lg mb-2">{item.locationDetails?.address || 'Athanavoor Main Road, Yelagiri'}</p>
                                <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed italic">{item.locationDetails?.landmarks || 'Near Boat House Entrance'}</p>
                                
                                <div className="relative h-48 w-full rounded-2xl bg-slate-100 shadow-inner overflow-hidden border border-slate-100 group">
                                    <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                                         <MapIcon className="w-12 h-12 text-slate-300" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                         <div className="p-4 bg-red-500 rounded-full shadow-2xl animate-bounce">
                                            <MapPin className="w-8 h-8 text-white" />
                                         </div>
                                    </div>
                                </div>
                                
                                <a 
                                    href={item.locationDetails?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${item.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-8 w-full py-5 bg-[#1F3D2B] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#162e20] shadow-xl transition-all"
                                >
                                    <Navigation className="w-5 h-5" /> Open In Google Maps
                                </a>
                             </div>
                        </section>

                        {/* Padding for persistent footer */}
                        <div className="h-24"></div>
                    </div>

                    {/* Fixed Action Bar */}
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed bottom-0 w-full max-w-2xl bg-white/80 backdrop-blur-2xl border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 z-[110] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
                    >
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Starting From</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#1F3D2B]">₹{item.pricingDetails?.amount || item.price?.amount || '0'}</span>
                                <span className="text-sm font-bold text-[#BFA76A] uppercase tracking-tighter">All Incl.</span>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto flex-1">
                            <a 
                                href={`tel:${item.contactDetails?.phone || item.operator?.contact}`}
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        router.push(`/signin?redirect=/transport`);
                                    }
                                }}
                                className="w-full py-5 rounded-[2rem] bg-[#1F3D2B] text-white font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-[#162e20] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                <Phone className="w-5 h-5" /> Call to Book Contact Now
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Sub-components as needed
function Badge({ children, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        slate: 'bg-slate-50 text-slate-700 border-slate-100'
    };
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[color]}`}>
            {children}
        </span>
    );
}
