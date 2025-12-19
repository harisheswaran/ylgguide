'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function AppleSection({
    children,
    className = "",
    dark = true
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

    return (
        <section
            ref={ref}
            className={`min-h-screen flex items-center justify-center relative overflow-hidden py-20 ${dark ? 'bg-black text-white' : 'bg-white text-black'} ${className}`}
        >
            <motion.div
                style={{ opacity, scale, y }}
                className="container mx-auto px-4 relative z-10"
            >
                {children}
            </motion.div>
        </section>
    );
}
