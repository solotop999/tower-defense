// Calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Move an object toward a target at a given speed
function moveToward(object, targetX, targetY, speed) {
    const dx = targetX - object.position.x;
    const dy = targetY - object.position.y;
    const distance = calculateDistance(object.position.x, object.position.y, targetX, targetY);
    if (distance < speed) {
        object.position.x = targetX;
        object.position.y = targetY;
        return true; // Reached target
    }
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    object.position.x += vx;
    object.position.y += vy;
    return false; // Not yet reached
}