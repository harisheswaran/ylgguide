'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useShop } from '../context';
import { ShoppingCart, Star, ArrowLeft, Truck, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useShop();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/shop/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-[#1F3D2B]" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="text-[#1F3D2B] font-medium hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, qty);
        alert('Added to cart successfully!'); // Simple feedback for now
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar dark={false} />

            <main className="pt-28 pb-16 container mx-auto px-4 max-w-6xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#1F3D2B] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Market
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                    {/* Images Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                                src={product.images[activeImage] || 'https://placehold.co/600x600?text=No+Image'}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#1F3D2B]' : 'border-transparent'
                                            }`}
                                    >
                                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-[#BFA76A] font-bold tracking-wider uppercase mb-3">
                            <span>{product.category?.name || 'Local'}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating > 0 ? product.rating : 'New'}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-4 font-poppins">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                            <span className="text-sm text-gray-500 mb-2">per unit (Tax included)</span>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 space-y-3">
                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Delivery Available</h4>
                                    <p className="text-xs text-gray-500">Delivered within 2 hours in Yelagiri</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Sold by {product.vendor?.name}</h4>
                                    <p className="text-xs text-gray-500">{product.vendor?.location?.address || 'Yelagiri Hills'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-[#1F3D2B] mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Quality Assured</h4>
                                    <p className="text-xs text-gray-500">Verified local product</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm w-fit">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="px-4 py-3 text-lg font-medium text-gray-600 hover:bg-gray-50 rounded-l-xl transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center text-lg font-bold text-gray-800">{qty}</span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="px-4 py-3 text-lg font-medium text-gray-600 hover:bg-gray-50 rounded-r-xl transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={!product.isAvailable}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-lg font-bold shadow-lg transition-all ${product.isAvailable
                                        ? 'bg-[#1F3D2B] text-white hover:bg-[#2F5D4B] shadow-[#1F3D2B]/20'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer dark={false} />
        </div>
    );
}
