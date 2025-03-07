// Create a regular enemy
function createEnemy() {
    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('enemy');
    gameContainer.appendChild(enemyDiv);
    const enemy = {
        element: enemyDiv,
        position: { x: PATH[0].x, y: PATH[0].y },
        targetIndex: 1,
        speed: 1,
        health: 100,
        isBoss: false,
        goldValue: 5,
    };
    gameState.enemies.push(enemy);
    gameState.enemiesSpawned++;
    console.log(`Enemy ${gameState.enemiesSpawned} created at`, enemy.position);

    if (gameState.enemiesSpawned === 80) {
        createBoss();
    }
}

// Create a boss enemy
function createBoss() {
    const bossDiv = document.createElement('div');
    bossDiv.classList.add('enemy', 'boss');
    gameContainer.appendChild(bossDiv);
    const boss = {
        element: bossDiv,
        position: { x: PATH[0].x, y: PATH[0].y },
        targetIndex: 1,
        speed: 0.5,
        health: 500,
        isBoss: true,
        goldValue: 50,
    };
    gameState.enemies.push(boss);
    console.log('Boss created at', boss.position);
}

// Update enemies
function updateEnemies() {
    gameState.enemies.forEach(enemy => {
        if (enemy.targetIndex < PATH.length) {
            const target = PATH[enemy.targetIndex];
            if (moveToward(enemy, target.x, target.y, enemy.speed)) {
                enemy.targetIndex++;
            }
            enemy.element.style.left = enemy.position.x + 'px';
            enemy.element.style.top = enemy.position.y + 'px';
        } else {
            enemy.element.remove();
            gameState.enemies = gameState.enemies.filter(e => e !== enemy);
        }
    });
}