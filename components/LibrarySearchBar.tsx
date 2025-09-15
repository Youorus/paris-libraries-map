"use client";

import { useState } from "react";

// Composant LibrarySearchBar avec nouveau design
type LibrarySearchBarProps = {
    onSearch: (term: string) => void;
};

export const LibrarySearchBar: React.FC<LibrarySearchBarProps> = ({ onSearch }) => {
    const [term, setTerm] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerm(value);
        onSearch(value.trim());
    };

    return (
        <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                aria-label="Recherche de librairie"
                placeholder="Rechercher une librairie ou une adresse"
                className="w-full text-black rounded-full pl-10 pr-4 py-3 border  shadow-sm hover:shadow-md focus:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={term}
                onChange={handleChange}
            />
        </div>
    );
};