'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransportCard from '@/components/transport/TransportCard';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    Search, Map as MapIcon, List, Filter, 
    Bus, Car, Bike, Info, ShieldCheck, 
    AlertTriangle, Cloud, Star, CheckCircle,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import TransportDetailsModal from '@/components/transport/TransportDetailsModal';

const MapSection = dynamic(() => import('@/components/transport/MapSection'), { ssr: false });

export default function TransportPage() {
    const [viewMode, setViewMode] = useState('list');
    const [activeCategory, setActiveCategory] = useState('All');
    const [transportData, setTransportData] = useState([]);
    const [driversData, setDriversData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState({
        vehicleType: '',
        isAC: false,
        wifi: false,
        gps: false,
        minPrice: '',
        maxPrice: '',
        minRating: 0,
        capacity: ''
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. Fetch General Transport (Paginated)
                let generalUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transport?limit=10&page=${currentPage}`;
                
                // Exclude 'Private Drivers' from general list if 'All' is selected
                if (activeCategory === 'All') {
                    generalUrl += `&excludeCategory=Private+Drivers`;
                } else if (activeCategory !== 'Private Drivers') {
                    generalUrl += `&category=${encodeURIComponent(activeCategory)}`;
                } else {
                    // If only 'Private Drivers' is selected, general list is empty
                    setTransportData([]);
                    setTotalRecords(0);
                    setTotalPages(1);
                }

                if (activeCategory !== 'Private Drivers') {
                    if (filters.vehicleType) generalUrl += `&type=${filters.vehicleType}`;
                    if (filters.isAC) generalUrl += `&isAC=true`;
                    if (filters.wifi) generalUrl += `&wifi=true`;
                    if (filters.gps) generalUrl += `&gps=true`;
                    if (filters.minPrice) generalUrl += `&minPrice=${filters.minPrice}`;
                    if (filters.maxPrice) generalUrl += `&maxPrice=${filters.maxPrice}`;
                    if (filters.minRating > 0) generalUrl += `&rating=${filters.minRating}`;
                    if (filters.capacity) generalUrl += `&capacity=${filters.capacity}`;

                    const resGeneral = await fetch(generalUrl);
                    const jsonGeneral = await resGeneral.json();
                    if (jsonGeneral.success) {
                        setTransportData(jsonGeneral.data);
                        setTotalRecords(jsonGeneral.total);
                        setTotalPages(jsonGeneral.pagination.totalPages);
                    }
                }

                // 2. Fetch Private Drivers (Separate section)
                if (activeCategory === 'All' || activeCategory === 'Private Drivers') {
                    let driversUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transport?category=Private+Drivers`;
                    
                    // Apply filters to drivers too if applicable
                    if (filters.minPrice) driversUrl += `&minPrice=${filters.minPrice}`;
                    if (filters.maxPrice) driversUrl += `&maxPrice=${filters.maxPrice}`;
                    if (filters.minRating > 0) driversUrl += `&rating=${filters.minRating}`;

                    const resDrivers = await fetch(driversUrl);
                    const jsonDrivers = await resDrivers.json();
                    if (jsonDrivers.success) {
                        setDriversData(jsonDrivers.data);
                    }
                } else {
                    setDriversData([]);
                }

            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [activeCategory, currentPage, filters]);

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
        setCurrentPage(1);
    };

    // Derived State
    const categories = ['All', 'Rental Cars', 'Rental Bikes', 'Public City Buses', 'Intercity Buses', 'Taxi Services', 'Jeep Safari', 'Private Drivers'];
    const filteredData = transportData.filter(item => activeCategory === 'All' || item.category === activeCategory);

    const filterContent = (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1F3D2B]">Filters</h3>
                <button 
                    onClick={() => setFilters({
                        vehicleType: '', isAC: false, wifi: false, gps: false,
                        minPrice: '', maxPrice: '', minRating: 0, capacity: ''
                    })}
                    className="text-xs font-bold text-slate-400 hover:text-[#1F3D2B]"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 block">Vehicle Type</label>
                    <div className="flex flex-wrap gap-2">
                        {['SUV', 'Sedan', 'Hatchback', 'Bus', 'Bike'].map(type => (
                            <button 
                                key={type} 
                                onClick={() => handleFilterChange('vehicleType', filters.vehicleType === type ? '' : type)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${filters.vehicleType === type ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 block">Price Range (₹)</label>
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="number" 
                            placeholder="Min" 
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all" 
                        />
                        <input 
                            type="number" 
                            placeholder="Max" 
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#1F3D2B] focus:border-transparent outline-none transition-all" 
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 block">Minimum Rating</label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleFilterChange('minRating', filters.minRating === star ? 0 : star)}
                                className={`p-2 rounded-lg transition-all ${filters.minRating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                            >
                                <Star className={`w-5 h-5 ${filters.minRating >= star ? 'fill-current' : ''}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 block">Amenities</label>
                    <div className="space-y-3">
                            {[
                            { id: 'isAC', label: 'AC' },
                            { id: 'wifi', label: 'WiFi' },
                            { id: 'gps', label: 'GPS Tracking' }
                            ].map(opt => (
                            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={filters[opt.id]} 
                                    onChange={() => handleFilterChange(opt.id, !filters[opt.id])}
                                />
                                <div className={`w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center ${filters[opt.id] ? 'bg-[#1F3D2B] border-[#1F3D2B]' : 'border-slate-200 group-hover:border-[#1F3D2B]'}`}>
                                    {filters[opt.id] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-sm font-medium transition-colors ${filters[opt.id] ? 'text-[#1F3D2B]' : 'text-slate-600 group-hover:text-[#1F3D2B]'}`}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFBF9] font-sans">
            <Navbar dark={true} />
            <div className="lg:hidden fixed bottom-6 left-6 z-50">
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 px-6 py-4 bg-white text-[#1F3D2B] rounded-full shadow-2xl border border-slate-100 font-black text-xs uppercase tracking-widest transition-transform active:scale-95"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Mobile Filter Drawer Overlay */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        className="w-[85%] max-w-sm h-full bg-white p-8 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#1F3D2B]">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <List className="w-5 h-5 text-slate-400 rotate-45" />
                            </button>
                        </div>
                        {/* Recycled Filter Content for Mobile */}
                        {filterContent}
                    </motion.div>
                </div>
            )}

            {/* Cinematic Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
                    alt="Travel"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#FAFBF9]"></div>
                
                <div className="relative z-10 container mx-auto px-4 text-center mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                            Move Freely.
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                            From local rentals to intercity buses, find your perfect ride across Yelagiri.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
                
                {/* Category Pills - Floating */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100/50 inline-flex flex-wrap justify-center gap-2">
                         {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                                    activeCategory === cat 
                                    ? 'bg-[#1F3D2B] text-white shadow-lg transform scale-105' 
                                    : 'bg-transparent text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Modern Glassy Sidebar */}
                    <div className="hidden lg:block w-80 shrink-0 sticky top-24 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                             {filterContent}
                        </div>
                        
                        {/* Promo / Tip Card */}
                        <div className="bg-gradient-to-br from-[#1F3D2B] to-[#2a523a] rounded-[2rem] p-8 text-white text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                             <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-[#BFA76A]" />
                             <h3 className="text-xl font-bold mb-2">Verified Operators</h3>
                             <p className="text-sm text-white/80 mb-6">All transport services listed are verified for safety and quality.</p>
                             <button className="text-xs font-bold uppercase tracking-widest text-[#BFA76A] hover:text-white transition-colors">
                                Learn More
                             </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1 w-full space-y-12">
                        {/* View Controls & Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black text-[#1F3D2B]">
                                    {activeCategory === 'All' ? 'Transport Options' : activeCategory}
                                </h2>
                                <p className="text-sm text-slate-400 font-bold">
                                    Showing {transportData.length} results in Yelagiri
                                </p>
                            </div>
                            
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                {[
                                    { id: 'list', icon: List, label: 'List View' },
                                    { id: 'map', icon: MapIcon, label: 'Map View' }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setViewMode(mode.id)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                                            viewMode === mode.id 
                                            ? 'bg-white text-[#1F3D2B] shadow-md' 
                                            : 'text-slate-500 hover:text-[#1F3D2B]'
                                        }`}
                                    >
                                        <mode.icon className="w-4 h-4" />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-12">
                            {loading ? (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 border-4 border-[#1F3D2B]/20 border-t-[#1F3D2B] rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-slate-400 font-medium animate-pulse">Finding best rides...</p>
                                </div>
                            ) : viewMode === 'map' ? (
                                <div className="h-[600px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl bg-white relative">
                                    <MapSection data={transportData} onSelect={(item) => setSelectedTransport(item)} />
                                    <div className="absolute top-6 left-6 z-[100] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-lg pointer-events-none">
                                        <p className="text-[10px] font-black text-[#1F3D2B] uppercase tracking-widest">Interactive Map</p>
                                        <p className="text-[9px] text-slate-500 font-bold">Select markers for details</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Bus Stand Status Board */}
                                    {(activeCategory.includes('Bus') || activeCategory === 'All') && (
                                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 overflow-hidden relative">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-black text-[#1F3D2B] flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                                        <Bus className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    Bus Status Board
                                                </h3>
                                                <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold">LIVE</div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {transportData.filter(i => i.category.includes('Bus')).slice(0, 4).map((bus, idx) => (
                                                    <div key={`status-${idx}`} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all">
                                                        <div className="flex gap-3">
                                                            <div className="mt-1">
                                                                <Bus className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-black text-[#1F3D2B]">{bus.name.split(' ').pop()}</h4>
                                                                <p className="text-[10px] text-slate-500 font-bold">To {bus.route?.to || 'Base'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-[10px] font-black ${bus.liveUpdates?.status === 'Delayed' ? 'text-red-500' : 'text-[#3B82F6]'}`}>
                                                                {bus.liveUpdates?.status === 'Delayed' ? 'DELAYED' : bus.liveUpdates?.etaToPickup || 'ON TIME'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-16">
                                        {/* Transport Results Section */}
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-8 bg-[#1F3D2B] rounded-full"></div>
                                                    <h3 className="text-lg font-black text-[#1F3D2B] uppercase tracking-tighter">
                                                        {activeCategory === 'Private Drivers' ? 'No General Transports' : 'Transport Services'}
                                                    </h3>
                                                </div>
                                                <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400">
                                                    {totalRecords} results found
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-6">
                                                {transportData.map((item, idx) => (
                                                    <TransportCard 
                                                        key={`${item._id}-${idx}`} 
                                                        item={item} 
                                                        isDriverSection={false}
                                                        onSelect={(item) => setSelectedTransport(item)} 
                                                    />
                                                ))}
                                                
                                                {transportData.length === 0 && activeCategory !== 'Private Drivers' && (
                                                    <div className="p-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                                        <AlertTriangle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No general services found</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pagination for Transports Only */}
                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-center gap-4 pt-4">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                        disabled={currentPage === 1}
                                                        className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-[#1F3D2B]" />
                                                    </button>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {[...Array(totalPages)].map((_, i) => (
                                                            <button
                                                                key={i + 1}
                                                                onClick={() => setCurrentPage(i + 1)}
                                                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                                                                    currentPage === i + 1 
                                                                    ? 'bg-[#1F3D2B] text-white shadow-lg' 
                                                                    : 'bg-white text-slate-400 hover:text-[#1F3D2B]'
                                                                }`}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-[#1F3D2B]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Drivers Section - Separate */}
                                        {driversData.length > 0 && (
                                            <div className="space-y-8 pt-12 border-t border-slate-100">
                                                <div className="flex items-center justify-between px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-8 bg-[#BFA76A] rounded-full shadow-[0_0_10px_rgba(191,167,106,0.2)]"></div>
                                                        <h3 className="text-lg font-black text-[#1F3D2B] uppercase tracking-tighter">
                                                            Private Drivers & Experts
                                                        </h3>
                                                    </div>
                                                    <span className="bg-amber-50 px-3 py-1 rounded-full text-[10px] font-bold text-[#BFA76A] border border-amber-100">
                                                        {driversData.length} experts available
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 gap-6">
                                                    {driversData.map((item, idx) => (
                                                        <TransportCard 
                                                            key={`${item._id}-driver-${idx}`} 
                                                            item={item} 
                                                            isDriverSection={true}
                                                            onSelect={(item) => setSelectedTransport(item)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Detailed Slide-over Modal */}
            <TransportDetailsModal 
                item={selectedTransport} 
                onClose={() => setSelectedTransport(null)} 
            />
            
            <Footer />
        </div>
    );
}
