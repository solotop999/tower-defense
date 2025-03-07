function setupUI(gameContainer, gameState, startRound) {
    // Regular UI (top-right)
    let uiContainer = document.getElementById('ui-container');
    if (!uiContainer) {
        uiContainer = document.createElement('div');
        uiContainer.id = 'ui-container';
        gameContainer.appendChild(uiContainer);
    }
    let goldDisplay = document.getElementById('gold-display');
    if (!goldDisplay) {
        goldDisplay = document.createElement('div');
        goldDisplay.id = 'gold-display';
        uiContainer.appendChild(goldDisplay);
    }
    let enemiesAliveDisplay = document.getElementById('enemies-alive-display');
    if (!enemiesAliveDisplay) {
        enemiesAliveDisplay = document.createElement('div');
        enemiesAliveDisplay.id = 'enemies-alive-display';
        uiContainer.appendChild(enemiesAliveDisplay);
    }
    let enemiesDiedDisplay = document.getElementById('enemies-died-display');
    if (!enemiesDiedDisplay) {
        enemiesDiedDisplay = document.createElement('div');
        enemiesDiedDisplay.id = 'enemies-died-display';
        uiContainer.appendChild(enemiesDiedDisplay);
    }

    // Health UI (top-left)
    let healthContainer = document.getElementById('health-container');
    if (!healthContainer) {
        healthContainer = document.createElement('div');
        healthContainer.id = 'health-container';
        gameContainer.appendChild(healthContainer);
    }
    const healthIcons = [];
    for (let i = 0; i < 5; i++) {
        let icon = healthContainer.children[i];
        if (!icon) {
            icon = document.createElement('div');
            icon.classList.add('health-icon');
            healthContainer.appendChild(icon);
        }
        healthIcons.push(icon);
    }

    // Game Over UI
    let gameOverScreen = document.getElementById('game-over-screen');
    if (!gameOverScreen) {
        gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.innerHTML = '<h1>Game Over</h1>';
        gameContainer.appendChild(gameOverScreen);
    }
    let playAgainButton = document.getElementById('play-again-button');
    if (!playAgainButton) {
        playAgainButton = document.createElement('button');
        playAgainButton.id = 'play-again-button';
        playAgainButton.textContent = 'Play Again';
        gameOverScreen.appendChild(playAgainButton);
    }

    // Update UI function
    function updateUI() {
        goldDisplay.textContent = `Gold: ${gameState.gold}`;
        enemiesAliveDisplay.textContent = `Enemies Alive: ${gameState.enemies.length}`;
        enemiesDiedDisplay.textContent = `Enemies Died: ${gameState.enemiesDied}`;
        for (let i = 0; i < 5; i++) {
            healthIcons[i].style.visibility = i < gameState.heroHealth ? 'visible' : 'hidden';
        }
    }

    return { updateUI, gameOverScreen, playAgainButton };
}