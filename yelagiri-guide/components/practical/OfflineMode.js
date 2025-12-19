'use client';

import { useState, useEffect } from 'react';

export default function OfflineMode() {
    const [isOffline, setIsOffline] = useState(false);
    const [savedData, setSavedData] = useState(null);

    useEffect(() => {
        // Check online status
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => {
            setIsOffline(true);
            loadOfflineData();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadOfflineData = () => {
        const data = localStorage.getItem('offline_data');
        if (data) {
            setSavedData(JSON.parse(data));
        }
    };

    const saveForOffline = () => {
        const dataToSave = {
            emergencyContacts: [
                { name: 'Police', number: '100' },
                { name: 'Ambulance', number: '108' },
                { name: 'Fire', number: '101' },
            ],
            essentialInfo: {
                hotelAddress: 'Main Road, Yelagiri Hills',
                nearestHospital: 'Government Hospital, Athanavur',
                touristOffice: 'Yelagiri Tourist Office, Main Road',
            },
            savedTimestamp: new Date().toISOString(),
        };
        localStorage.setItem('offline_data', JSON.stringify(dataToSave));
        alert('Essential information saved for offline access!');
    };

    if (!isOffline) {
        return (
            <button
                onClick={saveForOffline}
                className="fixed top-20 left-6 z-40 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="text-sm font-medium hidden md:inline">Save Offline</span>
            </button>
        );
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white p-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                    <span className="font-semibold text-sm">You&apos;re offline</span>
                </div>
                {savedData && (
                    <span className="text-xs">Essential info available</span>
                )}
            </div>
        </div>
    );
}
