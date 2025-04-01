// Enhanced Game State
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 30,
    height: 50,
    speed: 5,
    color: "#00aaff",
    health: 100,
    maxHealth: 100
};

// Game state variables
let lastTime = 0;
let deltaTime = 0;
let isPaused = false;
let gameOver = false;
let score = 0;

// Game initialization
function init() {
    // Spawn initial enemies
    for (let i = 0; i < 5; i++) {
        spawnEnemy(canvas);
    }
    
    // Set up event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Input handling
function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
    player.y = e.clientY - rect.top;
}

function handleMouseClick(e) {
    const rect = canvas.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    fireWeapon(player.x, player.y, targetX, targetY);
}

// Collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width/2 &&
           obj1.x + obj1.radius > obj2.x - obj2.width/2 &&
           obj1.y < obj2.y + obj2.height/2 &&
           obj1.y + obj1.radius > obj2.y - obj2.height/2;
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
    
    // Update and draw enemies
    updateEnemies(player);
    drawEnemies(ctx);
    
    // Update and draw boss if active
    if (bossActive) {
        updateBoss(player);
        drawBoss(ctx);
        updateBossHealth();
    }
    
    // Update and draw bullets
    updateBullets();
    
    // Check game over conditions
    if (checkGameOver()) {
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// Bullet management
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // Move bullet
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        
        // Draw bullet
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Check collisions
        if (checkBulletCollisions(bullet, i)) {
            bullets.splice(i, 1);
        }
        
        // Remove off-screen bullets
        if (isOffScreen(bullet)) {
            bullets.splice(i, 1);
        }
    }
}

function checkBulletCollisions(bullet, index) {
    // Check enemy collisions
    for (let j = enemies.length - 1; j >= 0; j--) {
        if (checkCollision(bullet, enemies[j])) {
            if (enemies[j].takeDamage(bullet.damage)) {
                enemies.splice(j, 1);
                incrementKillCount();
                spawnEnemy(canvas);
            }
            return true;
        }
    }
    
    // Check boss collision
    if (bossActive && checkCollision(bullet, boss)) {
        if (boss.takeDamage(bullet.damage)) {
            // Boss defeated
            console.log("Boss defeated!");
            resetMission();
        }
        return true;
    }
    
    return false;
}

function isOffScreen(bullet) {
    return bullet.x < 0 || bullet.x > canvas.width || 
           bullet.y < 0 || bullet.y > canvas.height;
}

// Game state checks
function checkGameOver() {
    // Check player collision with enemies
    for (const enemy of enemies) {
        if (checkCollision({
            x: player.x,
            y: player.y,
            radius: player.width/2
        }, enemy)) {
            endGame(false);
            return true;
        }
    }
    
    // Check boss projectiles
    if (bossActive) {
        for (const proj of boss.projectiles) {
            if (checkCollision({
                x: player.x,
                y: player.y,
                radius: player.width/2
            }, proj)) {
                endGame(false);
                return true;
            }
        }
    }
    
    return false;
}

function endGame(victory) {
    const message = victory ? 
        "Congratulations! You defeated the boss!" : 
        "Game Over! You were defeated!";
    alert(message);
    
    // Reset game
    resetGame();
}

function resetGame() {
    // Clear all entities
    enemies.length = 0;
    bullets.length = 0;
    if (bossActive) {
        boss.projectiles.length = 0;
    }
    
    // Reset missions
    resetMission();
    
    // Respawn initial enemies
    for (let i = 0; i < 5; i++) {
        spawnEnemy(canvas);
    }
    
    // Restart game loop
    requestAnimationFrame(gameLoop);
}

