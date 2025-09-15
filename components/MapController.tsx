import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
    bounds: [[number, number], [number, number]] | null;
};

export function MapController({ bounds }: Props) {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            console.log("Zooming to bounds:", bounds);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);

    return null;
}