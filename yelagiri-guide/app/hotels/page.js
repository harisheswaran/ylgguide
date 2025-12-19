'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/app/context/LocationContext';
import FilterSidebar from '@/components/hotels/FilterSidebar';
import SortBar from '@/components/hotels/SortBar';
import HotelCard from '@/components/hotels/HotelCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HotelsPage() {
    const { location } = useLocation();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    category: 'hotels-resorts', // Assuming this is the slug for hotels
                    page,
                    limit: 10,
                    ...filters,
                    sort,
                    ...(location ? { lat: location.lat, lng: location.lng } : {})
                });

                const res = await fetch(`http://localhost:5000/api/listings?${queryParams}`);
                const data = await res.json();

                if (data.listings) {
                    setHotels(data.listings);
                    setTotalPages(data.totalPages);
                } else {
                    // Fallback if backend structure differs or returns array
                    setHotels(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [filters, sort, page, location]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-28">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Hotels & Resorts in Yelagiri</h1>
                    <p className="text-slate-500">Find the perfect place to stay for your getaway.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4">
                        <FilterSidebar filters={filters} setFilters={setFilters} />
                    </aside>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        {/* Sort Bar */}
                        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500 font-medium">
                                Showing {hotels.length} properties
                            </p>
                            <SortBar sort={sort} setSort={setSort} />
                        </div>

                        {/* Hotel List */}
                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white h-64 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {hotels.map(hotel => (
                                    <HotelCard key={hotel._id} hotel={hotel} />
                                ))}

                                {hotels.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                                        <p className="text-slate-500 text-lg">No hotels found matching your criteria.</p>
                                        <button
                                            onClick={() => setFilters({})}
                                            className="mt-4 text-teal-600 font-bold hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${page === pageNum
                                                ? 'bg-teal-600 text-white shadow-lg'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
