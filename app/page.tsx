"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function Home() {
    const [balloons, setBalloons] = useState<number[]>([]);
    const [shuffledColors, setShuffledColors] = useState<string[]>([]);

    useEffect(() => {
        const count = 5;
        setBalloons(Array.from({ length: count }, (_, i) => i));

        // Couleurs pastel harmonieuses
        const colors = [
            "bg-red-200",
            "bg-yellow-200",
            "bg-pink-200",
            "bg-blue-200",
            "bg-purple-200",
            "bg-green-200",
            "bg-emerald-200",
            "bg-indigo-200",
            "bg-rose-200",
            "bg-orange-200"
        ];

        setShuffledColors(shuffle(colors).slice(0, count)); // Unicité assurée
    }, []);

    return (
        <div className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center font-sans">
            {/* Ballons animés avec couleurs uniques */}
            {balloons.map((id) => {
                const color = shuffledColors[id % shuffledColors.length];
                const initialX = Math.random() * 100;

                return (
                    <motion.div
                        key={id}
                        className={`absolute w-10 h-12 rounded-full opacity-80 ${color} flex items-center justify-center`}
                        initial={{
                            y: "100vh",
                            x: `${initialX}%`,
                            opacity: 0,
                            scale: 0.8
                        }}
                        animate={{
                            y: "-20vh",
                            x: `${initialX + (Math.random() * 20 - 10)}%`,
                            opacity: [0, 0.8, 0.8, 0],
                            scale: [0.8, 1.1, 1.0, 0.9]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeOut"
                        }}
                        style={{
                            transformOrigin: "bottom center",
                        }}
                    >
                        <div className="absolute bottom-0 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-gray-300 -mb-1"></div>
                    </motion.div>
                );
            })}

            {/* Texte central */}
            <div className="z-10 text-center px-4 space-y-4 max-w-xl">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-black"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    le chasseur — libraires de Paris
                </motion.h1>
                <motion.p
                    className="text-base sm:text-lg text-neutral-500 italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    pour Lucas Sanfilippo
                </motion.p>
                <motion.p
                    className="text-sm sm:text-base text-gray-700 font-light leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Une carte interactive unique qui répertorie toutes sortes de librairies à Paris —
                    du bouquiniste de quartier aux repaires de bande dessinée, en passant par les librairies indépendantes.
                    Plus de <span className="inline-block font-semibold bg-gray-100 px-1 py-0.5 rounded">663 librairies</span> y sont référencées, pour flâner entre les pages d&apos;un Paris littéraire.
                </motion.p>
            </div>

            {/* Bouton en bas */}
            <motion.div
                className="absolute bottom-6 w-full flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <Link
                    href="/map"
                    className="px-6 py-3 bg-black text-white text-sm sm:text-base rounded-full shadow-lg hover:bg-gray-800 transition"
                >
                    Voir la carte
                </Link>
            </motion.div>
        </div>
    );
}