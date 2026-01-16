'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// Client-side Icon Creator
const createIcon = (color) => {
    return L.divIcon({
        html: `<div class="w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center relative">
                <div class="w-6 h-6 rounded-full ${color}"></div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
               </div>`,
        className: 'custom-map-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

export default function MapSection({ data, onSelect }) {
    const [isClient, setIsClient] = useState(false);
    const iconsRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
        // Clean up Default Icon issues in Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        iconsRef.current = {
            default: createIcon('bg-slate-800'),
            bus: createIcon('bg-blue-500'),
            busDelayed: createIcon('bg-red-500'),
            taxi: createIcon('bg-yellow-500'),
            rental: createIcon('bg-emerald-500'),
            safari: createIcon('bg-amber-600'),
            driver: createIcon('bg-violet-600')
        };
    }, []);

    if (!isClient) return <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl" />;

    return (
        <MapContainer 
            center={[12.5790, 78.6380]} 
            zoom={13} 
            className="h-full w-full rounded-2xl z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {data.map((item, idx) => {
                // Determine coordinates
                const position = item.locationDetails?.coordinates || item.realTime?.vehicleLocation || item.location;
                
                if (!position || position.length !== 2 || position[0] === 0) return null;

                // Determine Icon
                let icon = iconsRef.current.default;
                if (item.category.includes('Bus')) {
                    icon = item.realTime?.status === 'Delayed' ? iconsRef.current.busDelayed : iconsRef.current.bus;
                } else if (item.category.includes('Taxi') || item.category.includes('Auto')) {
                    icon = iconsRef.current.taxi;
                } else if (item.category.includes('Rental')) {
                    icon = iconsRef.current.rental;
                } else if (item.category.includes('Jeep Safari')) {
                    icon = iconsRef.current.safari;
                } else if (item.category.includes('Private Driver')) {
                    icon = iconsRef.current.driver;
                }

                return (
                    <Marker key={idx} position={position} icon={icon}>
                        <Popup className="rounded-xl overflow-hidden">
                            <div className="p-2 min-w-[200px]">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black text-[#BFA76A] uppercase tracking-widest">{item.category}</span>
                                    {item.liveUpdates?.status === 'Delayed' && (
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[8px] font-black">DELAYED</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-sm text-[#1F3D2B] mb-1">{item.name}</h3>
                                <p className="text-[10px] text-slate-500 mb-3 flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.liveUpdates?.status === 'Delayed' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                    {item.liveUpdates?.status || item.availability?.status || 'Active'}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button 
                                        onClick={() => onSelect?.(item)}
                                        className="py-2 bg-[#1F3D2B] text-white text-[9px] font-bold rounded-lg hover:bg-[#162e20] transition-colors uppercase tracking-tight"
                                    >
                                        VIEW DETAILS
                                    </button>
                                    <a 
                                        href={item.locationDetails?.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2 bg-white border border-slate-200 text-slate-700 text-[9px] font-bold rounded-lg hover:bg-slate-50 transition-colors uppercase text-center tracking-tight"
                                    >
                                        DIRECTIONS
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
