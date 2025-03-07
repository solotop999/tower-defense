// Tower factory function
function createTower(x, y, type) {
    const towerTypes = {
        archery: { power: 20, speed: 500, color: 'blue', skills: ['crit'], price: 10 },
        lava: { power: 30, speed: 1000, color: 'orange', skills: ['splash'], price: 20 },
        rock: { power: 40, speed: 1500, color: 'gray', skills: [], price: 25 },
        ice: { power: 15, speed: 750, color: 'cyan', skills: ['slow'], price: 15 },
    };

    const typeProps = towerTypes[type] || towerTypes.archery;
    if (gameState.gold < typeProps.price || gameState.gameOver) {
        console.log(`Not enough gold or game over! Need ${typeProps.price}, have ${gameState.gold}`);
        return null;
    }

    gameState.gold -= typeProps.price;
    const towerDiv = document.createElement('div');
    towerDiv.classList.add('tower');
    towerDiv.style.left = x + 'px';
    towerDiv.style.top = y + 'px';
    gameContainer.appendChild(towerDiv);

    const tower = {
        element: towerDiv,
        position: { x: x, y: y },
        range: 150,
        fireRate: typeProps.speed,
        lastShot: 0,
        power: typeProps.power,
        level: 1,
        skills: typeProps.skills,
        type: type, // Store type for tooltip
    };
    tower.element.style.backgroundColor = typeProps.color;

    // Tooltip setup
    let tooltip = document.getElementById('tower-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tower-tooltip';
        gameContainer.appendChild(tooltip);
    }

    towerDiv.addEventListener('mouseover', (e) => {
        const skillsText = tower.skills.length > 0 ? `Skills: ${tower.skills.join(', ')}` : 'Skills: None';
        tooltip.textContent = `${tower.type} Tower\nPower: ${tower.power}\nFire Rate: ${tower.fireRate}ms\n${skillsText}`;
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.pageX + 10}px`; // Offset from mouse
        tooltip.style.top = `${e.pageY - 40}px`; // Above mouse
    });

    towerDiv.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY - 40}px`;
    });

    towerDiv.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });

    gameState.towers.push(tower);
    towerDiv.addEventListener('click', () => upgradeTower(tower));
    console.log(`${type} Tower created at`, tower.position);
    return tower;
}

// Upgrade a tower
function upgradeTower(tower) {
    if (gameState.gameOver) return;
    const upgradeCost = tower.level * 50;
    if (gameState.gold >= upgradeCost) {
        gameState.gold -= upgradeCost;
        tower.level++;
        tower.power += 10;
        tower.fireRate = Math.max(100, tower.fireRate - 50);
        tower.element.style.backgroundColor = `hsl(${tower.level * 60}, 70%, 50%)`;
        console.log(`Tower upgraded to level ${tower.level}. Power: ${tower.power}, Fire Rate: ${tower.fireRate}, Gold: ${gameState.gold}`);
    } else {
        console.log(`Not enough gold! Need ${upgradeCost}, have ${gameState.gold}`);
    }
}

// Shoot a projectile with skill effects
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
        power: tower.power,
        skills: tower.skills,
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
            let damage = projectile.power;

            if (projectile.skills.includes('crit') && Math.random() < 0.3) {
                damage *= 2;
                console.log('Critical hit!', damage);
            }
            if (projectile.skills.includes('slow')) {
                projectile.targetEnemy.speed = Math.max(0.5, projectile.targetEnemy.speed * 0.7);
            }
            if (projectile.skills.includes('splash')) {
                gameState.enemies.forEach(otherEnemy => {
                    if (otherEnemy !== projectile.targetEnemy) {
                        const splashDistance = calculateDistance(otherEnemy.position.x, otherEnemy.position.y, projectile.targetEnemy.position.x, projectile.targetEnemy.position.y);
                        if (splashDistance < 50) {
                            otherEnemy.health -= damage * 0.6;
                            if (otherEnemy.health <= 0) {
                                gameState.gold += otherEnemy.goldValue;
                                gameState.enemiesDied++;
                                console.log(`Splash killed enemy! Gold earned: ${otherEnemy.goldValue}. Total: ${gameState.gold}`);
                                otherEnemy.element.remove();
                                gameState.enemies = gameState.enemies.filter(e => e !== otherEnemy);
                            }
                        }
                    }
                });
            }

            projectile.targetEnemy.health -= damage;
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