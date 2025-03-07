function setupGameLogic(gameState) {
    let spawnInterval = null;

    function startRound() {
        console.log(`Starting Round ${gameState.round}`);
        spawnInterval = setInterval(() => {
            if (gameState.enemiesSpawned < 100) {
                createEnemy();
            } else {
                clearInterval(spawnInterval);
                console.log(`Round ${gameState.round} spawning complete`);
            }
        }, 500);
    }

    function stopAll() {
        if (spawnInterval) {
            clearInterval(spawnInterval);
        }
        gameState.enemies.forEach(enemy => enemy.element.remove());
        gameState.towers.forEach(tower => tower.element.remove());
        gameState.projectiles.forEach(projectile => projectile.element.remove());
        gameState.enemies = [];
        gameState.towers = [];
        gameState.projectiles = [];
    }

    return { startRound, stopAll };
}

function updateGame(updateUI, gameOverScreen, stopAll, startRound, gameState) {
    if (!gameState.gameOver) {
        updateEnemies();
        updateTowers();
    }
    updateUI();

    if (gameState.heroHealth <= 0) {
        gameState.gameOver = true;
        stopAll();
        gameOverScreen.style.display = 'block';
        return;
    }

    if (gameState.enemies.length === 0 && gameState.enemiesSpawned >= 100 && gameState.gameStarted) {
        gameState.round++;
        gameState.enemiesSpawned = 0;
        startRound();
    }

    requestAnimationFrame(() => updateGame(updateUI, gameOverScreen, stopAll, startRound, gameState));
}