import { useState, useEffect, useCallback } from 'react';

export const useStreaks = () => {
    const [streak, setStreak] = useState(0);
    const [lastLogDate, setLastLogDate] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        const storedStreak = parseInt(localStorage.getItem('pranaflow_streak') || '0', 10);
        const storedDate = localStorage.getItem('pranaflow_last_log');
        const storedMinutes = parseInt(localStorage.getItem('pranaflow_total_minutes') || '0', 10);

        setTotalMinutes(storedMinutes);

        const today = new Date().toLocaleDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toLocaleDateString();

        if (storedDate && storedDate !== today && storedDate !== yesterdayString) {
            // Streak broken
            setStreak(0);
            setLastLogDate(storedDate);
            // Optionally, we could immediately save the broken streak to localStorage here
            // localStorage.setItem('pranaflow_streak', '0');
        } else {
            // Valid streak (either logged today or yesterday)
            setStreak(storedStreak);
            setLastLogDate(storedDate);
        }
    }, []);

    const logSession = useCallback((minutesToAdd) => {
        if (!minutesToAdd || minutesToAdd <= 0) return;

        // 1. Always update Total Mindful Minutes (regardless of duration)
        setTotalMinutes(prev => {
            const newTotal = prev + minutesToAdd;
            localStorage.setItem('pranaflow_total_minutes', newTotal.toString());
            return newTotal;
        });

        // 2. Handle Streak Logic — only if session was >= 7 minutes
        if (minutesToAdd < 7) return; // Below threshold: minutes logged, but streak untouched

        const today = new Date().toLocaleDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toLocaleDateString();

        setStreak(prevStreak => {
            let newStreak = prevStreak;
            
            setLastLogDate(prevDate => {
                if (prevDate === today) {
                    // Already logged today, streak remains the same
                    return prevDate;
                }
                
                // If last log was yesterday, increment. Otherwise, fresh start.
                if (prevDate === yesterdayString) {
                    newStreak = prevStreak + 1;
                } else {
                    newStreak = 1;
                }
                
                localStorage.setItem('pranaflow_streak', newStreak.toString());
                localStorage.setItem('pranaflow_last_log', today);
                
                return today;
            });

            return newStreak;
        });
    }, []);

    const resetData = useCallback(() => {
        localStorage.removeItem('pranaflow_streak');
        localStorage.removeItem('pranaflow_last_log');
        localStorage.removeItem('pranaflow_total_minutes');
        setStreak(0);
        setLastLogDate(null);
        setTotalMinutes(0);
    }, []);

    return { streak, totalMinutes, logSession, resetData, lastLogDate };
};
