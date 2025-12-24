// =============================================
// GLOBAL VARIABLES AND INITIALIZATION
// =============================================
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const flowerContainer = document.getElementById('flowerContainer');
const sky = document.getElementById('sky');
const fpsElement = document.getElementById('fps');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Arrays to store particles and flowers
let fireworks = [];
let particles = [];
let flowers = [];
let starParticles = [];

// FPS tracking
let lastTime = 0;
let frameCount = 0;
let fps = 60;

// The name to display in fireworks
const NAME_TO_DISPLAY = "Collins At 22 😉";
const NAME_CHARACTERS = NAME_TO_DISPLAY.split('');

// Enhanced flower colors with gradients
const flowerColors = [
    {outer: '#ff4081', inner: '#ff80ab'}, // Pink
    {outer: '#f44336', inner: '#ef9a9a'}, // Red
    {outer: '#ff9800', inner: '#ffcc80'}, // Orange
    {outer: '#ffeb3b', inner: '#fff59d'}, // Yellow
    {outer: '#4caf50', inner: '#a5d6a7'}, // Green
    {outer: '#2196f3', inner: '#90caf9'}, // Blue
    {outer: '#9c27b0', inner: '#ce93d8'}, // Purple
    {outer: '#e91e63', inner: '#f48fb1'}, // Magenta
    {outer: '#00bcd4', inner: '#80deea'}, // Cyan
    {outer: '#8bc34a', inner: '#c5e1a5'}  // Light Green
];

// =============================================
// FLOWER CREATION AND MANAGEMENT
// =============================================
function createFlower(x, y) {
    // Create flower element
    const flower = document.createElement('div');
    flower.classList.add('flower');
    
    // Random flower size
    const flowerSize = Math.random() * 60 + 80; // 80-140px
    
    // Random flower color
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    
    // Set flower position
    flower.style.left = `${x}px`;
    flower.style.bottom = `${y}px`;
    
    // Create stem
    const stemHeight = Math.random() * 150 + 180; // 180-330px
    const stem = document.createElement('div');
    stem.classList.add('flower-stem');
    stem.style.width = '5px';
    stem.style.height = `${stemHeight}px`;
    stem.style.bottom = '0';
    
    // Create leaves
    const leafCount = Math.floor(Math.random() * 3) + 2;
    const leaves = [];
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.style.width = `${Math.random() * 30 + 20}px`;
        leaf.style.height = `${Math.random() * 15 + 10}px`;
        leaf.style.bottom = `${Math.random() * stemHeight * 0.8 + 20}px`;
        leaf.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
        leaf.style.transform = `translateX(-50%) rotate(${Math.random() * 60 - 30}deg)`;
        leaves.push(leaf);
        flower.appendChild(leaf);
    }
    
    // Create bud
    const bud = document.createElement('div');
    bud.classList.add('flower-bud');
    bud.style.width = `${flowerSize * 0.6}px`;
    bud.style.height = `${flowerSize * 0.8}px`;
    bud.style.bottom = `${stemHeight}px`;
    bud.style.left = '50%';
    bud.style.transform = 'translateX(-50%)';
    
    // Create petal container
    const petalContainer = document.createElement('div');
    petalContainer.classList.add('petal-container');
    petalContainer.style.width = `${flowerSize}px`;
    petalContainer.style.height = `${flowerSize}px`;
    petalContainer.style.bottom = `${stemHeight - flowerSize * 0.2}px`;
    petalContainer.style.left = '50%';
    petalContainer.style.transform = 'translateX(-50%)';
    
    // Create petals
    const petals = [];
    const petalCount = Math.floor(Math.random() * 4) + 8; // 8-11 petals
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Gradient color for petals
        petal.style.background = `radial-gradient(circle at 30% 30%, 
            ${color.inner} 0%, 
            ${color.outer} 50%, 
            ${darkenColor(color.outer, 30)} 100%)`;
        
        // Size and position
        const angle = (i * 360) / petalCount;
        const radius = flowerSize / 2;
        const petalWidth = radius * (0.8 + Math.random() * 0.4);
        const petalHeight = radius * (0.6 + Math.random() * 0.4);
        
        petal.style.width = `${petalWidth}px`;
        petal.style.height = `${petalHeight}px`;
        petal.style.top = '50%';
        petal.style.left = '50%';
        
        // 3D positioning
        const transform = `
            translate(-50%, -50%) 
            rotate(${angle}deg) 
            translateY(${-radius * 0.3}px)
            rotateX(${Math.random() * 20 + 10}deg)
        `;
        petal.style.transform = transform;
        
        // Inner shine effect
        const innerShine = document.createElement('div');
        innerShine.classList.add('petal-inner');
        petal.appendChild(innerShine);
        
        petals.push(petal);
        petalContainer.appendChild(petal);
    }
    
    // Create flower center
    const center = document.createElement('div');
    center.classList.add('center');
    center.style.width = `${flowerSize * 0.25}px`;
    center.style.height = `${flowerSize * 0.25}px`;
    center.style.bottom = `${stemHeight + flowerSize * 0.15}px`;
    center.style.left = '50%';
    center.style.transform = 'translateX(-50%)';
    
    // Add pollen dots to center
    for (let i = 0; i < 12; i++) {
        const pollen = document.createElement('div');
        pollen.style.position = 'absolute';
        pollen.style.width = `${Math.random() * 6 + 4}px`;
        pollen.style.height = `${Math.random() * 6 + 4}px`;
        pollen.style.background = '#ff9800';
        pollen.style.borderRadius = '50%';
        pollen.style.top = `${Math.random() * 100}%`;
        pollen.style.left = `${Math.random() * 100}%`;
        pollen.style.boxShadow = 'inset 0 0 5px rgba(255, 152, 0, 0.5)';
        center.appendChild(pollen);
    }
    
    // Assemble the flower
    flower.appendChild(stem);
    flower.appendChild(bud);
    flower.appendChild(petalContainer);
    flower.appendChild(center);
    
    // Add to container
    flowerContainer.appendChild(flower);
    
    // Store flower data
    flowers.push({
        element: flower,
        bud: bud,
        petalContainer: petalContainer,
        petals: petals,
        center: center,
        color: color,
        bloomed: false,
        size: flowerSize,
        stemHeight: stemHeight,
        leaves: leaves,
        wavePhase: Math.random() * Math.PI * 2
    });
    
    // Start blooming animation after a random delay
    setTimeout(() => bloomFlower(flowers.length - 1), Math.random() * 2000);
}

