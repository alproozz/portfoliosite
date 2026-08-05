const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');

// Frame settings
const frameCount = 60;
const currentFrame = index => `images/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
    }
};

const img = new Image();
img.src = currentFrame(1);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

img.onload = function () {
    renderImage(img);
};

const renderImage = (image) => {
    // Calculate the scale to cover the whole canvas (object-fit: cover equivalent)
    const scale = Math.max(canvas.width / image.width, canvas.height / image.height);

    // Calculate the centered position
    const x = (canvas.width / 2) - (image.width / 2) * scale;
    const y = (canvas.height / 2) - (image.height / 2) * scale;

    // Clear canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image centered and scaled to cover
    context.drawImage(image, x, y, image.width * scale, image.height * scale);
};

const updateImage = index => {
    const nextImage = new Image();
    nextImage.src = currentFrame(index);
    nextImage.onload = () => renderImage(nextImage);
};

// --- Perhitungan Animasi Frame Berhenti di Section My Projects ---
const handleScrollAnimation = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const projectsSection = document.querySelector('.projects');

    // Mengunci animasi agar selesai (Frame 60) tepat saat layar menyentuh section .projects
    let maxScrollTop;
    if (projectsSection) {
        maxScrollTop = projectsSection.offsetTop;
    } else {
        maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    }

    // Mengunci nilai fraction agar tidak melebihi 1
    const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScrollTop));

    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => updateImage(frameIndex + 1));
};

window.addEventListener('scroll', handleScrollAnimation);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    handleScrollAnimation();
});

preloadImages();

// --- Scramble Text Effect for "al melviano" ---
const GLITCH_CHARS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GLITCH_CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";

class ScrambleText {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.chars = this.originalText.split("");
        this.isAnimating = false;

        // Add hover listener
        this.element.addEventListener("mouseenter", () => this.scramble());

        // Initial scramble on load
        setTimeout(() => this.scramble(), 500);
    }

    scramble() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let frame = 0;
        const totalFrames = 20; // How long the scramble lasts
        const updateInterval = 40; // Ms between frames

        const settleFrames = this.chars.map(() => Math.floor(Math.random() * totalFrames));

        const animate = () => {
            let output = "";
            let settledCount = 0;

            for (let i = 0; i < this.chars.length; i++) {
                const char = this.chars[i];

                if (char === " ") {
                    output += " ";
                    settledCount++;
                    continue;
                }

                if (frame >= settleFrames[i]) {
                    output += char;
                    settledCount++;
                } else {
                    const isLower = char === char.toLowerCase() && char !== char.toUpperCase();
                    const pool = isLower ? GLITCH_CHARS_LOWER : GLITCH_CHARS_UPPER;
                    output += pool[Math.floor(Math.random() * pool.length)];
                }
            }

            this.element.innerText = output;
            frame++;

            if (settledCount < this.chars.length) {
                setTimeout(animate, updateInterval);
            } else {
                this.isAnimating = false;
                this.element.innerText = this.originalText;
            }
        };

        animate();
    }
}

// Initialize scramble effect on hero texts
document.querySelectorAll('.hero-text').forEach(el => {
    new ScrambleText(el);
});

// --- Carousel Drag and Click Logic (Sempurna & Mulus) ---
const carousel = document.getElementById('projects-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;

if (carousel) {
    carousel.addEventListener('dragstart', (e) => e.preventDefault());

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;

        if (Math.abs(x - startX) > 5) {
            isDragging = true;
        }

        carousel.scrollLeft = scrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            carousel.classList.remove('active');
        }
    });

    carousel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });
}

const scrollAmount = 400;

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}



// JS dari Certicates 




document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('kineticGridCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;

    // --- Pengaturan Grid Kinetic ---
    const CONFIG = {
        spacing: 35,          // Jarak antar titik grid
        radius: 180,          // Jangkauan efek kursor
        strength: 30,         // Tarikan grid ke kursor
        dotSize: 1.8,         // Ukuran titik
        /* PENGATURAN WARNA (PUTIH TERANG) */
        dotColor: 'rgba(255, 255, 255, 0.6)',        // Titik putih terang
        lineColor: 'rgba(255, 255, 255, 0.22)',      // Garis grid putih yang terlihat jelas
        activeLineColor: 'rgba(255, 255, 255, 0.9)'  // Garis putih sangat terang saat kursor mendekat
    };

    let width, height;
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    function resize() {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
    });

    section.addEventListener('mouseleave', () => {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smoothing pergerakan kursor
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;

        const cols = Math.ceil(width / CONFIG.spacing) + 1;
        const rows = Math.ceil(height / CONFIG.spacing) + 1;
        const grid = [];

        // Hitung posisi titik berdasarkan kursor
        for (let r = 0; r < rows; r++) {
            grid[r] = [];
            for (let c = 0; c < cols; c++) {
                const originX = c * CONFIG.spacing;
                const originY = r * CONFIG.spacing;

                const dx = mouse.x - originX;
                const dy = mouse.y - originY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let renderX = originX;
                let renderY = originY;

                if (dist < CONFIG.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - dist / CONFIG.radius) * CONFIG.strength;
                    renderX += Math.cos(angle) * force;
                    renderY += Math.sin(angle) * force;
                }

                grid[r][c] = { x: renderX, y: renderY, dist };
            }
        }

        // Gambar Garis Grid
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const p = grid[r][c];

                if (c < cols - 1) {
                    const pRight = grid[r][c + 1];
                    const isNear = p.dist < CONFIG.radius || pRight.dist < CONFIG.radius;
                    ctx.strokeStyle = isNear ? CONFIG.activeLineColor : CONFIG.lineColor;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pRight.x, pRight.y);
                    ctx.stroke();
                }

                if (r < rows - 1) {
                    const pBottom = grid[r + 1][c];
                    const isNear = p.dist < CONFIG.radius || pBottom.dist < CONFIG.radius;
                    ctx.strokeStyle = isNear ? CONFIG.activeLineColor : CONFIG.lineColor;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pBottom.x, pBottom.y);
                    ctx.stroke();
                }
            }
        }

        // Gambar Titik Grid
        ctx.fillStyle = CONFIG.dotColor;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const p = grid[r][c];
                ctx.beginPath();
                ctx.arc(p.x, p.y, CONFIG.dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});