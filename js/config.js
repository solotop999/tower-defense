// Game container
const gameContainer = document.getElementById('game-container');

// Path for enemies
const PATH = [
    { x: 0, y: 300 },
    { x: 200, y: 300 },
    { x: 200, y: 100 },
    { x: 400, y: 100 },
    { x: 400, y: 500 },
    { x: 600, y: 500 },
];

// Tower spot positions
const TOWER_SPOTS = [
    { x: 100, y: 200 },
    { x: 300, y: 200 },
    { x: 100, y: 400 },
    { x: 300, y: 400 },
];

// Game state
const gameState = {
    round: 1,
    enemiesSpawned: 0,
    gold: 30, // Start with 30 gold
    enemies: [],
    towers: [],
    projectiles: [],
    enemiesDied: 0,
    heroHealth: 5,
};