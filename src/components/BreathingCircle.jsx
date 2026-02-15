import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BreathingCircle = ({ phase, timeLeft, level }) => {

    // Dynamic colors based on phase
    const colors = {
        inhale: { main: '#67E8F9', glow: 'rgba(103, 232, 249, 0.4)', text: 'text-cyan-300' }, // Cyan
        hold: { main: '#FCD34D', glow: 'rgba(252, 211, 77, 0.4)', text: 'text-amber-300' },   // Amber/Gold
        exhale: { main: '#F87171', glow: 'rgba(248, 113, 113, 0.4)', text: 'text-red-300' },    // Soft Red/Orange
        idle: { main: '#94A3B8', glow: 'rgba(148, 163, 184, 0.1)', text: 'text-slate-400' }
    };

    const currentTheme = colors[phase] || colors.idle;

    const getScale = () => {
        switch (phase) {
            case 'inhale': return 1.6;
            case 'hold': return 1.65;
            case 'exhale': return 1;
            default: return 1;
        }
    };

    const duration = phase === 'idle' ? 0.5 : level.phases[phase];

    return (
        <div className="relative flex items-center justify-center w-[90vw] max-w-[350px] aspect-square">

            {/* Outer Glow Ring (Echo) */}
            <motion.div
                className="absolute rounded-full border border-white/10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: phase === 'idle' ? 1 : getScale() * 1.4,
                    opacity: phase === 'inhale' ? [0, 0.3, 0] : phase === 'exhale' ? [0.3, 0] : 0.1,
                    borderColor: currentTheme.main
                }}
                transition={{ duration: duration, ease: "easeInOut" }}
                style={{ width: '250px', height: '250px' }}
            />

            {/* Ambient Blur Layer */}
            <motion.div
                className="absolute rounded-full blur-3xl z-0"
                animate={{
                    scale: phase === 'idle' ? 1 : getScale() * 1.2,
                    backgroundColor: currentTheme.main,
                    opacity: phase === 'hold' ? 0.5 : 0.2
                }}
                transition={{ duration: duration, ease: "easeInOut" }}
                style={{ width: '200px', height: '200px' }}
            />

            {/* Main Circle */}
            <motion.div
                className="relative z-10 flex items-center justify-center rounded-full glass-circle"
                animate={{
                    scale: getScale(),
                    boxShadow: `0 0 40px ${currentTheme.glow}, inset 0 0 20px rgba(255,255,255,0.1)`
                }}
                transition={{ duration: duration, ease: "easeInOut" }}
                style={{
                    width: '220px',
                    height: '220px',
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(0,0,0,0.2))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                {/* Inner Progress Ring (Optional visual texture) */}
                <svg className="absolute w-full h-full rotate-[-90deg] opacity-30" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>

                <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={phase}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-lg font-medium tracking-[0.2em] uppercase mb-1 ${currentTheme.text}`}
                        >
                            {phase === 'idle' ? 'PRANA' : phase}
                        </motion.span>
                    </AnimatePresence>

                    <motion.span
                        key={timeLeft}
                        initial={{ opacity: 0.5, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-light text-white tabular-nums tracking-tighter drop-shadow-lg"
                    >
                        {phase === 'idle' ? level.totalDuration : timeLeft}
                    </motion.span>

                    {phase === 'idle' && (
                        <span className="text-xs text-white/40 mt-1 uppercase tracking-widest">Seconds</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BreathingCircle;
