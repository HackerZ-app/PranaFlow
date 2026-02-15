import React, { useEffect } from 'react';
import { useBreathingCycle } from './hooks/useBreathingCycle';
import { useStreaks } from './hooks/useStreaks';
import BreathingCircle from './components/BreathingCircle';
import Controls from './components/Controls';
import AyurvedicTips from './components/AyurvedicTips';
import SmokeEffect from './components/SmokeEffect';
import { motion } from 'framer-motion';
import { Flame, Activity, Wind } from 'lucide-react';

function App() {
    const {
        phase,
        timeLeft,
        isActive,
        isPaused,
        levelId,
        currentLevel,
        soundEnabled,
        cyclesCompleted,
        togglePlay,
        stop,
        toggleSound,
        changeLevel
    } = useBreathingCycle();

    const { streak, incrementStreak, lastLogDate } = useStreaks();

    // Effect: Auto-log streak if user completes at least 1 full cycle
    useEffect(() => {
        if (cyclesCompleted > 0) {
            incrementStreak();
        }
    }, [cyclesCompleted, incrementStreak]);

    return (
        <div className="relative min-h-screen bg-[#050511] text-white overflow-hidden selection:bg-cyan-500/30 font-sans">

            {/* Global Smoke Effect Layer */}
            <SmokeEffect />

            {/* Dynamic Background */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />

                {/* Noise/Grain Overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            <main className="relative z-10 flex flex-col items-center min-h-screen py-4 px-4 gap-6 md:gap-8">

                {/* Header - Refactored for clearer spacing */}
                <header className="w-full flex justify-between items-center max-w-4xl z-20">
                    {/* Logo - Premium Glassmorphism */}
                    <div className="flex items-center gap-3 group cursor-default">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Wind size={20} className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-100 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] hidden sm:block">
                            PranaFlow
                        </h1>
                    </div>

                    {/* Stats Container - Stack on very small screens, row on others */}
                    <div className="flex flex-row gap-3 items-center">

                        {/* Streak Counter */}
                        <div className="group relative flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/10 backdrop-blur-xl border border-orange-500/20 px-4 py-2 rounded-2xl shadow-lg transition-all hover:scale-105 hover:bg-orange-500/30">
                            <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-50 transition-opacity" />
                            <Flame size={16} className={`${streak > 0 ? 'fill-orange-500 text-orange-500 animate-pulse' : 'text-gray-400'}`} />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-orange-200 uppercase tracking-wider font-bold opacity-60">Streak</span>
                                <span className="text-sm font-bold font-mono text-orange-100">{streak} <span className="text-[10px] font-normal">days</span></span>
                            </div>
                        </div>

                        {/* Frequency/Hertz */}
                        <div className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 px-4 py-2 rounded-2xl shadow-lg transition-all hover:scale-105 hover:bg-cyan-500/30">
                            <Activity size={16} className={`${isActive && !isPaused ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-cyan-200 uppercase tracking-wider font-bold opacity-60">Freq</span>
                                <span className="text-sm font-bold font-mono text-cyan-100">{Math.round(currentLevel.frequency.base)}<span className="text-[10px] font-normal">Hz</span></span>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Content Area - Grow to fill space */}
                <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 min-h-[300px]">
                    <BreathingCircle
                        phase={phase}
                        timeLeft={timeLeft}
                        level={currentLevel}
                    />

                    <AyurvedicTips phase={phase} levelId={levelId} />
                </div>

                {/* Footer Controls */}
                <div className="w-full flex flex-col items-center z-20 pb-4">
                    <Controls
                        isActive={isActive}
                        isPaused={isPaused}
                        onTogglePlay={togglePlay}
                        onStop={stop}
                        onToggleSound={toggleSound}
                        soundEnabled={soundEnabled}
                        currentLevelId={levelId}
                        onChangeLevel={changeLevel}
                    />
                </div>

            </main>
        </div>
    );
}

export default App;
