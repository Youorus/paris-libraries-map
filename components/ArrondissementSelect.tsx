"use client";


// Composant ArrondissementSelect avec nouveau design
import {ArrondissementFeatureCollection} from "@/components/schemas";

type ArrondissementSelectProps = {
    arrondissements: ArrondissementFeatureCollection;
    onSelect: (bounds: [[number, number], [number, number]]) => void;
};

export function ArrondissementSelect({ arrondissements, onSelect }: ArrondissementSelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value.padStart(2, "0");

        const found = arrondissements.features.find((f) => {
            const featureCode = f.properties.c_ar.toString().padStart(2, "0");
            return featureCode === code;
        });

        if (!found) {
            console.warn("❌ Aucun arrondissement trouvé pour ce code :", code);
            return;
        }

        let coords: [number, number][] = [];

        if (found.geometry.type === "Polygon") {
            coords = found.geometry.coordinates[0] as [number, number][];
        } else if (found.geometry.type === "MultiPolygon") {
            coords = found.geometry.coordinates.flat(2) as [number, number][];
        } else {
            console.error("❌ Type de géométrie non pris en charge");
            return;
        }

        const lats = coords.map((coord) => coord[1]);
        const lngs = coords.map((coord) => coord[0]);

        const southWest: [number, number] = [Math.min(...lats), Math.min(...lngs)];
        const northEast: [number, number] = [Math.max(...lats), Math.max(...lngs)];

        onSelect([southWest, northEast]);
    };

    return (
        <div className="relative">
            <select
                onChange={handleChange}
                className="text-black rounded-xl border px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 appearance-none pl-4 pr-8 w-full"
            >
                <option value="">Tous les arrondissements</option>
                {arrondissements.features.map((f) => (
                    <option
                        key={f.properties.c_ar}
                        value={f.properties.c_ar.toString().padStart(2, "0")}
                    >
                        {f.properties.l_ar}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
}