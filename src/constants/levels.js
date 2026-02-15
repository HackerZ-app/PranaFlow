export const BREATHING_LEVELS = [
    {
        id: 1,
        name: "Beginner",
        ratio: "1:1:2",
        totalDuration: 16,
        phases: {
            inhale: 4,
            hold: 4,
            exhale: 8
        },
        frequency: {
            base: 528, // Miracle/Healing
            binaural: 5 // Theta/Alpha bridge
        },
        description: "Healing & Balance (528 Hz)"
    },
    {
        id: 2,
        name: "Intermediate",
        ratio: "1:2:2",
        totalDuration: 20,
        phases: {
            inhale: 4,
            hold: 8,
            exhale: 8
        },
        frequency: {
            base: 432, // Earth/Grounding
            binaural: 4 // Theta
        },
        description: "Grounding & Peace (432 Hz)"
    },
    {
        id: 3,
        name: "Advanced",
        ratio: "1:4:2",
        totalDuration: 28,
        phases: {
            inhale: 4,
            hold: 16,
            exhale: 8
        },
        frequency: {
            base: 174, // Pain Relief / Security
            binaural: 7.83 // Schumann Resonance
        },
        description: "Deep Release (174 Hz + 7.83 Hz)"
    }
];

export const PHASE_COLORS = {
    inhale: "text-inhale-blue",
    hold: "text-hold-gold",
    exhale: "text-exhale-orange",
    idle: "text-white"
};

export const PHASE_BG_COLORS = {
    inhale: "bg-inhale-blue",
    hold: "bg-hold-gold",
    exhale: "bg-exhale-orange",
    idle: "bg-gray-500"
};
