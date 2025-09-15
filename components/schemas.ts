// types.ts
import type {
    Feature,
    FeatureCollection,
    Geometry,
    Point,
    Polygon,
    MultiPolygon
} from "geojson";

/**
 * Type de géométrie pour les arrondissements de Paris.
 */
export type ArrondissementGeometry = Polygon | MultiPolygon;

/**
 * Propriétés d’un arrondissement.
 */
export type ArrondissementProperties = {
    c_ar: string | number;     // Code de l'arrondissement (ex: "3", "06", etc.)
    l_aroff: string;           // Label officiel (ex: "Temple")
    l_ar: string;              // Label affiché (ex: "3ème Ardt")
    n_sq_ar?: number;          // (optionnel) Identifiant unique
    c_arinsee?: number;        // (optionnel) Code INSEE
    surface?: number;          // (optionnel) Surface en m²
    n_sq_co?: number;          // (optionnel) Code commun
    perimetre?: number;        // (optionnel) Périmètre
};

/**
 * Un arrondissement sous forme GeoJSON Feature
 */
export type ArrondissementFeature = Feature<ArrondissementGeometry, ArrondissementProperties>;

/**
 * Collection GeoJSON d'arrondissements
 */
export type ArrondissementFeatureCollection = FeatureCollection<ArrondissementGeometry, ArrondissementProperties>;

/**
 * Propriétés d’une librairie (adapté à tes données JSON réelles)
 */
export type LibraryProperties = {
    "@id": string;
    name?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:postcode"?: string;
    "addr:city"?: string;
    "contact:email"?: string;
    "contact:street"?: string;
    adresse?: string;
    "ref:FR:SIRET"?: string;
    books?: string;
    shop?: string;
    website?: string;
    opening_hours?: string;
    check_date?: string;
    [key: string]: string | number | boolean | undefined;
};

/**
 * Librairie sous forme de Feature GeoJSON
 */
export type LibraryFeature = Feature<Point, LibraryProperties>;

/**
 * Collection GeoJSON de librairies
 */
export type LibraryFeatureCollection = FeatureCollection<Point, LibraryProperties>;
