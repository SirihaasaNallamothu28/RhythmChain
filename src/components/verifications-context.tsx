"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Define the verification history item type
export interface VerificationHistoryItem {
    id: string;
    title: string;
    artist: string;
    timestamp: string;
    isVerified: boolean;
    artistImage: string;
}

// Define context type
interface VerificationContextType {
    verificationHistory: VerificationHistoryItem[];
    addVerification: (verification: VerificationHistoryItem) => void;
}

// Create context with default values
const VerificationContext = createContext<VerificationContextType>({
    verificationHistory: [],
    addVerification: () => { },
});

// Custom hook to use the verification context
export const useVerification = () => useContext(VerificationContext);

// Format a timestamp relative to now
export const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
};

// Provider component
interface VerificationProviderProps {
    children: ReactNode;
}

export const VerificationProvider: React.FC<VerificationProviderProps> = ({ children }) => {
    const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryItem[]>([]);

    // Load verification history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("verificationHistory");
        if (savedHistory) {
            try {
                setVerificationHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error("Failed to parse verification history:", error);
            }
        }
    }, []);

    // Add a new verification to history
    const addVerification = (verification: VerificationHistoryItem) => {
        const updatedHistory = [verification, ...verificationHistory].slice(0, 3);
        setVerificationHistory(updatedHistory);

        // Save to localStorage
        localStorage.setItem("verificationHistory", JSON.stringify(updatedHistory));

        // Dispatch custom event for other components to know that verification history has been updated
        window.dispatchEvent(new CustomEvent("verification-updated"));
    };

    // Provide the verification context to children
    return (
        <VerificationContext.Provider value={{ verificationHistory, addVerification }}>
            {children}
        </VerificationContext.Provider>
    );
};