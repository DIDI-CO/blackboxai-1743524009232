// Mission tracking system
let killCount = 0;
let bossActive = false;
let score = 0;

function incrementKillCount() {
    killCount++;
    document.getElementById('killCount').textContent = killCount;
    
    if (killCount >= 20 && !bossActive) {
        spawnBoss();
        bossActive = true;
        document.getElementById('bossHealthBar').classList.remove('hidden');
    }
}

function updateBossHealth() {
    if (bossActive) {
        const healthPercent = getBossHealthPercentage();
        document.querySelector('#bossHealthBar .health-bar').style.width = `${healthPercent}%`;
    }
}

function resetMission() {
    killCount = 0;
    bossActive = false;
    document.getElementById('killCount').textContent = '0';
    document.getElementById('bossHealthBar').classList.add('hidden');
}

function addScore(points) {
    score += points;
    // Update score display if available
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Mission objectives
const missions = [
    {
        id: 1,
        name: "Eliminate Terrorists",
        description: "Defeat 20 terrorists to summon the boss",
        completed: false,
        target: 20,
        current: () => killCount
    },
    {
        id: 2,
        name: "Defeat the Chrono Boss",
        description: "Destroy the time-manipulating boss",
        completed: false,
        target: 1,
        current: () => bossActive && getBossHealthPercentage() <= 0 ? 1 : 0
    }
];

function checkMissionCompletion() {
    missions.forEach(mission => {
        if (!mission.completed && mission.current() >= mission.target) {
            mission.completed = true;
            addScore(mission.target * 100);
            // Trigger mission complete event
            console.log(`Mission completed: ${mission.name}`);
        }
    });
}

// Initialize mission tracking
function initMissions() {
    resetMission();
    setInterval(checkMissionCompletion, 1000);
}

// Start mission tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', initMissions);