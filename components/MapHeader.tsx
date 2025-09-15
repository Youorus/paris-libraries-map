"use client";

import { ArrondissementSelect } from "@/components/ArrondissementSelect";
import {ArrondissementFeatureCollection} from "@/components/schemas";

type MapHeaderProps = {
    arrondissements: ArrondissementFeatureCollection;
    onArrondissementSelect: (bounds: [[number, number], [number, number]]) => void;
    onSearch: (term: string) => void;
};

export function MapHeader({ arrondissements, onArrondissementSelect }: MapHeaderProps) {
    return (
        <div className="absolute top-4 left-20 z-[1000] backdrop-blur-xs p-3 w-auto max-w-xs">
            <ArrondissementSelect
                arrondissements={arrondissements}
                onSelect={onArrondissementSelect}
            />
        </div>
    );
}