function bloomFlower(index) {
    const flower = flowers[index];
    
    if (flower.bloomed) return;
    
    flower.bloomed = true;
    
    // Animate bud opening
    flower.bud.style.transform = 'translateX(-50%) scale(0.1)';
    flower.bud.style.opacity = '0.3';
    
    // Animate petals with 3D effect
    flower.petalContainer.style.opacity = '1';
    flower.petalContainer.style.animation = `bloom 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
    
    // Animate each petal individually
    flower.petals.forEach((petal, i) => {
        setTimeout(() => {
            const currentTransform = petal.style.transform;
            petal.style.transform = currentTransform.replace(
                'rotateX(20deg)',
                'rotateX(0deg)'
            );
            petal.style.transition = 'transform 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, i * 100);
    });
    
    // Animate center
    setTimeout(() => {
        flower.center.style.opacity = '1';
        flower.center.style.transform = 'translateX(-50%) scale(1)';
        flower.center.style.transition = 'all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Add pulsing effect to center
        setInterval(() => {
            flower.center.style.transform = `translateX(-50%) scale(${1 + Math.sin(Date.now() / 1000) * 0.1})`;
        }, 100);
    }, flower.petals.length * 100);
}

function animateFlowers() {
    flowers.forEach((flower, index) => {
        if (flower.bloomed) {
            // Gentle waving motion for petals
            flower.wavePhase += 0.02;
            flower.petals.forEach((petal, i) => {
                const waveOffset = Math.sin(flower.wavePhase + i * 0.5) * 3;
                const currentTransform = petal.style.transform;
                const newTransform = currentTransform.replace(
                    /rotateX\([^)]*\)/,
                    `rotateX(${waveOffset}deg)`
                );
                petal.style.transform = newTransform;
            });
        }
    });
}

// =============================================
// SKY AND STARS CREATION
// =============================================
function createStars() {
    sky.innerHTML = '';
    
    // Create 200 stars for a richer night sky
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size and twinkle
        const size = Math.random() * 3 + 1;
        const delay = Math.random() * 5;
        const duration = Math.random() * 2 + 2;
        
        // Apply styles
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        // Add glow effect for some stars
        if (Math.random() > 0.7) {
            star.style.boxShadow = `0 0 ${size*3}px white`;
        }
        
        sky.appendChild(star);
    }
    
    // Add some star particles for the canvas
    for (let i = 0; i < 50; i++) {
        starParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.7,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.5 + 0.3,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

function drawStarParticles(currentTime) {
    starParticles.forEach(star => {
        star.twinkle += 0.02;
        const twinkle = Math.sin(star.twinkle) * 0.2 + 0.8;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
        
        // Move stars slowly
        star.x += star.speed;
        if (star.x > canvas.width) {
            star.x = 0;
            star.y = Math.random() * canvas.height * 0.7;
        }
    });
}

// =============================================
// FIREWORKS PARTICLE SYSTEM CLASSES
// =============================================
class EnhancedFirework {
    constructor(x, y, targetX, targetY, isSuper = false) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distance = Math.hypot(targetX - x, targetY - y);
        this.speed = isSuper ? 12 + Math.random() * 8 : 8 + Math.random() * 6;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.gravity = 0.15;
        this.hue = Math.floor(Math.random() * 360);
        this.brightness = Math.floor(Math.random() * 31) + 60;
        this.alpha = 1;
        this.trail = [];
        this.trailLength = 8;
        this.size = isSuper ? 5 : 3;
        this.isSuper = isSuper;
        this.sparkleInterval = Math.random() * 0.5 + 0.3;
        this.lastSparkle = 0;
        this.explosionSize = isSuper ? 
            Math.random() * 120 + 180 : 
            Math.random() * 80 + 100;
        this.explosionParticles = isSuper ? 
            Math.floor(Math.random() * 200) + 300 : 
            Math.floor(Math.random() * 100) + 150;
    }
    
    update(currentTime) {
        // Add sparkle effect during flight
        if (currentTime - this.lastSparkle > this.sparkleInterval * 1000) {
            this.createSparkle();
            this.lastSparkle = currentTime;
        }
        
        // Add current position to trail
        this.trail.push({x: this.x, y: this.y, alpha: 1});
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }
        
        // Fade trail
        this.trail.forEach(point => point.alpha -= 0.1);
        
        // Apply velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Apply gravity
        this.velocity.y += this.gravity;
        
        // Calculate distance to target
        const distanceToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        
        // If close to target or reached max height, explode
        if (distanceToTarget < 15 || (this.startY - this.y) > 500) {
            this.explode();
            return false;
        }
        
        return true;
    }
    
    createSparkle() {
        // Create small sparkles during flight
        for (let i = 0; i < 3; i++) {
            particles.push(new SparkleParticle(
                this.x + (Math.random() - 0.5) * 10,
                this.y + (Math.random() - 0.5) * 10,
                this.hue,
                this.brightness
            ));
        }
    }
    
    explode() {
        // Create main explosion with name display
        this.createNameExplosion();
        
        // For super fireworks, add secondary explosions with name
        if (this.isSuper) {
            setTimeout(() => {
                this.createSecondaryNameExplosions();
            }, 300 + Math.random() * 400);
        }
    }
    
    createNameExplosion() {
        // Create text particles instead of regular particles
        for (let i = 0; i < NAME_CHARACTERS.length; i++) {
            const angle = (i * 360) / NAME_CHARACTERS.length;
            const speed = Math.random() * (this.isSuper ? 15 : 10) + 3;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            // Create text particle for each character
            particles.push(new TextParticle(
                this.x,
                this.y,
                this.hue,
                this.brightness,
                velocity,
                NAME_CHARACTERS[i]
            ));
        }
        
        // Add some extra sparkle particles for effect
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            particles.push(new SparkleParticle(
                this.x,
                this.y,
                this.hue,
                this.brightness
            ));
        }
    }
    
    createSecondaryNameExplosions() {
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                
                // Create mini name explosions
                for (let i = 0; i < NAME_CHARACTERS.length; i++) {
                    const angle = (i * 360) / NAME_CHARACTERS.length;
                    const speed = Math.random() * 8 + 2;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    
                    particles.push(new TextParticle(
                        this.x + offsetX,
                        this.y + offsetY,
                        (this.hue + 30) % 360,
                        this.brightness,
                        velocity,
                        NAME_CHARACTERS[i]
                    ));
                }
            }, j * 200);
        }
    }
    
    draw() {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${point.alpha * 0.5})`;
            ctx.fill();
        }
        
        // Draw firework with glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Inner glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${this.brightness}%, 1)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 0.2)`;
        ctx.fill();
    }
}

