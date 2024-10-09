// src/components/AddressInput.tsx

"use client";

import { Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import React, { FormEvent, useRef, useState } from 'react';

interface LocationData
{
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    formattedAddress: string | null;
}

const AddressInput: React.FC = () =>
{
    const [address, setAddress] = useState<string>('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Callback when Autocomplete is loaded
    const onLoad = (autocomplete: google.maps.places.Autocomplete) =>
    {
        autocompleteRef.current = autocomplete;
    };

    // Callback when a place is selected
    const onPlaceChanged = () =>
    {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
            } else if (place.name) {
                setAddress(place.name);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) =>
    {
        e.preventDefault();
        setError(null);
        setLocationData(null);

        if (!address.trim()) {
            setError("Address field cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get('/api/geocode', {
                params: { address },
            });

            if ('error' in response.data) {
                setError(response.data.error);
                setLoading(false);
                return;
            }

            const { city, country, latitude, longitude, formattedAddress } = response.data;

            if (!city || !country) {
                setError("The selected address is incomplete. Please choose a more specific address.");
                setLoading(false);
                return;
            }

            setLocationData({
                city,
                country,
                latitude,
                longitude,
                formattedAddress,
            });

            setLoading(false);
        } catch (err) {
            console.error("Error submitting address:", err);
            setError("An unexpected error occurred. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                        type="text"
                        placeholder="Enter your street address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-6 py-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
                    />
                </Autocomplete>
                <button
                    type="submit"
                    className="mt-6 w-full px-6 py-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-lg"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {error && (
                <div className="mt-6 w-full max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
                    {error}
                </div>
            )}

            {locationData && (
                <div className="mt-8 w-full max-w-md p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Selected Address</h2>
                    <p className="mb-4"><strong>Formatted Address:</strong> {locationData.formattedAddress}</p>
                    <p className="mb-4"><strong>City:</strong> {locationData.city}</p>
                    <p className="mb-4"><strong>Country:</strong> {locationData.country}</p>
                    <p className="mb-2"><strong>Latitude:</strong> {locationData.latitude}</p>
                    <p><strong>Longitude:</strong> {locationData.longitude}</p>
                </div>
            )}
        </div>
    );
};

export default AddressInput;
