'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../../app/shop/context';

export default function ProductCard({ product }) {
    const { addToCart } = useShop();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        // Optional: Add toast notification here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
        >
            <Link href={`/shop/${product._id}`} className="block relative h-48 overflow-hidden">
                <Image
                    src={product.images[0] || 'https://placehold.co/400x300?text=No+Image'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating > 0 ? product.rating : 'New'}</span>
                </div>
                {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Out of Stock</span>
                    </div>
                )}
            </Link>

            <div className="p-4">
                <div className="text-xs text-brand-600 font-medium mb-1 uppercase tracking-wider">
                    {product.category?.name || 'Local'}
                </div>
                <Link href={`/shop/${product._id}`}>
                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[40px]">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-xs text-gray-500">{product.vendor?.name}</span>
                    </div>
                    <button
                        className="bg-[#1F3D2B] text-white p-2.5 rounded-xl hover:bg-[#2F5D4B] transition-colors active:scale-95"
                        aria-label="Add to cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