// =============================================
// TEXT PARTICLE CLASS (NEW)
// =============================================
class TextParticle {
    constructor(x, y, hue, brightness, velocity, character) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.brightness = brightness;
        this.velocity = velocity;
        this.character = character;
        this.gravity = 0.1;
        this.friction = 0.96;
        this.alpha = 1;
        this.size = Math.random() * 20 + 25; // Larger size for text
        this.decay = Math.random() * 0.005 + 0.005; // Slower decay
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.1 + 0.05;
        this.waveOffset = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.wobble += this.wobbleSpeed;
        this.rotation += this.rotationSpeed;
        this.waveOffset += 0.05;
        
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        
        // Add wave effect to movement
        const waveX = Math.sin(this.waveOffset) * 0.5;
        
        this.x += this.velocity.x + waveX;
        this.y += this.velocity.y;
        
        this.alpha -= this.decay;
        
        return this.alpha > 0.1;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Text glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.shadowBlur = 15;
        
        // Draw text
        ctx.font = `bold ${this.size}px 'Poppins', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Create gradient for text
        const gradient = ctx.createLinearGradient(
            -this.size/2, 0,
            this.size/2, 0
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`);
        gradient.addColorStop(0.5, `hsla(${this.hue + 30}, 100%, ${this.brightness + 10}%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`);
        
        ctx.fillStyle = gradient;
        ctx.fillText(this.character, 0, 0);
        
        // Outline effect
        ctx.lineWidth = 2;
        ctx.strokeStyle = `hsla(${this.hue + 60}, 100%, ${this.brightness - 20}%, ${this.alpha * 0.5})`;
        ctx.strokeText(this.character, 0, 0);
        
        ctx.restore();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
}

