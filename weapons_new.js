// Realistic Firearms System
class Weapon {
  constructor(name, damage, fireRate, ammo, color, bulletSpeed, spread, sound) {
    this.name = name;
    this.damage = damage;
    this.fireRate = fireRate;
    this.ammo = ammo;
    this.color = color;
    this.bulletSpeed = bulletSpeed;
    this.spread = spread;
    this.sound = sound;
    this.lastFireTime = 0;
  }

  fire(x, y, targetX, targetY) {
    const now = Date.now();
    if (now - this.lastFireTime < this.fireRate) return null;
    if (this.ammo <= 0) return null;

    this.lastFireTime = now;
    this.ammo--;

    // Play gunshot sound
    if (this.sound) {
      const audio = new Audio(this.sound);
      audio.volume = 0.3;
      audio.play().catch(e => console.log("Audio error:", e));
    }

    const angle = Math.atan2(targetY - y, targetX - x);
    const spreadAngle = angle + (Math.random() - 0.5) * this.spread;

    return {
      x, y,
      vx: Math.cos(spreadAngle) * this.bulletSpeed,
      vy: Math.sin(spreadAngle) * this.bulletSpeed,
      damage: this.damage,
      color: this.color,
      radius: 3
    };
  }
}

// Weapon Types
const weapons = {
  assaultRifle: new Weapon(
    "M4A1 Assault Rifle",
    15,  // damage
    100, // fireRate (ms)
    30,  // ammo
    "#555555", // color
    15,  // bulletSpeed
    0.05, // spread
    "https://assets.mixkit.co/sfx/preview/mixkit-short-gun-shot-1670.mp3"
  ),
  sniperRifle: new Weapon(
    "Barrett .50 Cal",
    75,  // damage
    1500, // fireRate (ms)
    10,  // ammo
    "#333333", // color
    30,  // bulletSpeed
    0.01, // spread
    "https://assets.mixkit.co/sfx/preview/mixkit-gun-shot-1662.mp3"
  ),
  shotgun: new Weapon(
    "Benelli M4",
    8,   // damage per pellet
    1000, // fireRate (ms)
    8,   // ammo
    "#222222", // color
    10,  // bulletSpeed
    0.2, // spread
    "https://assets.mixkit.co/sfx/preview/mixkit-shotgun-shot-1661.mp3"
  )
};

// Current selected weapon
let currentWeapon = weapons.assaultRifle;

// Initialize weapon UI
function initWeaponUI() {
  const container = document.querySelector('.weapons-grid');
  if (!container) return;

  container.innerHTML = '';
  
  Object.values(weapons).forEach(weapon => {
    const card = document.createElement('div');
    card.className = 'weapon-card';
    card.innerHTML = `
      <div class="weapon-name">${weapon.name}</div>
      <div class="weapon-stats">
        <span>Damage: ${weapon.damage}</span>
        <span>Fire Rate: ${weapon.fireRate}ms</span>
        <span>Ammo: ${weapon.ammo}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      currentWeapon = weapon;
      updateWeaponUI();
    });
    container.appendChild(card);
  });
  updateWeaponUI();
}

function updateWeaponUI() {
  document.querySelectorAll('.weapon-card').forEach(card => {
    card.classList.remove('selected');
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initWeaponUI);

// Export for game loop
export { currentWeapon, weapons };