'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, Thermometer, CheckCircle2 } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState({
        temp: 16,
        condition: 'Clear Skies',
        humidity: 82,
        windSpeed: 8,
        tempMin: 14,
        tempMax: 27,
        uvIndex: 2,
        icon: <Sun className="w-12 h-12 text-[#EAB308]" />,
        loading: true
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=12.5833&longitude=78.7500&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto'
                );
                const data = await response.json();
                const current = data.current;
                const daily = data.daily;

                const getWeatherIcon = (code) => {
                    const iconClass = "w-12 h-12";
                    if (code === 0) return <Sun className={`${iconClass} text-[#EAB308]`} />;
                    if (code >= 1 && code <= 3) return <Cloud className={`${iconClass} text-slate-400`} />;
                    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return <CloudRain className={`${iconClass} text-blue-400`} />;
                    if (code >= 95 && code <= 99) return <CloudLightning className={`${iconClass} text-indigo-500`} />;
                    return <Sun className={`${iconClass} text-[#EAB308]`} />;
                };

                setWeather({
                    temp: Math.round(current.temperature_2m),
                    condition: current.weather_code === 0 ? 'Clear Skies' : 'Partly Cloudy',
                    humidity: Math.round(current.relative_humidity_2m),
                    windSpeed: Math.round(current.wind_speed_10m),
                    tempMin: Math.round(daily.temperature_2m_min[0]),
                    tempMax: Math.round(daily.temperature_2m_max[0]),
                    uvIndex: Math.round(daily.uv_index_max[0]),
                    icon: getWeatherIcon(current.weather_code),
                    loading: false
                });
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeather(prev => ({ ...prev, loading: false }));
            }
        };

        fetchWeather();
    }, []);

    const metrics = [
        { label: 'Range', value: `${weather.tempMin}° - ${weather.tempMax}°`, icon: <Thermometer className="w-5 h-5 text-emerald-500" />, bgColor: 'bg-emerald-50' },
        { label: 'Humidity', value: `${weather.humidity}%`, icon: <Droplets className="w-5 h-5 text-blue-500" />, bgColor: 'bg-blue-50' },
        { label: 'Wind Speed', value: `${weather.windSpeed} km/h`, icon: <Wind className="w-5 h-5 text-rose-400" />, bgColor: 'bg-rose-50' },
        { label: 'UV Index', value: `Low (${weather.uvIndex})`, icon: <Sun className="w-5 h-5 text-amber-500" />, bgColor: 'bg-amber-50' },
    ];

    if (weather.loading) {
        return <div className="w-full h-96 bg-white rounded-[3rem] animate-pulse border border-black/5" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-black/5 w-full flex flex-col gap-10"
        >
            {/* Top Section */}
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <h4 className="text-[13px] font-bold text-[#BFA76A] uppercase tracking-[0.3em]">
                        Live Weather
                    </h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-7xl font-bold text-[#1F3D2B]" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {weather.temp}
                        </span>
                        <span className="text-5xl font-bold text-[#1F3D2B]">°</span>
                    </div>
                    <p className="text-xl font-bold text-[#1F3D2B]" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {weather.condition}
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-50 rounded-full blur-2xl scale-150 transform -translate-y-4" />
                    <div className="relative w-28 h-28 bg-emerald-50/50 rounded-full flex flex-col items-center justify-center border border-emerald-100/50">
                        {weather.icon}
                        <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mt-2">Yelagiri Hills</span>
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-black/5 w-full" />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-12">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-5">
                        <div className={`w-12 h-12 ${metric.bgColor} rounded-2xl flex items-center justify-center`}>
                            {metric.icon}
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#5F6368] uppercase tracking-widest mb-1">{metric.label}</p>
                            <p className="text-[17px] font-bold text-[#1F3D2B]">{metric.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendation Box */}
            <div className="bg-emerald-50/40 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-[15px] font-medium text-[#1F3D2B]">
                    Ideal for outdoor activities like trekking and boating.
                </p>
            </div>
        </motion.div>
    );
}

