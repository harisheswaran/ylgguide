'use client';

import { useEffect } from 'react';

export default function AIAnalytics() {
    useEffect(() => {
        // Track page view
        trackEvent('page_view', {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        });

        // Track time on page
        const startTime = Date.now();
        return () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            trackEvent('time_on_page', {
                page: window.location.pathname,
                duration: timeSpent
            });
        };
    }, []);

    const trackEvent = (eventName, data) => {
        // Store in localStorage for demo (in production, send to analytics service)
        const events = JSON.parse(localStorage.getItem('ai_analytics') || '[]');
        events.push({
            event: eventName,
            data,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 events
        if (events.length > 100) {
            events.shift();
        }

        localStorage.setItem('ai_analytics', JSON.stringify(events));

        // Log for demo purposes
        console.log('📊 AI Analytics:', eventName, data);
    };

    return null; // This is a tracking component, no UI
}

// Export tracking function for use in other components
export const trackUserAction = (action, details) => {
    const events = JSON.parse(localStorage.getItem('ai_analytics') || '[]');
    events.push({
        event: action,
        data: details,
        timestamp: new Date().toISOString()
    });

    if (events.length > 100) {
        events.shift();
    }

    localStorage.setItem('ai_analytics', JSON.stringify(events));
    console.log('📊 User Action:', action, details);
};
