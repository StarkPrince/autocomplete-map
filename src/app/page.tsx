// src/app/maps/page.tsx
"use client";

import { LoadScript } from '@react-google-maps/api';
import React from 'react';
import AddressInput from '../components/AddressInput';

const libraries = ['places'];

const MapsPage: React.FC = () =>
{
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-12 text-blue-600">Address Autocomplete</h1>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                libraries={libraries}
            >
                <AddressInput />
            </LoadScript>
        </div>
    );
};

export default MapsPage;
