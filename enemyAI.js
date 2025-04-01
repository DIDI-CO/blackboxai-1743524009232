class Terrorist {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.health = 100;
        this.speed = 2;
        this.color = "#ff0000";
        this.patrolPoints = [
            { x: x - 100, y: y },
            { x: x + 100, y: y }
        ];
        this.currentPatrolIndex = 0;
        this.detectionRadius = 200;
    }

    update(player) {
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.detectionRadius) {
            // Chase player
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            // Patrol behavior
            const target = this.patrolPoints[this.currentPatrolIndex];
            const tx = target.x - this.x;
            const ty = target.y - this.y;
            const patrolDistance = Math.sqrt(tx * tx + ty * ty);
            
            if (patrolDistance < 5) {
                this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            } else {
                const angle = Math.atan2(ty, tx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    draw(ctx) {
        // Draw enemy
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw health bar
        const healthWidth = this.width * (this.health / 100);
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 10, this.width, 5);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 10, healthWidth, 5);
    }
}

// Enemy management
const enemies = [];

function spawnEnemy(canvas) {
    const x = Math.random() * (canvas.width - 60) + 30;
    const y = Math.random() * 200 + 30;
    enemies.push(new Terrorist(x, y));
}

function updateEnemies(player) {
    enemies.forEach(enemy => enemy.update(player));
}

function drawEnemies(ctx) {
    enemies.forEach(enemy => enemy.draw(ctx));
}

function removeDeadEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].health <= 0) {
            enemies.splice(i, 1);
            return true; // Enemy was killed
        }
    }
    return false;
}