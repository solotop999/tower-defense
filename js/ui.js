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

// Update UI
window.updateUI = function() {
    goldDisplay.textContent = `Gold: ${gameState.gold}`;
    enemiesAliveDisplay.textContent = `Enemies Alive: ${gameState.enemies.length}`;
    enemiesDiedDisplay.textContent = `Enemies Died: ${gameState.enemiesDied}`;
};