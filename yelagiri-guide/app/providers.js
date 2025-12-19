'use client';

import { SessionProvider } from "next-auth/react";
import { LocationProvider } from './context/LocationContext';

export function Providers({ children }) {
    return (
        <SessionProvider>
            <LocationProvider>
                {children}
            </LocationProvider>
        </SessionProvider>
    );
}