// Enhanced Game Loop
function gameLoop(timestamp) {
    if (gameOver) return showGameOver();
    if (isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update game state
    updatePlayer();
    updateEnemies();
    updateBullets();
    updateCollisions();
    updateHUD();

    // Render game
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawEffects();

    // Spawn new enemies periodically
    if (Math.random() < 0.02) {
        spawnEnemy(canvas);
    }

    // Calculate delta time for smooth animation
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update game state
    updateGameState();
    renderGame();

    requestAnimationFrame(gameLoop);
}

function updateGameState() {
    // Update player
    updatePlayer();

    // Update enemies
    updateEnemies();

    // Update bullets
    updateBullets();

    // Update HUD
    updateHUD();
}

function renderGame() {
    // Draw player
    drawPlayer();

    // Draw enemies
    drawEnemies();

    // Draw bullets
    drawBullets();

    // Draw effects
    drawEffects();
}

// Audio settings functionality
function initAudioSettings() {
    const musicVolume = document.getElementById('music-volume');
    const sfxVolume = document.getElementById('sfx-volume');
    const bgMusic = document.getElementById('bgMusic');
    
    // Load saved settings
    musicVolume.value = localStorage.getItem('musicVolume') || 0.3;
    sfxVolume.value = localStorage.getItem('sfxVolume') || 0.3;
    bgMusic.volume = musicVolume.value;
    
    // Update music volume
    musicVolume.addEventListener('input', () => {
        bgMusic.volume = musicVolume.value;
        localStorage.setItem('musicVolume', musicVolume.value);
    });
    
    // Update SFX volume
    sfxVolume.addEventListener('input', () => {
        localStorage.setItem('sfxVolume', sfxVolume.value);
    });
}

// Pause menu functionality
function initPauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    const menuButton = document.getElementById('menu-button');
    const settingsButton = document.getElementById('settings-game');
    const backButton = document.getElementById('back-button');
    const settingsMenu = document.getElementById('settings-menu');
    const pauseOptions = document.querySelector('.pause-options');
    
    menuButton.addEventListener('click', () => {
        isPaused = true;
        pauseMenu.classList.remove('hidden');
        pauseOptions.classList.remove('hidden');
        settingsMenu.classList.add('hidden');
    });

    settingsButton.addEventListener('click', () => {
        pauseOptions.classList.add('hidden');
        settingsMenu.classList.remove('hidden');
    });

    backButton.addEventListener('click', () => {
        pauseOptions.classList.remove('hidden');
        settingsMenu.classList.add('hidden');
    });
    
    document.getElementById('resume-game').addEventListener('click', () => {
        isPaused = false;
        pauseMenu.classList.add('hidden');
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    });
    
    document.getElementById('quit-game').addEventListener('click', () => {
        window.location.href = 'menu.html';
    });
}

// AI-generated characters data
const aiCharacters = [
    {
        name: "Cyber Ninja",
        image: "https://i.imgur.com/XJQmY7a.jpg",
        description: "Stealth operative"
    },
    {
        name: "Mecha Soldier", 
        image: "https://i.imgur.com/YbT7Q9c.jpg",
        description: "Heavy weapons expert"
    },
    {
        name: "Neon Samurai",
        image: "https://i.imgur.com/ZpLk9Rd.jpg",
        description: "Blade master"
    },
    {
        name: "Tactical Ghost",
        image: "https://i.imgur.com/VvR8Q2f.jpg",
        description: "Elite sniper"
    }
];

// Display AI characters
function displayAICharacters() {
    const container = document.getElementById('character-display');
    container.innerHTML = '';
    
    aiCharacters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}">
            <p><strong>${char.name}</strong></p>
            <p>${char.description}</p>
        `;
        container.appendChild(card);
    });
}

// Background music control
function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.3; // Set volume to 30%
    
    // Start music when user interacts (browser autoplay policy)
    document.body.addEventListener('click', () => {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
    }, { once: true });
}

// Initialize play button
function initPlayButton() {
    const playButton = document.getElementById('play-button');
    const startScreen = document.getElementById('start-screen');
    const gameCanvas = document.getElementById('gameCanvas');
    const bgMusic = document.getElementById('bgMusic');
    
    // Display characters on load
    displayAICharacters();
    
    playButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameCanvas.classList.remove('hidden');
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
        
        // Ensure background music is playing
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.play().catch(e => console.log('Music play failed:', e));
        
        // Play start sound effect
        const startSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-show-suspense-waiting-668.mp3');
        startSound.volume = 0.3;
        startSound.play();
    });
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initPauseMenu();
    initPlayButton();
    
    // Show start screen initially
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('gameCanvas').classList.add('hidden');
});
