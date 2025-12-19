'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();

    useEffect(() => {
        // Sync with NextAuth session
        if (status === 'authenticated' && session?.user) {
            setUser({
                ...session.user,
                // Ensure we have a consistent user object structure
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.image,
            });
            setLoading(false);
        } else if (status === 'unauthenticated') {
            // Fallback to local storage if not authenticated via NextAuth
            // This allows keeping the existing local auth working if needed, 
            // or we can strictly rely on NextAuth.
            // For now, let's keep local storage as a fallback or secondary check
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
            setLoading(false);
        }
    }, [session, status]);

    const login = async (userData) => {
        // If userData is provided (legacy local login), use it
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            // Otherwise trigger NextAuth Google login
            await signIn('google');
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        await signOut();
    };

    const signup = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
