class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.health = 500;
        this.maxHealth = 500;
        this.speed = 1.5;
        this.color = "#9900ff";
        this.phase = 1;
        this.attackCooldown = 0;
        this.projectiles = [];
    }

    update(player) {
        // Phase transitions
        if (this.health < this.maxHealth * 0.6 && this.phase === 1) {
            this.phase = 2;
            this.speed = 2;
        } else if (this.health < this.maxHealth * 0.3 && this.phase === 2) {
            this.phase = 3;
            this.speed = 2.5;
        }
        
        // Movement based on phase
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        if (distance > 150 || this.phase === 3) {
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else if (this.phase === 2) {
            // Circle around player
            this.x += Math.cos(angle + Math.PI/2) * this.speed;
            this.y += Math.sin(angle + Math.PI/2) * this.speed;
        }
        
        // Attack logic
        if (this.attackCooldown <= 0) {
            this.attack(player);
            this.attackCooldown = this.getAttackCooldown();
        } else {
            this.attackCooldown--;
        }
        
        // Update projectiles
        this.projectiles.forEach(proj => {
            proj.x += proj.vx;
            proj.y += proj.vy;
        });
    }

    getAttackCooldown() {
        switch (this.phase) {
            case 1: return 120; // 2 seconds at 60fps
            case 2: return 60;  // 1 second
            case 3: return 30;  // 0.5 seconds
            default: return 60;
        }
    }

    attack(player) {
        if (this.phase === 1) {
            // Melee attack
            // (Handled in collision detection)
        } else {
            // Projectile attack
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            const speed = 5;
            
            this.projectiles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                damage: 20,
                radius: 10,
                color: "#ff00ff"
            });
        }
    }

    takeDamage(damage) {
        if (this.phase !== 3 || Math.random() > 0.7) { // 30% chance to hit in phase 3
            this.health -= damage;
        }
        return this.health <= 0;
    }

    draw(ctx) {
        // Draw boss
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 15, this.width, 8);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 15, this.width * healthPercent, 8);
        
        // Draw phase indicator
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(`Phase ${this.phase}`, this.x - 20, this.y - this.height/2 - 20);
        
        // Draw projectiles
        this.projectiles.forEach(proj => {
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Boss management
let boss = null;

function spawnBoss(canvas) {
    boss = new Boss(canvas.width / 2, 100);
    return boss;
}

function updateBoss(player) {
    if (boss) boss.update(player);
}

function drawBoss(ctx) {
    if (boss) boss.draw(ctx);
}

function getBossHealthPercentage() {
    return boss ? (boss.health / boss.maxHealth) * 100 : 0;
}