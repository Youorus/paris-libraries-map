import { useEffect, useState } from "react";
import Image from "next/image";
import { Feature } from "geojson";

type Props = {
    feature: Feature | null;
    onClose: () => void;
};

type GooglePlaceInfo = {
    name: string;
    rating?: number;
    website?: string;
    formatted_phone_number?: string;
    formatted_address?: string;
    opening_hours?: { weekday_text: string[] };
    reviews?: {
        author_name: string;
        rating: number;
        text: string;
    }[];
    photos?: { photo_reference: string }[];
    url?: string;
};

export const LibrarySidebar = ({ feature, onClose }: Props) => {
    const [googleInfo, setGoogleInfo] = useState<GooglePlaceInfo | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!feature) return;

        setLoading(true);
        const name = feature.properties?.name || feature.properties?.nom || "";
        const address =
            feature.properties?.["contact:street"] ||
            feature.properties?.adresse ||
            "";

        fetch(
            `/api/google-place?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`
        )
            .then((res) => res.json())
            .then((data) => {
                setGoogleInfo(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur Google Place:", err);
                setLoading(false);
            });
    }, [feature]);

    if (!feature) return null;

    const props = feature.properties || {};
    const name = googleInfo?.name || props.name || props.nom || "Librairie inconnue";
    const address = googleInfo?.formatted_address || props.adresse || "";
    const phone = googleInfo?.formatted_phone_number || props.phone || "";
    const website = googleInfo?.website || props.website || "";
    const rating = googleInfo?.rating;
    const openingHours = googleInfo?.opening_hours?.weekday_text || [];
    const reviews = googleInfo?.reviews?.slice(0, 2);
    const mapUrl = googleInfo?.url;

    const photoUrl =
        googleInfo?.photos?.[0]?.photo_reference &&
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${googleInfo.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    return (
        <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl z-[1000] overflow-y-auto font-sans border-l border-gray-200 flex flex-col">
            {/* Header avec bouton fermeture */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-700">Détails de la librairie</h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    title="Fermer"
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {/* Photo principale */}
                    {photoUrl && (
                        <div className="w-full h-48 overflow-hidden">
                            <Image
                                src={photoUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                                width={600}
                                height={300}
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Informations principales */}
                    <div className="px-6 py-5">
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">{name}</h1>

                        {rating && (
                            <div className="flex items-center mb-3">
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-yellow-400 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                </div>
                                <span className="mx-2 text-gray-400">•</span>
                                <button
                                    onClick={() => window.open(mapUrl, "_blank")}
                                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                                    type="button"
                                >
                                    Voir sur Google Maps
                                </button>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="flex items-start mb-2">
                                <svg
                                    className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <p className="text-sm text-gray-700">{address}</p>
                            </div>

                            {phone && (
                                <div className="flex items-center mb-2">
                                    <svg
                                        className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <a href={`tel:${phone}`} className="text-sm text-blue-600 hover:underline">
                                        {phone}
                                    </a>
                                </div>
                            )}

                            {website && (
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                        />
                                    </svg>
                                    <a
                                        href={website}
                                        className="text-sm text-blue-600 hover:underline truncate"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {website.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Horaires */}
                        {openingHours.length > 0 && (
                            <div className="mb-5">
                                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Horaires d&apos;ouverture
                                </h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {openingHours.map((line, idx) => (
                                        <li key={idx} className="flex">
                                            <span className="w-24 flex-shrink-0">{line.split(": ")[0]}</span>
                                            <span>{line.split(": ")[1]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Avis Google */}
                        {reviews && reviews.length > 0 && (
                            <div className="mb-5">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-500 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Avis Google
                                </h3>
                                <div className="space-y-4">
                                    {reviews.map((r) => (
                                        <div key={r.author_name} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium text-gray-900">{r.author_name}</p>
                                                <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-700 mr-1">
                            {r.rating}
                          </span>
                                                    <svg
                                                        className="w-4 h-4 text-yellow-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{r.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Source */}
                        {props.source && (
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Données fournies par OpenStreetMap • Source: {props.source}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};