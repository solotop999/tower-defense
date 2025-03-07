// Create a tower
function createTower(x, y) {
    const towerDiv = document.createElement('div');
    towerDiv.classList.add('tower');
    towerDiv.style.left = x + 'px';
    towerDiv.style.top = y + 'px';
    gameContainer.appendChild(towerDiv);
    const tower = {
        element: towerDiv,
        position: { x: x, y: y },
        range: 150,
        fireRate: 500,
        lastShot: 0,
        damage: 20,
        level: 1,
    };
    gameState.towers.push(tower);
    towerDiv.addEventListener('click', () => upgradeTower(tower));
    console.log('Tower created at', tower.position);
}

// Upgrade a tower
function upgradeTower(tower) {
    const upgradeCost = tower.level * 50;
    if (gameState.gold >= upgradeCost) {
        gameState.gold -= upgradeCost;
        tower.level++;
        tower.damage += 10;
        tower.fireRate = Math.max(100, tower.fireRate - 50);
        tower.element.style.backgroundColor = `hsl(${tower.level * 60}, 70%, 50%)`;
        console.log(`Tower upgraded to level ${tower.level}. Damage: ${tower.damage}, Fire Rate: ${tower.fireRate}, Gold: ${gameState.gold}`);
    } else {
        console.log(`Not enough gold! Need ${upgradeCost}, have ${gameState.gold}`);
    }
}

// Shoot a projectile
function shootProjectile(tower, enemy) {
    const projectileDiv = document.createElement('div');
    projectileDiv.classList.add('projectile');
    projectileDiv.style.left = tower.position.x + 'px';
    projectileDiv.style.top = tower.position.y + 'px';
    gameContainer.appendChild(projectileDiv);
    const projectile = {
        element: projectileDiv,
        position: { x: tower.position.x, y: tower.position.y },
        targetEnemy: enemy,
        speed: 5,
        damage: tower.damage,
    };
    gameState.projectiles.push(projectile);
    console.log('Projectile fired from', tower.position, 'targeting enemy at', enemy.position);
}

// Update towers and projectiles
function updateTowers() {
    const currentTime = performance.now();

    gameState.towers.forEach(tower => {
        if (currentTime - tower.lastShot > tower.fireRate) {
            const enemyInRange = gameState.enemies.find(enemy => {
                return calculateDistance(tower.position.x, tower.position.y, enemy.position.x, enemy.position.y) < tower.range;
            });
            if (enemyInRange) {
                shootProjectile(tower, enemyInRange);
                tower.lastShot = currentTime;
            }
        }
    });

    gameState.projectiles.forEach(projectile => {
        if (!gameState.enemies.includes(projectile.targetEnemy)) {
            projectile.element.remove();
            gameState.projectiles = gameState.projectiles.filter(p => p !== projectile);
            return;
        }

        const targetX = projectile.targetEnemy.position.x;
        const targetY = projectile.targetEnemy.position.y;
        const reached = moveToward(projectile, targetX, targetY, projectile.speed);
        projectile.element.style.left = projectile.position.x + 'px';
        projectile.element.style.top = projectile.position.y + 'px';

        const distance = calculateDistance(projectile.position.x, projectile.position.y, targetX, targetY);
        if (reached || distance < projectile.speed + 10) {
            projectile.targetEnemy.health -= projectile.damage;
            if (projectile.targetEnemy.health <= 0) {
                gameState.gold += projectile.targetEnemy.goldValue;
                gameState.enemiesDied++;
                console.log(`Enemy killed! Gold earned: ${projectile.targetEnemy.goldValue}. Total: ${gameState.gold}`);
                projectile.targetEnemy.element.remove();
                gameState.enemies = gameState.enemies.filter(e => e !== projectile.targetEnemy);
            }
            projectile.element.remove();
            gameState.projectiles = gameState.projectiles.filter(p => p !== projectile);
        }
    });
}