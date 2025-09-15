"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    Tooltip,
} from "react-leaflet";
import { useEffect, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LibrarySidebar } from "@/components/LibrarySidebar";
import { MapHeader } from "@/components/MapHeader";
import { MapController } from "@/components/MapController";
import { ArrondissementFeature, LibraryFeature } from "@/components/schemas";

// ✅ Correction des icônes leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icône personnalisée pour les marqueurs visités
const createCustomIcon = (visited: boolean) =>
  L.divIcon({
    className: `custom-marker ${visited ? "visited-marker" : "unvisited-marker"}`,
    html: `
      <div class="marker-wrapper">
        <div class="marker-pin"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

export default function Map() {
    const [libraries, setLibraries] = useState<LibraryFeature[]>([]);
    const [arrondissements, setArrondissements] = useState<{
        type: "FeatureCollection";
        features: ArrondissementFeature[];
    } | null>(null);

    const [selectedLibrary, setSelectedLibrary] = useState<LibraryFeature | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [zoomBounds, setZoomBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [visitedLibraries, setVisitedLibraries] = useState<Set<string>>(new Set());

    const loadVisitedLibraries = useCallback(() => {
        const savedVisited = localStorage.getItem("visitedLibraries");
        if (savedVisited) {
            try {
                const parsed = JSON.parse(savedVisited);
                if (Array.isArray(parsed)) {
                    setVisitedLibraries(new Set(parsed.map(String)));
                }
            } catch (error) {
                console.error("Error parsing visited libraries:", error);
            }
        }
    }, []);

    useEffect(() => {
        fetch("/data/librairies_paris.geojson")
            .then((res) => res.json())
            .then((data) => setLibraries(data.features))
            .catch((err) => console.error("Erreur chargement librairies:", err));

        fetch("/data/arrondissements.geojson")
            .then((res) => res.json())
            .then((data) => setArrondissements(data))
            .catch((err) => console.error("Erreur chargement arrondissements:", err));

        loadVisitedLibraries();
    }, [loadVisitedLibraries]);

    useEffect(() => {
        if (visitedLibraries.size > 0) {
            localStorage.setItem("visitedLibraries", JSON.stringify(Array.from(visitedLibraries)));
        }
    }, [visitedLibraries]);

    const filteredLibraries = useMemo(() => {
        if (!searchTerm.trim()) return libraries;
        const term = searchTerm.toLowerCase();
        return libraries.filter((f) => {
            const name = String(f.properties?.name || f.properties?.nom || "");
            const address = String(f.properties?.["contact:street"] || f.properties?.adresse || "");
            return name.toLowerCase().includes(term) || address.toLowerCase().includes(term);
        });
    }, [libraries, searchTerm]);

    const handleArrondissementSelect = useCallback(
        (bounds: [[number, number], [number, number]]) => {
            setZoomBounds(bounds);
        },
        []
    );

    const handleMarkerClick = useCallback((feature: LibraryFeature) => {
        setSelectedLibrary(feature);
        const libraryId = String(
            feature.properties?.id ||
            `${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}`
        );

        setVisitedLibraries((prev) => {
            const newSet = new Set(prev);
            newSet.add(libraryId);
            return newSet;
        });
    }, []);

    const handleCloseSidebar = useCallback(() => {
        setSelectedLibrary(null);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {arrondissements && (
                <MapHeader
                    arrondissements={arrondissements}
                    onArrondissementSelect={handleArrondissementSelect}
                    onSearch={setSearchTerm}
                />
            )}

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                className="h-full w-full"
                zoomControl
            >
                <MapController bounds={zoomBounds} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />

                {arrondissements && (
                    <GeoJSON data={arrondissements} style={{ color: "#888", weight: 1 }} />
                )}

                {filteredLibraries.map((feature, index) => {
                    const [lng, lat] = feature.geometry.coordinates;
                    const libraryId = String(
                        feature.properties?.id ||
                        `${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}`
                    );
                    const isVisited = visitedLibraries.has(libraryId);

                    return (
                        <Marker
                            key={`${libraryId}-${index}`}
                            position={[lat, lng]}
                            icon={createCustomIcon(isVisited)}
                            eventHandlers={{ click: () => handleMarkerClick(feature) }}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                <div className="text-sm">
                                    <strong>{feature.properties?.name || feature.properties?.nom}</strong>
                                    <br />
                                    <span className="text-xs text-gray-600">
                                        {feature.properties?.["contact:street"] || feature.properties?.adresse || ""}
                                    </span>
                                </div>
                            </Tooltip>
                            <Popup>
                                <strong>{feature.properties?.name || feature.properties?.nom}</strong>
                                <br />
                                {feature.properties?.adresse || feature.properties?.["contact:street"]}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <LibrarySidebar feature={selectedLibrary} onClose={handleCloseSidebar} />

            <style jsx global>{`
                .custom-marker {
                    background: transparent;
                    border: none;
                    pointer-events: none;
                }
                .visited-marker {
                    filter: drop-shadow(0 0 2px rgba(107, 203, 119, 0.8));
                }
                .leaflet-tooltip {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(5px);
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    backdrop-filter: blur(5px);
                }
                .marker-wrapper {
                    position: relative;
                    width: 24px;
                    height: 24px;
                    transform: translateY(-6px);
                }
                .marker-pin {
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #3f51b5, #5c6bc0);
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 8px rgba(63, 81, 181, 0.4);
                    margin: 0 auto;
                    transition: transform 0.2s ease;
                }
                .visited-marker .marker-pin {
                    background: linear-gradient(135deg, #6bcb77, #66bb6a);
                    box-shadow: 0 0 10px rgba(107, 203, 119, 0.6);
                }
            `}</style>
        </div>
    );
}