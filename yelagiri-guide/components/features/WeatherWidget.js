'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WeatherWidget() {
    const [weather, setWeather] = useState({
        temp: 0,
        condition: 'Loading...',
        humidity: 0,
        windSpeed: 0,
        icon: '⏳'
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Yelagiri coordinates: 12.5833° N, 78.7500° E
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=12.5833&longitude=78.7500&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto'
                );
                const data = await response.json();
                const current = data.current;

                // Map WMO weather codes to icons and conditions
                const getWeatherInfo = (code) => {
                    if (code === 0) return { icon: '☀️', text: 'Clear Sky' };
                    if (code >= 1 && code <= 3) return { icon: '⛅', text: 'Partly Cloudy' };
                    if (code >= 45 && code <= 48) return { icon: '🌫️', text: 'Foggy' };
                    if (code >= 51 && code <= 55) return { icon: '🌦️', text: 'Drizzle' };
                    if (code >= 61 && code <= 67) return { icon: '🌧️', text: 'Rain' };
                    if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Snow' };
                    if (code >= 80 && code <= 82) return { icon: '🌦️', text: 'Showers' };
                    if (code >= 95 && code <= 99) return { icon: '⛈️', text: 'Thunderstorm' };
                    return { icon: '🌡️', text: 'Unknown' };
                };

                const info = getWeatherInfo(current.weather_code);

                setWeather({
                    temp: Math.round(current.temperature_2m),
                    condition: info.text,
                    humidity: current.relative_humidity_2m,
                    windSpeed: current.wind_speed_10m,
                    icon: info.icon
                });
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeather(prev => ({ ...prev, condition: 'Unavailable' }));
            }
        };

        fetchWeather();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white w-full max-w-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-serif font-bold text-white">Yelagiri Hills</h3>
                    <p className="text-sm text-gray-300 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        {weather.condition}
                    </p>
                </div>
                <div className="text-4xl">{weather.icon}</div>
            </div>

            <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-bold tracking-tighter">{weather.temp}°</span>
                <span className="text-xl mb-1 font-light text-gray-300">C</span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Humidity</span>
                    </div>
                    <span className="font-semibold text-sm">{weather.humidity}%</span>
                </div>

                <div className="flex items-center justify-between p-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Wind Speed</span>
                    </div>
                    <span className="font-semibold text-sm">{weather.windSpeed} km/h</span>
                </div>
            </div>
        </motion.div>
    );
}
