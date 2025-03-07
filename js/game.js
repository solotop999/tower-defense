// Draw enemy path
function setupPath(gameContainer) {
    let pathSvg = document.getElementById('enemy-path');
    if (!pathSvg) {
        pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pathSvg.id = 'enemy-path';
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${PATH[0].x} ${PATH[0].y}`;
        for (let i = 1; i < PATH.length; i++) {
            d += ` L ${PATH[i].x} ${PATH[i].y}`;
        }
        pathElement.setAttribute('d', d);
        pathSvg.appendChild(pathElement);
        gameContainer.appendChild(pathSvg);
    }
}

// Initialize and start the game
function initializeGame() {
    setupPath(gameContainer);
    const { updateUI, gameOverScreen, playAgainButton } = setupUI(gameContainer, gameState);
    const { startRound, stopAll } = setupGameLogic(gameState);
    setupTowerSpots(gameContainer, gameState, createTower, startRound);

    // Start game immediately
    gameState.gameStarted = true;
    startRound();

    playAgainButton.onclick = () => {
        stopAll();
        gameState.round = 1;
        gameState.enemiesSpawned = 0;
        gameState.gold = 30;
        gameState.enemiesDied = 0;
        gameState.heroHealth = 5;
        gameState.gameStarted = true;
        gameState.gameOver = false;
        gameOverScreen.style.display = 'none';
        initializeGame(); // Reinitialize
    };

    updateGame(updateUI, gameOverScreen, stopAll, startRound, gameState);
}

gameState.gameStarted = false;
gameState.gameOver = false;
initializeGame();