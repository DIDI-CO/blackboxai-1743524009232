// Weapon Data - Realistic Firearms
const weapons = {
    assaultRifle: {
        name: "M4A1 Assault Rifle",
        damage: 15,
        fireRate: 100, // ms between shots
        ammo: 30,
        color: "#555555",
        bulletSpeed: 15,
        spread: 0.05,
        sound: "https://assets.mixkit.co/sfx/preview/mixkit-short-gun-shot-1670.mp3"
    },
    sniperRifle: {
        name: "Barrett .50 Cal",
        damage: 75,
        cooldown: 1500, // ms between shots
        ammo: 10,
        color: "#333333",
        bulletSpeed: 30,
        spread: 0.01,
        sound: "https://assets.mixkit.co/sfx/preview/mixkit-gun-shot-1662.mp3"
    },
    shotgun: {
        name: "Benelli M4",
        damage: 10, // per pellet
        pellets: 8,
        cooldown: 1000,
        ammo: 8,
        color: "#222222",
        bulletSpeed: 10,
        spread: 0.2,
        sound: "https://assets.mixkit.co/sfx/preview/mixkit-shotgun-shot-1661.mp3"
    }
};

let selectedWeapon = weapons.pulseRifle;
let lastFireTime = 0;
const bullets = [];

// Initialize weapons UI
function initWeaponsUI() {
    const weaponsGrid = document.querySelector('.weapons-grid');
    weaponsGrid.innerHTML = '';
    
    Object.entries(weapons).forEach(([key, weapon]) => {
        const card = document.createElement('div');
        card.className = 'weapon-card';
        card.innerHTML = `
            <img src="${weapon.image}" alt="${weapon.name}" 
                 onerror="this.src='https://via.placeholder.com/150'">
            <p>${weapon.name}</p>
        `;
        card.addEventListener('click', () => selectWeapon(key));
        weaponsGrid.appendChild(card);
    });
}

function selectWeapon(weaponKey) {
    selectedWeapon = weapons[weaponKey];
    updateWeaponsUI();
}

function updateWeaponsUI() {
    document.querySelectorAll('.weapon-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const weaponCards = document.querySelectorAll('.weapon-card');
    const selectedIndex = Object.keys(weapons).indexOf(selectedWeapon.name.toLowerCase().replace(' ', ''));
    if (weaponCards[selectedIndex]) {
        weaponCards[selectedIndex].classList.add('selected');
    }
}

function fireWeapon(x, y, targetX, targetY) {
    const now = Date.now();
    
    // Check weapon cooldown
    if (selectedWeapon.fireRate && now - lastFireTime < selectedWeapon.fireRate) return;
    if (selectedWeapon.cooldown && now - lastFireTime < selectedWeapon.cooldown) return;
    if (selectedWeapon.ammo !== undefined && selectedWeapon.ammo <= 0) return;
    
    lastFireTime = now;
    if (selectedWeapon.ammo !== undefined) selectedWeapon.ammo--;
    
    // Play weapon sound
    if (selectedWeapon.sound) {
        const audio = new Audio(selectedWeapon.sound);
        audio.volume = 0.3;
        audio.play();
    }
    
    // Calculate base angle
    const baseAngle = Math.atan2(targetY - y, targetX - x);
    
    // Handle different weapon types
    if (selectedWeapon.pellets) {
        // Shotgun - multiple pellets
        for (let i = 0; i < selectedWeapon.pellets; i++) {
            const angle = baseAngle + (Math.random() - 0.5) * selectedWeapon.spread;
            bullets.push(createBullet(x, y, angle, selectedWeapon));
        }
    } else {
        // Other guns - single bullet
        const angle = baseAngle + (Math.random() - 0.5) * selectedWeapon.spread;
        bullets.push(createBullet(x, y, angle, selectedWeapon));
    }
}

function createBullet(x, y, angle, weapon) {
    return {
        x, y,
        vx: Math.cos(angle) * weapon.bulletSpeed,
        vy: Math.sin(angle) * weapon.bulletSpeed,
        damage: weapon.damage,
        color: weapon.color,
        radius: 3,
        weaponType: weapon.name
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initWeaponsUI);