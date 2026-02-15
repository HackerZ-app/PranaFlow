import { useState, useEffect, useRef, useCallback } from 'react';
import { BREATHING_LEVELS } from '../constants/levels';
import { audioEngine } from '../utils/audioEngine';

export const useBreathingCycle = () => {
    const [levelId, setLevelId] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [phase, setPhase] = useState('idle'); // 'inhale', 'hold', 'exhale', 'idle'
    const [timeLeft, setTimeLeft] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);

    const timerRef = useRef(null);

    const currentLevel = BREATHING_LEVELS.find(l => l.id === levelId) || BREATHING_LEVELS[0];

    const startNextPhase = useCallback((nextPhase) => {
        setPhase(nextPhase);
        setTimeLeft(currentLevel.phases[nextPhase]);

        // Check if we completed a full cycle (Exhale -> Inhale or Exhale -> Idle)
        // Actually nextPhase passed from useEffect is correct.
        // Logic in useEffect: if phase === 'exhale' next is 'inhale'.
        // So if nextPhase is 'inhale' and we were active, we finished a cycle.
        if (nextPhase === 'inhale' && isActive) {
            setCyclesCompleted(c => c + 1);
        }

        if (soundEnabled && isActive && !isPaused) {
            audioEngine.playChime();
        }
    }, [currentLevel, soundEnabled, isActive, isPaused]);

    const stop = useCallback(() => {
        setIsActive(false);
        setIsPaused(false);
        setPhase('idle');
        setTimeLeft(0);
        setCyclesCompleted(0); // Reset cycles on stop
        audioEngine.stop();
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (isActive) {
            // Toggle Pause/Resume
            if (isPaused) {
                setIsPaused(false);
                if (soundEnabled) {
                    audioEngine.playBinauralBeat(currentLevel.frequency.base, currentLevel.frequency.binaural);
                }
            } else {
                setIsPaused(true);
                audioEngine.stop();
            }
        } else {
            // Start
            setIsActive(true);
            setIsPaused(false);
            setCyclesCompleted(0); // Ensure 0 on start
            startNextPhase('inhale');
            if (soundEnabled) {
                audioEngine.playBinauralBeat(currentLevel.frequency.base, currentLevel.frequency.binaural);
            }
        }
    }, [isActive, isPaused, startNextPhase, soundEnabled, currentLevel]);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => {
            const nextState = !prev;
            if (isActive && !isPaused) {
                if (nextState) {
                    audioEngine.playBinauralBeat(currentLevel.frequency.base, currentLevel.frequency.binaural);
                } else {
                    audioEngine.stop();
                }
            }
            return nextState;
        });
    }, [isActive, isPaused, currentLevel]);

    const changeLevel = useCallback((id) => {
        stop();
        setLevelId(id);
    }, [stop]);

    // Timer Logic
    useEffect(() => {
        if (!isActive || isPaused) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Phase finished, switch to next
                    let nextPhase = 'idle';
                    if (phase === 'inhale') nextPhase = 'hold';
                    else if (phase === 'hold') nextPhase = 'exhale';
                    else if (phase === 'exhale') nextPhase = 'inhale';

                    startNextPhase(nextPhase);
                    return currentLevel.phases[nextPhase]; // Reset timer for new phase
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, isPaused, phase, startNextPhase, currentLevel]);

    return {
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
    };
};
