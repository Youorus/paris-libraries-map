"use client"; // ← Nécessaire pour utiliser `ssr: false`

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/Map"), {
    ssr: false, // ❗ Important pour Leaflet : seulement côté client
});

export default function MapPage() {
    return (
        <main className="h-screen">
            <DynamicMap />
        </main>
    );
}