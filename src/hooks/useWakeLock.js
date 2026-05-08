import { useState, useEffect, useCallback, useRef } from 'react';

export function useWakeLock() {
    const [isSupported] = useState('wakeLock' in navigator);
    const wakeLockRef = useRef(null);

    const requestWakeLock = useCallback(async () => {
        if (!isSupported) {
            console.warn('Screen Wake Lock API not supported on this browser.');
            return;
        }
        try {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
            wakeLockRef.current.addEventListener('release', () => {
                console.log('Screen Wake Lock released:', wakeLockRef.current.released);
            });
            console.log('Screen Wake Lock acquired.');
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    }, [isSupported]);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current && !wakeLockRef.current.released) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    }, []);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [requestWakeLock]);

    useEffect(() => {
        return () => {
            releaseWakeLock();
        };
    }, [releaseWakeLock]);

    return { requestWakeLock, releaseWakeLock, isSupported };
}