class EnhancedParticle {
    constructor(x, y, hue, brightness, velocity) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.brightness = brightness;
        this.velocity = velocity;
        this.gravity = 0.1;
        this.friction = 0.96;
        this.alpha = 1;
        this.size = Math.random() * 3 + 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.1 + 0.05;
    }
    
    update() {
        this.wobble += this.wobbleSpeed;
        
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        
        // Add wobble effect
        this.x += this.velocity.x + Math.sin(this.wobble) * 0.5;
        this.y += this.velocity.y;
        
        this.alpha -= this.decay;
        
        return this.alpha > 0;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.wobble);
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha * 0.3})`;
        ctx.fill();
        
        // Main particle
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.fill();
        
        ctx.restore();
    }
}

class SparkleParticle {
    constructor(x, y, hue, brightness) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.brightness = brightness;
        this.size = Math.random() * 2 + 1;
        this.alpha = 1;
        this.decay = 0.1;
    }
    
    update() {
        this.alpha -= this.decay;
        return this.alpha > 0;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.fill();
        
        // Cross shape for sparkle
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 2, this.y);
        ctx.lineTo(this.x + this.size * 2, this.y);
        ctx.moveTo(this.x, this.y - this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// =============================================
// ANIMATION LOOP
// =============================================
function animate(currentTime) {
    // Calculate FPS
    frameCount++;
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        fpsElement.textContent = fps;
    }
    
    // Clear canvas with a dark blue for night sky effect
    ctx.fillStyle = 'rgba(10, 14, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw star particles
    drawStarParticles(currentTime);
    
    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        if (!fireworks[i].update(currentTime)) {
            fireworks.splice(i, 1);
        } else {
            fireworks[i].draw();
        }
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
        }
    }
    
    // Animate flowers
    animateFlowers();
    
    requestAnimationFrame(animate);
}

// =============================================
// UTILITY FUNCTIONS
// =============================================
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

function launchRandomFirework(isSuper = false) {
    // Launch from bottom with random horizontal position
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    
    // Target in upper part of screen, higher for super fireworks
    const targetX = x + (Math.random() - 0.5) * (isSuper ? 300 : 150);
    const targetY = Math.random() * canvas.height * (isSuper ? 0.3 : 0.4);
    
    fireworks.push(new EnhancedFirework(x, y, targetX, targetY, isSuper));
}

function createRandomFlower() {
    // Random position in bottom area
    const x = Math.random() * (canvas.width - 150) + 75;
    const y = Math.random() * 80;
    
    createFlower(x, y);
}

function createMegaFirework(x, y) {
    // Create a massive firework at click position
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = new EnhancedFirework(
                x + (Math.random() - 0.5) * 100,
                canvas.height,
                x + (Math.random() - 0.5) * 200,
                y + (Math.random() - 0.5) * 100,
                true
            );
            fireworks.push(firework);
        }, i * 150);
    }
}

function resetScene() {
    // Clear flowers
    flowerContainer.innerHTML = '';
    flowers = [];
    
    // Clear fireworks and particles
    fireworks = [];
    particles = [];
    starParticles = [];
    
    // Reset stars
    createStars();
    
    // Create initial flowers
    createInitialFlowers();
}

function createInitialFlowers() {
    // Create 10 initial flowers in a natural pattern
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createRandomFlower();
        }, i * 400);
    }
}

// =============================================
// EVENT LISTENERS
// =============================================
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetScene();
});

canvas.addEventListener('click', function(e) {
    // Create firework at click position
    const x = e.clientX;
    const y = e.clientY;
    
    // Launch from bottom to click position
    const startX = x + (Math.random() - 0.5) * 100;
    const startY = canvas.height;
    
    fireworks.push(new EnhancedFirework(startX, startY, x, y));
});

canvas.addEventListener('dblclick', function(e) {
    // Create mega firework on double click
    createMegaFirework(e.clientX, e.clientY);
});

document.getElementById('addFlowerBtn').addEventListener('click', function() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createRandomFlower();
        }, i * 200);
    }
});

document.getElementById('fireworksBtn').addEventListener('click', function() {
    // Launch 4 fireworks
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            launchRandomFirework();
        }, i * 250);
    }
});

document.getElementById('superFireworksBtn').addEventListener('click', function() {
    // Launch 3 super fireworks
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            launchRandomFirework(true);
        }, i * 300);
    }
});

document.getElementById('resetBtn').addEventListener('click', resetScene);

// =============================================
// INITIALIZATION
// =============================================
function init() {
    // Create stars in the sky
    createStars();
    
    // Create initial flowers
    createInitialFlowers();
    
    // Start animation loop
    requestAnimationFrame(animate);
    
    // Start automatic fireworks
    setInterval(() => {
        if (Math.random() > 0.6) {
            launchRandomFirework(Math.random() > 0.8);
        }
    }, 2000);
    
    // Auto-add flowers occasionally
    setInterval(() => {
        if (Math.random() > 0.7 && flowers.length < 25) {
            createRandomFlower();
        }
    }, 3500);
}

// Start everything when page loads
window.onload = init;