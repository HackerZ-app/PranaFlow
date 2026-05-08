import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Clock, Trash2, Volume2, VolumeX, AlertCircle } from 'lucide-react';

const ProfileView = ({ 
    onBack, 
    streak, 
    totalMinutes, 
    onResetData, 
    soundEnabled, 
    onToggleSound 
}) => {
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg mx-auto flex flex-col gap-8 px-4 py-8 relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between w-full relative z-30">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                        Home
                    </span>
                </button>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    Profile
                </h2>
                <div className="w-24"></div> {/* Spacer for centering */}
            </div>

            {/* Stats Section */}
            <div className="flex flex-col gap-4 mt-4">
                {/* Streak Card */}
                <div className="relative group w-full rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex items-center justify-center gap-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full" />
                    
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-600/20 border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                        <Flame size={32} className="text-orange-400" />
                    </div>
                    <div className="relative z-10 flex flex-col">
                        <span className="text-4xl font-light tabular-nums tracking-tighter text-white">
                            {streak}
                        </span>
                        <span className="text-sm font-medium text-orange-200/60 uppercase tracking-widest mt-1">
                            Day Streak
                        </span>
                    </div>
                </div>

                {/* Total Minutes Card */}
                <div className="relative w-full rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex items-center justify-center gap-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-50" />
                    
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <Clock size={32} className="text-cyan-400" />
                    </div>
                    <div className="relative z-10 flex flex-col">
                        <span className="text-4xl font-light tabular-nums tracking-tighter text-white">
                            {totalMinutes}
                        </span>
                        <span className="text-sm font-medium text-cyan-200/60 uppercase tracking-widest mt-1">
                            Mindful Minutes
                        </span>
                    </div>
                </div>
            </div>

            {/* Settings Section */}
            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest px-2">
                    Settings
                </h3>

                <div className="flex flex-col rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden">
                    
                    {/* Sound Setting */}
                    <button 
                        onClick={onToggleSound}
                        className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-300">
                                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-base font-medium text-white">Ambient Sound</span>
                                <span className="text-xs text-gray-400">Play binaural beats during sessions</span>
                            </div>
                        </div>
                        {/* Custom Toggle Switch */}
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${soundEnabled ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                            <motion.div 
                                className="w-4 h-4 bg-white rounded-full shadow-md"
                                animate={{ x: soundEnabled ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </button>

                    {/* Reset Data Setting */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {!showConfirmReset ? (
                                <motion.button
                                    key="reset-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowConfirmReset(true)}
                                    className="flex items-center gap-4 w-full group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors">
                                        <Trash2 size={20} />
                                    </div>
                                    <span className="text-base font-medium text-red-400 group-hover:text-red-300 transition-colors">
                                        Reset Progress
                                    </span>
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="confirm-reset"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-4 overflow-hidden"
                                >
                                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                        <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-200">
                                            Are you sure? This will permanently delete your streak and total minutes. This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowConfirmReset(false)}
                                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                onResetData();
                                                setShowConfirmReset(false);
                                            }}
                                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                                        >
                                            Yes, Reset
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

        </motion.div>
    );
};

export default ProfileView;
