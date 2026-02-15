import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#22d3ee', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const SmokeEffect = () => {
    const [particles, setParticles] = useState([]);

    // Global click listener to detect button clicks
    useEffect(() => {
        const handleClick = (e) => {
            // Check if the click target is valid for smoke (buttons or interactive elements)
            const target = e.target.closest('button') || e.target.closest('.interactive-smoke');

            if (target) {
                const rect = target.getBoundingClientRect();
                // Spawn smoke from the center of the click or the button? 
                // User said "coming out of it", so maybe center of button?
                // Let's use click coordinates for immediate feedback, looks more dynamic.
                spawnSmoke(e.clientX, e.clientY);
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const spawnSmoke = (x, y) => {
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            x,
            y,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            angle: (Math.random() * 360) * (Math.PI / 180),
            velocity: 20 + Math.random() * 50,
            size: 5 + Math.random() * 10
        }));

        setParticles(prev => [...prev, ...newParticles]);

        // Cleanup particles after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1500);
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0.8, x: p.x, y: p.y, scale: 0.5 }}
                        animate={{
                            x: p.x + Math.cos(p.angle) * p.velocity * 2,
                            y: p.y + Math.sin(p.angle) * p.velocity * 2 - 50, // Move up slightly
                            opacity: 0,
                            scale: 2
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.size,
                            borderRadius: '50%',
                            backgroundColor: p.color,
                            boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default SmokeEffect;
