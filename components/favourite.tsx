'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const NotificationPage = () => {
    const [formData, setFormData] = useState<any>(null); // Initialize as null
    const router = useRouter();

    useEffect(() => {
        // Wait for the router to be ready and ensure formData exists in query
        if (router.isReady && router.query.formData) {
            try {
                const data = JSON.parse(router.query.formData as string); // Parse formData
                setFormData(data); // Set the form data in state
            } catch (error) {
                console.error('Error parsing formData from query:', error);
            }
        }
    }, [router.isReady, router.query.formData]); // Effect runs when router is ready and formData is available

    // Handle the case where formData is not yet loaded
    if (!formData) {
        return <div className="p-6 text-center text-gray-500">Loading form data...</div>;
    }

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">Notification</h2>

            <h3 className="text-lg font-semibold">Booking Information</h3>
            <pre className="bg-white p-4 mt-4 rounded-md">{JSON.stringify(formData, null, 2)}</pre>
        </div>
    );
};

export default NotificationPage;
