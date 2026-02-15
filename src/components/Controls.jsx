import React from 'react';
import { Play, Square, Volume2, VolumeX, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BREATHING_LEVELS = [
    { id: 1, name: 'Beginner', ratio: '1:1:2', color: 'from-cyan-400 to-blue-500' },
    { id: 2, name: 'Intermediate', ratio: '1:2:2', color: 'from-amber-300 to-orange-500' },
    { id: 3, name: 'Advanced', ratio: '1:4:2', color: 'from-fuchsia-500 to-violet-600' }
];

const Controls = ({
    isActive,
    isPaused,
    onTogglePlay,
    onStop,
    onToggleSound,
    soundEnabled,
    currentLevelId,
    onChangeLevel
}) => {

    const getSmokeColor = (levelId) => {
        switch (levelId) {
            case 1: return 'linear-gradient(135deg, #22d3ee, #3b82f6)'; // Cyan/Blue
            case 2: return 'linear-gradient(135deg, #fcd34d, #f97316)'; // Gold/Amber
            case 3: return 'linear-gradient(135deg, #d946ef, #8b5cf6)'; // Violet/Magenta
            default: return 'linear-gradient(135deg, #22d3ee, #3b82f6)';
        }
    };

    const activeColor = getSmokeColor(currentLevelId);

    // Reusable Component for Neon/Smoke Buttons
    const NeonButton = ({ onClick, children, isActive, disabled, className, colorGradient }) => {
        const gradient = colorGradient || activeColor;
        return (
            <motion.div
                className={`relative group ${className}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* The Neon Glow - Static but pulses on hover */}
                <div
                    className={`absolute inset-0 rounded-xl blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500`}
                    style={{ background: gradient }}
                />
                {isActive && (
                    <div
                        className="absolute inset-0 rounded-xl blur-lg opacity-40 animate-pulse"
                        style={{ background: gradient }}
                    />
                )}

                {/* The Button Base */}
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={`
                    relative w-full h-full rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 
                    flex items-center justify-center shadow-2xl z-10 overflow-hidden transition-all duration-300
                    ${isActive ? 'border-white/30 bg-white/5' : 'hover:border-white/20 hover:bg-white/5'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                    style={{
                        boxShadow: isActive ? `0 0 15px ${gradient.match(/#[0-9a-f]{6}/i)?.[0] || 'rgba(255,255,255,0.2)'}40` : 'none'
                    }}
                >
                    {/* Inner Shine/Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                </button>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-lg">

            {/* Level Selector - Modern Glass Cards with Neon Glow */}
            <div className="flex items-center justify-center gap-4 w-full px-2">
                {BREATHING_LEVELS.map((level) => {
                    const isSelected = currentLevelId === level.id;
                    const levelGradient = getSmokeColor(level.id);

                    return (
                        <NeonButton
                            key={level.id}
                            onClick={() => onChangeLevel(level.id)}
                            isActive={isSelected}
                            disabled={isActive}
                            colorGradient={levelGradient}
                            className="flex-1 h-14"
                        >
                            <div className="flex flex-col items-center leading-none gap-1">
                                <span className={`text-sm font-bold tracking-wide ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                    {level.name}
                                </span>
                                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                    {level.ratio}
                                </span>
                            </div>
                        </NeonButton>
                    );
                })}
            </div>

            {/* Main Controls Row */}
            <div className="flex items-center gap-8">

                {/* Sound Toggle */}
                <NeonButton
                    onClick={onToggleSound}
                    className="w-14 h-14 !rounded-full" // Force round shape for utility buttons
                    colorGradient={activeColor}
                >
                    {soundEnabled ? <Volume2 size={24} className="text-white" /> : <VolumeX size={24} className="text-white/50" />}
                </NeonButton>

                {/* Play/Pause Button - Big Centerpiece */}
                <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* The Main Glow */}
                    <div
                        className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"
                        style={{ background: activeColor }}
                    />
                    {isActive && !isPaused && (
                        <div
                            className="absolute inset-[-5px] rounded-full blur-2xl opacity-40 animate-pulse"
                            style={{ background: activeColor }}
                        />
                    )}

                    {/* The Button Base */}
                    <button
                        onClick={onTogglePlay}
                        className="relative w-24 h-24 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl z-10 overflow-hidden"
                        style={{
                            boxShadow: `0 0 20px ${activeColor.match(/#[0-9a-f]{6}/i)?.[0] || 'rgba(255,255,255,0.2)'}30`
                        }}
                    >
                        {/* Inner Shine/Gloss */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />

                        {isActive && !isPaused ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-1"
                            >
                                <Pause fill="white" size={32} className="relative z-10 drop-shadow-lg" />
                            </motion.div>
                        ) : (
                            <Play fill="white" size={36} className="relative z-10 ml-1 drop-shadow-lg" />
                        )}
                    </button>
                </motion.div>


                {/* Stop Button */}
                <NeonButton
                    onClick={onStop}
                    disabled={!isActive && !isPaused}
                    className="w-14 h-14 !rounded-full"
                    colorGradient="linear-gradient(135deg, #ef4444, #b91c1c)" // Red Gradient
                >
                    <Square
                        size={20}
                        fill="currentColor"
                        className={`transition-colors ${!isActive ? 'text-gray-500' : 'text-white group-hover:text-red-400'}`}
                    />
                </NeonButton>

            </div>

        </div>
    );
};

export default Controls;
