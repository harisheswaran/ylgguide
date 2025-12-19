import Link from 'next/link';
import { motion } from 'framer-motion';

const gradientMap = {
    'Hotels & Resorts': 'gradient-hotels',
    'Tourist Spots': 'gradient-spots',
    'Restaurants': 'gradient-restaurants',
    'Emergency': 'gradient-emergency',
    'Activities': 'gradient-activities',
    'Shopping': 'gradient-shopping'
};

const MotionLink = motion(Link);

export default function CategoryCard({ title, icon, href, description }) {
    const gradientClass = gradientMap[title] || 'gradient-hotels';

    return (
        <MotionLink
            href={href}
            className="group block rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className={`${gradientClass} p-8 text-white relative overflow-hidden`}>
                <motion.div
                    className="absolute top-0 right-0 text-9xl opacity-10 transform translate-x-8 -translate-y-4"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                >
                    {icon}
                </motion.div>
                <div className="relative z-10">
                    <motion.div
                        className="text-5xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                        {icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">{title}</h3>
                    <p className="text-white/90 text-sm">{description}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 translate-y-16"></div>
            </div>
            <div className="bg-white p-4 group-hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 flex items-center">
                    Explore {title}
                    <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                </span>
            </div>
        </MotionLink>
    );
}
