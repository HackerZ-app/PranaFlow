import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export const MILESTONES = [7, 12, 15, 18, 21];

const GlobalTimer = ({ isActive, isPaused, onMilestoneReached, onTimeUpdate }) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const accumulatedRef = useRef(0);
    const lastTickRef = useRef(null);
    const animationFrameRef = useRef(null);
    const reportedMilestones = useRef(new Set());

    useEffect(() => {
        if (isActive && !isPaused) {
            lastTickRef.current = performance.now();
            
            const tick = (currentTime) => {
                const delta = currentTime - lastTickRef.current;
                lastTickRef.current = currentTime;
                accumulatedRef.current += delta;
                
                const currentSeconds = Math.floor(accumulatedRef.current / 1000);
                
                setElapsedSeconds(prev => {
                    if (currentSeconds !== prev) {
                        if (onTimeUpdate) {
                            onTimeUpdate(currentSeconds);
                        }
                        
                        // Check milestones
                        const minutes = Math.floor(currentSeconds / 60);
                        const remainder = currentSeconds % 60;
                        
                        if (remainder === 0 && minutes > 0 && MILESTONES.includes(minutes) && !reportedMilestones.current.has(minutes)) {
                            reportedMilestones.current.add(minutes);
                            if (onMilestoneReached) {
                                onMilestoneReached(minutes);
                            }
                        }
                        return currentSeconds;
                    }
                    return prev;
                });
                
                animationFrameRef.current = requestAnimationFrame(tick);
            };
            
            animationFrameRef.current = requestAnimationFrame(tick);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            lastTickRef.current = null;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, isPaused, onMilestoneReached, onTimeUpdate]);

    // Reset when completely stopped
    useEffect(() => {
        if (!isActive) {
            accumulatedRef.current = 0;
            setElapsedSeconds(0);
            reportedMilestones.current.clear();
        }
    }, [isActive]);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!isActive && elapsedSeconds === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center pointer-events-none mt-2"
        >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 shadow-lg">
                <Clock size={14} className="text-gray-400" />
                <span className="font-mono tabular-nums font-bold text-sm text-gray-200 tracking-wider">
                    {formatTime(elapsedSeconds)}
                </span>
            </div>
        </motion.div>
    );
};

export default GlobalTimer;
