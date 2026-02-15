import { useState, useEffect } from 'react';

export const useStreaks = () => {
    const [streak, setStreak] = useState(0);
    const [lastLogDate, setLastLogDate] = useState(null);

    useEffect(() => {
        const storedStreak = parseInt(localStorage.getItem('pranaflow_streak') || '0');
        const storedDate = localStorage.getItem('pranaflow_last_log');

        setStreak(storedStreak);
        setLastLogDate(storedDate);

        // Check availability on load?
        // If the user missed yesterday, technically the streak is 0 today unless they meditate.
        // But usually we show the number they *will* lose if they don't meditate, or 0?
        // Let's show the *current* active streak. 
        // If last log was yesterday, streak is valid. 
        // If last log was today, streak is valid.
        // If last log was before yesterday, streak is effectively broken (0) for the *next* update, 
        // but traditionally apps show 0 if broken.

        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (storedDate && storedDate !== today && storedDate !== yesterdayString) {
            // Streak broken
            // We won't update LS yet, but visually we might want to know?
            // Actually, simplest is: logic handled on "increment".
        }
    }, []);

    const incrementStreak = () => {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        let newStreak = streak;

        if (lastLogDate === today) {
            // Already logged today, do nothing
            return;
        }

        if (lastLogDate === yesterdayString) {
            // Continued streak
            newStreak += 1;
        } else {
            // Broken streak or fresh start
            newStreak = 1;
        }

        setStreak(newStreak);
        setLastLogDate(today);

        localStorage.setItem('pranaflow_streak', newStreak.toString());
        localStorage.setItem('pranaflow_last_log', today);
    };

    return { streak, incrementStreak, lastLogDate };
};
