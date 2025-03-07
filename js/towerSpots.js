function setupTowerSpots(gameContainer, gameState, createTower, startRound) {
    const towerOptions = [
        { type: 'archery', color: 'blue', price: 10 },
        { type: 'lava', color: 'orange', price: 20 },
        { type: 'rock', color: 'gray', price: 25 },
        { type: 'ice', color: 'cyan', price: 15 },
    ];

    let optionsTooltip = document.getElementById('tower-options-tooltip');
    if (!optionsTooltip) {
        optionsTooltip = document.createElement('div');
        optionsTooltip.id = 'tower-options-tooltip';
        gameContainer.appendChild(optionsTooltip);
    }

    TOWER_SPOTS.forEach(spot => {
        const spotDiv = document.createElement('div');
        spotDiv.classList.add('tower-spot');
        spotDiv.style.left = spot.x + 'px';
        spotDiv.style.top = spot.y + 'px';
        gameContainer.appendChild(spotDiv);

        const showTowerOptions = (e) => {
            e.stopPropagation();
            if (gameState.gameOver || gameState.towers.some(t => t.position.x === spot.x && t.position.y === spot.y)) {
                return;
            }
            optionsTooltip.innerHTML = '';
            towerOptions.forEach(option => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('tower-option');
                if (gameState.gold < option.price) {
                    optionDiv.classList.add('dimmed');
                }
                const towerIcon = document.createElement('div');
                towerIcon.style.backgroundColor = option.color;
                const towerLabel = document.createElement('span');
                towerLabel.textContent = `${option.type} (${option.price}g)`;
                optionDiv.appendChild(towerIcon);
                optionDiv.appendChild(towerLabel);
                optionsTooltip.appendChild(optionDiv);

                optionDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (gameState.gold >= option.price) {
                        const tower = createTower(spot.x, spot.y, option.type);
                        if (tower) {
                            spotDiv.style.display = 'none';
                            optionsTooltip.style.display = 'none';
                        }
                    }
                });
            });
            optionsTooltip.style.display = 'block';
            optionsTooltip.style.left = `${spot.x + 15}px`;
            optionsTooltip.style.top = `${spot.y - (towerOptions.length * 30) / 2}px`;
        };

        spotDiv.addEventListener('click', showTowerOptions);
    });

    document.addEventListener('click', (e) => {
        if (!optionsTooltip.contains(e.target) && !TOWER_SPOTS.some(spot => {
            const spotDiv = document.querySelector(`.tower-spot[style*="left: ${spot.x}px"][style*="top: ${spot.y}px"]`);
            return spotDiv && spotDiv.contains(e.target);
        })) {
            optionsTooltip.style.display = 'none';
        }
    });
}