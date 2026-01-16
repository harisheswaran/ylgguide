'use client';

import { 
    MapPin, Clock, Star, Shield, Smartphone, 
    Wifi, Snowflake, Briefcase, Info, Phone, 
    Navigation, AlertTriangle, CheckCircle,
    ArrowRight, Map
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TransportCard({ item, onSelect, isDriverSection = false }) {
    const { user } = useAuth();
    const router = useRouter();
    
    // Status Badge Logic
    const getStatusBadge = (status) => {
        if (!status) return null;
        const normalizedStatus = status.toLowerCase();
        
        if (['on time', 'available', 'free'].includes(normalizedStatus)) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold tracking-wide border border-emerald-500/20 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {status.toUpperCase()}
                </span>
            );
        } else if (['busy', 'on trip'].includes(normalizedStatus)) {
             return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-700 text-[10px] font-bold tracking-wide border border-orange-500/20 backdrop-blur-md">
                    <Clock className="w-3 h-3" />
                    {status.toUpperCase()}
                </span>
            );
        } else if (normalizedStatus === 'delayed') {
            return (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold tracking-wide border border-rose-500/20 backdrop-blur-md">
                    <AlertTriangle className="w-3 h-3" />
                    DELAYED
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold tracking-wide border border-blue-500/20 backdrop-blur-md">
                    {status.toUpperCase()}
                </span>
            );
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 border overflow-hidden ${isDriverSection ? 'border-[#BFA76A]/30' : 'border-slate-100/60'}`}
        >
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Image Section */}
                <div className="relative w-full md:w-64 h-56 md:h-auto shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-100">
                    <Image 
                        src={item.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                         <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider ${isDriverSection ? 'bg-[#1F3D2B] text-white' : 'bg-white/90 text-[#1F3D2B]'}`}>
                            {item.category}
                        </span>
                        {item.liveUpdates?.weatherCondition && (
                            <span className="px-3 py-1 bg-sky-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/10 shadow-lg flex items-center gap-1 w-fit">
                                <Snowflake className="w-3 h-3" /> {item.liveUpdates.weatherCondition}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                    
                    {/* Header */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1F3D2B] tracking-tight group-hover:text-[#BFA76A] transition-colors">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.vehicleModel || item.vehicleType}</span>
                                    {(item.driverDetails?.isVerified || item.operator?.verified) && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#BFA76A]/10 text-[#96824d] rounded text-[10px] font-bold uppercase border border-[#BFA76A]/20">
                                            <CheckCircle className="w-3 h-3" /> Verified {isDriverSection ? 'Expert' : 'Partner'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                {/* Price */}
                                <div className="text-right">
                                    <p className="text-2xl font-extrabold text-[#1F3D2B]">
                                        ₹{item.pricingDetails?.amount || item.price?.amount || 0}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                        {item.pricingDetails?.unit || item.price?.unit}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status & Live Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             {getStatusBadge(item.liveUpdates?.status || item.realTime?.status || item.availability?.status)}
                            
                            {item.liveUpdates?.trafficStatus && item.liveUpdates.trafficStatus !== 'N/A' && (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-[1px] bg-slate-200"></div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        item.liveUpdates.trafficStatus === 'Clear' ? 'bg-green-100 text-green-700 border-green-200' : 
                                        item.liveUpdates.trafficStatus === 'Heavy' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                                    }`}>
                                        Traffic: {item.liveUpdates.trafficStatus}
                                    </span>
                                </div>
                            )}

                             {item.liveUpdates?.etaToPickup && (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> ETA: <span className="text-slate-800">{item.liveUpdates.etaToPickup}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Safari Specific: Covered Spots */}
                        {item.safariDetails && (
                            <div className="mb-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                <p className="text-xs font-bold text-amber-800/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Map className="w-3 h-3" /> Safari Route
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {item.safariDetails.coveredSpots?.map((spot, idx) => (
                                        <span key={idx} className="bg-white/80 px-3 py-1 rounded-lg text-xs font-medium text-amber-900 border border-amber-100/50 shadow-sm">
                                            {spot}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Driver Specific: Info - Prominent Display */}
                        {isDriverSection && item.driverDetails && (
                            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Experience</p>
                                    <p className="text-sm font-bold text-slate-700">{item.driverDetails.experience}</p>
                                </div>
                                <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-center col-span-2">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Languages</p>
                                    <p className="text-sm font-bold text-slate-700">{item.driverDetails.languages?.join(', ')}</p>
                                </div>
                                <div className="px-3 py-2 bg-[#BFA76A]/10 rounded-xl border border-[#BFA76A]/20 text-center">
                                    <p className="text-[10px] uppercase text-[#BFA76A] font-bold mb-1">Rating</p>
                                    <p className="text-sm font-bold text-[#96824d] flex items-center justify-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> {item.ratings?.overall || item.ratings?.safety}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Bus Route Info */}
                        {item.route?.from && (
                            <div className="flex items-center gap-3 mb-4 text-sm text-slate-600 bg-white/50 w-fit rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#1F3D2B]"></div>
                                    <span className="font-semibold">{item.route.from}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full border-2 border-[#1F3D2B]"></div>
                                    <span className="font-semibold">{item.route.to}</span>
                                </div>
                                <span className="text-xs text-slate-400 ml-2">({item.route.duration})</span>
                            </div>
                        )}

                        {/* Amenities / Features */}
                        <div className="flex flex-wrap gap-2">
                             {Object.entries(item.vehicleFeatures || item.features || {}).map(([key, val]) => {
                                 if (!val || key === 'luggage') return null;
                                 let icon = <Info className="w-3 h-3" />;
                                 let text = key;
                                 if (key === 'isAC') { icon = <Snowflake className="w-3 h-3" />; text = 'AC'; }
                                 if (key === 'gps') { icon = <Navigation className="w-3 h-3" />; text = 'GPS'; }
                                 if (key === 'wifi') { icon = <Wifi className="w-3 h-3" />; text = 'WiFi'; }
                                 if (key === 'musicSystem') { icon = <Smartphone className="w-3 h-3" />; text = 'Music'; }
                                 
                                 return (
                                    <span key={key} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold border border-slate-100">
                                        {icon} {text}
                                    </span>
                                 );
                             })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0">
                         {(item.contactDetails?.phone || item.operator?.contact) && (
                            <a 
                                href={`tel:${item.contactDetails?.phone || item.operator?.contact}`}
                                className="p-3 rounded-xl bg-slate-50 text-[#1F3D2B] hover:bg-slate-100 transition-colors border border-slate-100"
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        router.push(`/signin?redirect=/transport`);
                                    }
                                    e.stopPropagation();
                                }}
                            >
                                <Phone className="w-4 h-4" />
                            </a>
                        )}
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!user) {
                                    router.push(`/signin?redirect=/transport`);
                                    return;
                                }
                                onSelect?.(item);
                            }}
                            className="px-6 py-3 bg-[#1F3D2B] hover:bg-[#162e20] text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            View Details <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
