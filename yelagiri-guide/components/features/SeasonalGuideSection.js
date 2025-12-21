'use client';

import { motion } from 'framer-motion';

const seasons = [
    {
        name: "Winter",
        months: "November - February",
        temp: "12°C - 24°C",
        desc: "The peak season with mist-covered hills and perfect weather for trekking.",
        icon: "❄️",
        color: "from-blue-500 to-indigo-600"
    },
    {
        name: "Summer",
        months: "March - June",
        temp: "18°C - 32°C",
        desc: "Platesu breeze makes it much cooler than the plains. Ideal for flower shows.",
        icon: "🌸",
        color: "from-rose-400 to-orange-500"
    },
    {
        name: "Monsoon",
        months: "July - October",
        temp: "16°C - 28°C",
        desc: "Lush greenery and fresh waterfalls. Best for nature lovers and photographers.",
        icon: "🌧️",
        color: "from-emerald-400 to-teal-600"
    }
];

export default function SeasonalGuideSection() {
    return (
        <section className="py-12 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        Seasonal Guide
                    </motion.h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Plan your visit according to the seasons to experience Yelagiri in your favorite way.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {seasons.map((season, idx) => (
                        <motion.div
                            key={season.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative group bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${season.color} opacity-5 rounded-bl-full`}></div>

                            <div className="text-5xl mb-8">{season.icon}</div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">{season.name}</h3>
                            <p className="text-forest-600 font-bold mb-4 uppercase tracking-wider text-sm">{season.months}</p>

                            <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-6">
                                Avg: {season.temp}
                            </div>

                            <p className="text-slate-600 leading-relaxed">
                                {season.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
