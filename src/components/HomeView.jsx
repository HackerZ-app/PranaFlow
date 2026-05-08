import React from 'react';
import { motion } from 'framer-motion';
import { BREATHING_LEVELS } from '../constants/levels';

const getLevelGradient = (levelId) => {
    switch (levelId) {
        case 1: return 'from-cyan-400 to-blue-500'; // Beginner
        case 2: return 'from-amber-300 to-orange-500'; // Intermediate
        case 3: return 'from-fuchsia-500 to-violet-600'; // Advanced
        default: return 'from-cyan-400 to-blue-500';
    }
};

const getGlowColor = (levelId) => {
    switch (levelId) {
        case 1: return 'rgba(34, 211, 238, 0.4)'; // Cyan
        case 2: return 'rgba(251, 191, 36, 0.4)'; // Amber
        case 3: return 'rgba(217, 70, 239, 0.4)'; // Fuchsia
        default: return 'rgba(34, 211, 238, 0.4)';
    }
};

const HomeView = ({ onSelectLevel }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center gap-6 px-4 py-8"
        >
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                    Select Your Session
                </h2>
                <p className="text-gray-400 text-sm">
                    Choose a breathing pattern to begin your journey.
                </p>
            </div>

            <div className="flex flex-col gap-5">
                {BREATHING_LEVELS.map((level, index) => {
                    const gradient = getLevelGradient(level.id);
                    const glowColor = getGlowColor(level.id);

                    return (
                        <motion.button
                            key={level.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectLevel(level.id)}
                            className="group relative w-full text-left"
                        >
                            {/* Outer Glow */}
                            <div 
                                className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ backgroundColor: glowColor }}
                            />

                            {/* Card Content */}
                            <div className="relative w-full rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex flex-col gap-3 overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10">
                                {/* Inner Shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                                            {level.name}
                                        </h3>
                                        <p className="text-sm font-mono text-gray-400 mt-1">
                                            Ratio: {level.ratio} • {level.frequency.base}Hz
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 border-t border-white/10 pt-3 mt-1">
                                    <p className="text-sm text-gray-300 italic">
                                        "{level.description}"
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default HomeView;
