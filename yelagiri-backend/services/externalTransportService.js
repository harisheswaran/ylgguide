const axios = require('axios');

/**
 * Service to handle external data sources for Transport
 * Includes: Google Places, Google Directions, and Public Transit Feeds
 */

class ExternalTransportService {
    constructor() {
        this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
        this.yelagiriCoords = '12.5843,78.6384'; // Center of Yelagiri
    }

    /**
     * Fetch Transport Operators from Google Places API
     * @param {string} type - 'taxi', 'car_rental', 'travel_agency'
     */
    async fetchFromGooglePlaces(type = 'taxi') {
        if (!this.googleApiKey) {
            console.warn('Google Maps API Key missing. Skipping Google Places fetch.');
            return [];
        }

        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: this.yelagiriCoords,
                    radius: 20000, // 20km
                    type: 'point_of_interest',
                    keyword: type,
                    key: this.googleApiKey
                }
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Google Places Error: ${response.data.status}`);
            }

            return response.data.results.map(place => ({
                name: place.name,
                address: place.vicinity,
                rating: place.rating || 0,
                location: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                },
                placeId: place.place_id,
                category: this.mapGoogleTypeToCategory(type),
                source: 'google_places'
            }));
        } catch (error) {
            console.error('ExternalTransportService: fetchFromGooglePlaces error', error.message);
            return [];
        }
    }

    /**
     * Map Google Place keywords to our schema categories
     */
    mapGoogleTypeToCategory(type) {
        const mapping = {
            'taxi': 'Taxi Services',
            'car_rental': 'Rental Cars',
            'travel_agency': 'Jeep Safari',
            'bus_station': 'Public Buses'
        };
        return mapping[type] || 'Other';
    }

    /**
     * Get Live Trip Data from Google Directions API
     */
    async getLiveTripInfo(origin, destination) {
        if (!this.googleApiKey) return null;

        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin,
                    destination,
                    key: this.googleApiKey
                }
            });

            if (response.data.status === 'OK') {
                const route = response.data.routes[0].legs[0];
                return {
                    distance: route.distance.text,
                    duration: route.duration.text,
                    startAddress: route.start_address,
                    endAddress: route.end_address,
                    polyline: response.data.routes[0].overview_polyline.points
                };
            }
            return null;
        } catch (error) {
            console.error('ExternalTransportService: getLiveTripInfo error', error.message);
            return null;
        }
    }

    /**
     * Fetch Bus Schedules (RedBus Mock / GTFS Implementation)
     */
    async fetchBusSchedules() {
        // In a real scenario, this would call RedBus API or a GTFS feed URL
        // Currently returning a standardized mock structure that fits our schema
        return [
            {
                name: "TNSTC Public Transport",
                category: "Public Buses",
                vehicleType: "Bus",
                route: {
                    from: "Vaniyambadi",
                    to: "Yelagiri Hills",
                    stops: ["Ponneri", "Athanavoor", "Nilavoor"],
                    duration: "1h 15m"
                },
                price: { amount: 35, unit: "per person" },
                availability: { status: "Scheduled", frequency: "Every 45 mins" },
                source: "gtfs_feed"
            }
        ];
    }
}

module.exports = new ExternalTransportService();
