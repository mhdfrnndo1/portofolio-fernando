// ==========================================
// 1. INIT LIBRARIES (AOS & TYPEWRITER)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 900, once: true, offset: 50, easing: 'ease-out-cubic' });
    }

    const typeText = document.querySelector('.type-effect');
    if (typeText && typeof Typewriter !== 'undefined') {
        new Typewriter(typeText, {
            strings: ['Cloud Infrastructure', 'Fullstack Architecture', 'Enterprise Solutions'],
            autoStart: true, loop: true, delay: 50, deleteSpeed: 20, cursor: '|'
        });
    }
});

// ==========================================
// 2. TECH NETWORK BACKGROUND ANIMATION
// ==========================================
const canvas = document.getElementById("meteor-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5; // Sangat lambat
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            // Pantul di ujung layar
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 254, 0.5)"; // Warna titik cyan
            ctx.fill();
        }
    }

    // Buat partikel berdasarkan ukuran layar (tidak terlalu ramai)
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Gambar garis penghubung jika berdekatan
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 - distance/120})`; 
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateNetwork);
    }
    animateNetwork();
}

// ==========================================
// 3. CLEAN MUSIC PLAYER LOGIC
// ==========================================
const playlist = [
    { title: "Terbecak-becak", artist: "DJ Monalexa X DJAloy", src: "assets/music/bgm.mp3", cover: "assets/image/cover1.jpg" },
    { title: "Jaksel Abiezz", artist: "DJ Monalexa", src: "assets/music/jaksel.mp3", cover: "assets/image/cover2.jpg" },
    { title: "Beat That!!!", artist: "DJ Monalexa", src: "assets/music/beat.mp3", cover: "assets/image/cover3.jpg" }
];

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
const audio = document.getElementById('localAudio'); 

function loadTrack(index) {
    if (!audio || playlist.length === 0) return;
    clearInterval(updateTimer);
    
    const progressFill = document.getElementById('progress-fill');
    if(progressFill) progressFill.style.width = "0%";

    audio.src = playlist[index].src;
    audio.load();

    const titleEl = document.getElementById('track-title');
    const artistEl = document.getElementById('track-artist');
    const coverEl = document.getElementById('track-cover');

    if(titleEl) titleEl.textContent = playlist[index].title;
    if(artistEl) artistEl.textContent = playlist[index].artist;
    if(coverEl) {
        coverEl.src = playlist[index].cover;
        coverEl.onerror = function() { this.src = "assets/image/nando1.png"; }; 
    }

    updateTimer = setInterval(seekUpdate, 1000);
    audio.addEventListener("ended", nextTrack);
}

window.playTrack = function() {
    if (!audio) return;
    const playBtn = document.getElementById('play-pause-btn');
    
    let playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            if(playBtn) playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        }).catch(err => {
            isPlaying = false;
            if(playBtn) playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        });
    }
}

window.pauseTrack = function() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    const playBtn = document.getElementById('play-pause-btn');
    if(playBtn) playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
}

window.togglePlay = function() { isPlaying ? pauseTrack() : playTrack(); }
window.nextTrack = function() {
    trackIndex = (trackIndex < playlist.length - 1) ? trackIndex + 1 : 0;
    loadTrack(trackIndex); playTrack();
}
window.prevTrack = function() {
    trackIndex = (trackIndex > 0) ? trackIndex - 1 : playlist.length - 1;
    loadTrack(trackIndex); playTrack();
}

function seekUpdate() {
    if (!audio || !audio.duration) return;
    let seekPosition = audio.currentTime * (100 / audio.duration);
    const progressFill = document.getElementById('progress-fill');
    if(progressFill) progressFill.style.width = seekPosition + "%";

    const currentEl = document.getElementById('current-time');
    const durationEl = document.getElementById('total-duration');
    if(currentEl) currentEl.textContent = formatTime(audio.currentTime);
    if(durationEl) durationEl.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds - min * 60);
    if (sec < 10) sec = "0" + sec;
    return min + ":" + sec;
}

window.seekTrack = function(event) {
    if (!audio) return;
    const container = document.getElementById('progress-container');
    audio.currentTime = (event.offsetX / container.clientWidth) * audio.duration;
}

if(audio) { audio.volume = 0.5; loadTrack(trackIndex); }

// ==========================================
// 4. PRELOADER LOGIC (FAST & STABLE)
// ==========================================
// ==========================================
// 4. PRELOADER LOGIC (AUTO-DISMISS)
// ==========================================
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const statusTxt = document.querySelector('.system-status');
    const bar = document.getElementById('cyborg-bar');
    const pct = document.getElementById('loader-percentage');

    let loadVal = 0;
    const interval = setInterval(() => {
        loadVal += 3; // Kecepatan loading
        
        if (loadVal >= 100) {
            loadVal = 100;
            clearInterval(interval);
            
            if (statusTxt) {
                statusTxt.innerText = "SECURE CONNECTION ESTABLISHED";
                statusTxt.style.color = "#00f2fe"; 
            }
            
            // Jeda 0.8 detik agar teks "ESTABLISHED" sempat terbaca, lalu otomatis masuk
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('preloader-hidden');
                    // Hapus preloader dari background setelah animasinya memudar
                    setTimeout(() => { preloader.style.display = "none"; }, 500);
                }
                
                // Mencoba putar musik otomatis (Browser mungkin memblokirnya hingga ada interaksi klik)
                if (typeof playTrack === "function") {
                    playTrack();
                }
            }, 800);
        }
        
        if (pct) pct.innerText = loadVal + '%';
        if (bar) bar.style.width = loadVal + '%';
    }, 20);
});