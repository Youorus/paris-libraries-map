// app/api/google-place/route.ts
import { NextRequest } from "next/server";
import axios from "axios";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const address = searchParams.get("address");

    if (!GOOGLE_API_KEY || !name) {
        return new Response(JSON.stringify({ error: "Paramètres manquants ou clé API absente" }), { status: 400 });
    }

    const query = address ? `${name} ${address}` : name;

    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", {
            params: {
                input: query,
                inputtype: "textquery",
                fields: "place_id",
                key: GOOGLE_API_KEY,
            },
        });

        const placeId = response.data.candidates?.[0]?.place_id;

        if (!placeId) return new Response(JSON.stringify({ error: "Aucun lieu trouvé" }), { status: 404 });

        const details = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
                place_id: placeId,
                key: GOOGLE_API_KEY,
                language: "fr",
                fields: "name,formatted_address,rating,website,formatted_phone_number,opening_hours,reviews,photos,url",
            },
        });

        return new Response(JSON.stringify(details.data.result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Erreur API Google:", err);
        return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
    }
}