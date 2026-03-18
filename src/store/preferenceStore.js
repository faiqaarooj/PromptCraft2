import { useState } from 'react';

// M-PC-04: Preference Store
// Simple local state to store user domain to inject into every prompt
export const usePreferenceStore = () => {
    // In a real app, this could connect to Firebase/PostgreSQL (M-PC-01).
    // Defaulting to "Fintech, Pakistan" as per the user's example.
    const [domain, setDomain] = useState(() => {
        try {
            return localStorage.getItem('promptcraft_domain') || "Fintech, Pakistan";
        } catch {
            return "Fintech, Pakistan";
        }
    });

    const updateDomain = (newDomain) => {
        setDomain(newDomain);
        try {
            localStorage.setItem('promptcraft_domain', newDomain);
        } catch {}
    };

    return { domain, updateDomain };
};
