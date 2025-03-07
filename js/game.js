// Initialize tower spots and UI
function initializeGame() {
    TOWER_SPOTS.forEach(spot => {
        const spotDiv = document.createElement('div');
        spotDiv.classList.add('tower-spot');
        spotDiv.style.left = spot.x + 'px';
        spotDiv.style.top = spot.y + 'px';
        gameContainer.appendChild(spotDiv);
        spotDiv.addEventListener('click', () => createTower(spot.x, spot.y));
    });

    // UI setup
    const uiContainer = document.getElementById('ui-container');
    const goldDisplay = document.createElement('div');
    const enemiesAliveDisplay = document.createElement('div');
    const enemiesDiedDisplay = document.createElement('div');

    goldDisplay.id = 'gold-display';
    enemiesAliveDisplay.id = 'enemies-alive-display';
    enemiesDiedDisplay.id = 'enemies-died-display';

    uiContainer.appendChild(goldDisplay);
    uiContainer.appendChild(enemiesAliveDisplay);
    uiContainer.appendChild(enemiesDiedDisplay);

    // Define updateUI locally
    function updateUI() {
        goldDisplay.textContent = `Gold: ${gameState.gold}`;
        enemiesAliveDisplay.textContent = `Enemies Alive: ${gameState.enemies.length}`;
        enemiesDiedDisplay.textContent = `Enemies Died: ${gameState.enemiesDied}`;
    }

    // Start the round
    startRound();

    // Return updateUI so it can be used in the game loop
    return updateUI;
}

// Start a round
function startRound() {
    console.log(`Starting Round ${gameState.round}`);
    const spawnInterval = setInterval(() => {
        if (gameState.enemiesSpawned < 100) {
            createEnemy();
        } else {
            clearInterval(spawnInterval);
            console.log(`Round ${gameState.round} spawning complete`);
        }
    }, 500);
}

// Main game loop
function update(updateUI) {
    updateEnemies();
    updateTowers();
    updateUI(); // Call the locally defined updateUI

    if (gameState.enemies.length === 0 && gameState.enemiesSpawned >= 100) {
        gameState.round++;
        gameState.enemiesSpawned = 0;
        startRound();
    }

    requestAnimationFrame(() => update(updateUI));
}

// Start the game
const updateUI = initializeGame();
update(updateUI);