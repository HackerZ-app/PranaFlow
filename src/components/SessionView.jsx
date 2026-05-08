import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import BreathingCircle from './BreathingCircle';
import AyurvedicTips from './AyurvedicTips';
import Controls from './Controls';
import GlobalTimer, { MILESTONES } from './GlobalTimer';
import { audioEngine } from '../utils/audioEngine';
import { useWakeLock } from '../hooks/useWakeLock';

const SessionView = ({ 
    onEndSession,
    phase,
    timeLeft,
    isActive,
    isPaused,
    levelId,
    currentLevel,
    soundEnabled,
    togglePlay,
    stop,
    toggleSound
}) => {
    const { requestWakeLock, releaseWakeLock } = useWakeLock();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [activeMilestone, setActiveMilestone] = useState(null);
    const [showEarlyExitModal, setShowEarlyExitModal] = useState(false);

    useEffect(() => {
        // Request wake lock when entering session view
        requestWakeLock();
        return () => {
            // Release on unmount
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    useEffect(() => {
        let timeout;
        if (activeMilestone) {
            timeout = setTimeout(() => {
                setActiveMilestone(null);
            }, 10000); // fade out after 10 seconds
        }
        return () => clearTimeout(timeout);
    }, [activeMilestone]);

    const handleAttemptEndSession = () => {
        const minutes = Math.floor(elapsedSeconds / 60);
        const isMilestone = MILESTONES.includes(minutes);
        
        // If less than 7 mins, or between milestones (and less than final milestone 21)
        if (minutes < 7 || (minutes < 21 && !isMilestone)) {
            if (isActive && !isPaused) {
                togglePlay(); // Pause the session
            }
            setShowEarlyExitModal(true);
        } else {
            handleConfirmedEndSession();
        }
    };

    const handleConfirmedEndSession = () => {
        setShowEarlyExitModal(false);
        setActiveMilestone(null);
        stop(); // Stop the breathing cycle and log time
        releaseWakeLock(); // Release the screen wake lock
        onEndSession(); // Return to home view
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col items-center relative pt-20"
        >
            {/* End Session Button */}
            <div className="absolute top-4 left-4 z-40">
                <button
                    onClick={handleAttemptEndSession}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                >
                    <ArrowLeft size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors hidden sm:block">
                        End
                    </span>
                </button>
            </div>

            {/* Global Timer - Integrated into Flex Flow with massive margin */}
            <div className="w-full flex justify-center z-40 mb-16">
                <GlobalTimer 
                    isActive={isActive} 
                    isPaused={isPaused} 
                    onTimeUpdate={setElapsedSeconds}
                    onMilestoneReached={(mins) => {
                        setActiveMilestone(mins);
                        if (soundEnabled) {
                            audioEngine.playSingingBowl();
                        }
                    }}
                />
            </div>

            {/* Breathing Circle Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center gap-20 min-h-[300px] md:mt-0 pb-8">
                <BreathingCircle
                    phase={phase}
                    timeLeft={timeLeft}
                    level={currentLevel}
                />
                <AyurvedicTips phase={phase} levelId={levelId} />
            </div>

            {/* Controls Area */}
            <div className="w-full flex flex-col items-center z-20 pb-4 mt-8">
                <Controls
                    isActive={isActive}
                    isPaused={isPaused}
                    onTogglePlay={togglePlay}
                    onStop={stop}
                    onToggleSound={toggleSound}
                    soundEnabled={soundEnabled}
                    currentLevelId={levelId}
                />
            </div>

            <AnimatePresence>
                {/* Early Exit Interceptor Modal */}
                {showEarlyExitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-sm bg-[#11111a] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-6"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <ShieldAlert className="text-orange-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Leaving too early?</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Your mind is just beginning to settle. Completing at least 7 minutes provides the best Ayurvedic benefits.
                                </p>
                            </div>
                            <div className="flex flex-col w-full gap-3 mt-2">
                                <button
                                    onClick={() => {
                                        setShowEarlyExitModal(false);
                                        togglePlay(); // Resume
                                    }}
                                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                                >
                                    Continue Meditation
                                </button>
                                <button
                                    onClick={handleConfirmedEndSession}
                                    className="w-full py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    End Session Anyway
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Milestone Slide-Up */}
                {activeMilestone && !showEarlyExitModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                    >
                        <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(34,211,238,0.15)] flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-cyan-400 shrink-0" size={20} />
                                <span className="font-medium text-white">
                                    Stage Complete: {activeMilestone} Minutes of Prana.
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveMilestone(null)}
                                    className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors"
                                >
                                    Continue Journey
                                </button>
                                <button
                                    onClick={handleConfirmedEndSession}
                                    className="flex-1 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-sm font-bold text-cyan-300 transition-colors"
                                >
                                    Complete Session
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SessionView;
