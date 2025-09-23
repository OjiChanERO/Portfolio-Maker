// This file defines the static positions for all nodes on the Skill Map.

export const layoutConfig = {
    // Position of the central user node.
    center: { x: 550, y: 300 },

    // Positions for the main category nodes, orbiting the center.
    categories: [
        { name: 'Fighting', x: 250, y: 450, color: '#f38ba8' }, // Red
        { name: 'Laning Phase', x: 250, y: 150, color: '#89b4fa' }, // Blue
        { name: 'Objectives', x: 450, y: 550, color: '#f9e2af' }, // Yellow
        { name: 'Vision', x: 650, y: 100, color: '#a6e3a1' }, // Green
        { name: 'Survivability', x: 850, y: 250, color: '#cba6f7' }, // Purple
        { name: 'Adaptability', x: 850, y: 450, color: '#f5c2e7' }, // Pink
    ],

    // Relative positions for individual skills, orbiting their parent category.
    skills: [
        { dx: -70, dy: -40 },
        { dx: 70, dy: -40 },
        { dx: -70, dy: 40 },
        { dx: 70, dy: 40 },
        { dx: 0, dy: -70 },
        { dx: 0, dy: 70 },
    ]
};
