import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
    "Keep your spine erect to allow Prana to flow through the Sushumna Nadi.",
    "Relax your shoulders and jaw during the Hold phase.",
    "Focus on the Third Eye point (Ajna Chakra) for deeper concentration.",
    "If you feel anxious, focus on the 8-second exhale to trigger the parasympathetic nervous system.",
    "Use Jnana Mudra (index finger and thumb touching) to lock your focus.",
    "Level 3 is best done in the morning on an empty stomach.",
    "Visualize a golden light expanding in your chest as you hold.",
    "Let the breath be silent and smooth, like pouring oil."
];

const AyurvedicTips = ({ phase, levelId }) => {
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        // Rotate tips every 10 seconds or based on phase?
        // Requirement: "Based on phase or level"
        // Let's rotate periodically for now, but maybe prioritize specific tips?
        // For simplicity and "rotating" requirement, interval is best.
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % TIPS.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Filter tips? 
    // Maybe show specific tip for Level 3?
    let displayTip = TIPS[currentTip];
    if (levelId === 3 && currentTip % 3 === 0) {
        displayTip = "Level 3 is best done in the morning on an empty stomach.";
    }
    if (phase === 'exhale' && currentTip % 4 === 0) {
        displayTip = "If you feel anxious, focus on the 8-second exhale.";
    }

    return (
        <div className="h-20 w-full max-w-lg flex items-center justify-center px-4 mt-8">
            <AnimatePresence mode="wait">
                <motion.p
                    key={displayTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-sm md:text-base text-cyan-100/60 font-medium italic"
                >
                    "{displayTip}"
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

export default AyurvedicTips;
