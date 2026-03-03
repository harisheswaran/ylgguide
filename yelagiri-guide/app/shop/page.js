'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductCard from '@/components/shop/ProductCard';
import { Search, ShoppingBag, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShopPage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    useEffect(() => {
        fetchData();
    }, [activeCategory]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const catRes = await fetch(`${API_URL}/api/shop/categories`);
            const cats = await catRes.json();
            setCategories(cats);

            let productUrl = `${API_URL}/api/shop/products`;
            if (activeCategory) {
                productUrl += `?category=${activeCategory}`;
            }

            const prodRes = await fetch(productUrl);
            const prods = await prodRes.json();
            setProducts(prods);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <div className="pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1F3D2B] mb-4 font-poppins">
                        Yelagiri Market
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover authentic local products, handmade crafts, and fresh produce delivered directly from Yelagiri's best vendors to your doorstep.
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <div className="mb-8 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search interactions, spices, honey..."
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]/50 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                            <MapPin className="w-4 h-4 text-[#BFA76A]" />
                            <span>Delivering to <span className="font-semibold text-gray-800">Yelagiri Hills</span></span>
                        </div>
                    </div>

                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                    />
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1F3D2B]" />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-700">No products found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            <Footer dark={false} />
        </div>
    );
}
