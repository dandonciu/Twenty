
const container = document.querySelector('.twentytwenty-container');
const before = document.querySelector('.twentytwenty-before');
const handle = document.querySelector('.twentytwenty-handle');
let isDragging = false;

// Funcție pentru actualizare poziție

function updatePosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
}

// Mouse events
handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
});

// Touch events
handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
    updatePosition(e.touches[0].clientX); // Actualizează imediat la prima atingere
});

// Mișcare (atât pentru mouse, cât și pentru touch)
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Blochează scroll-ul
    updatePosition(e.touches[0].clientX);
}, { passive: false }); // *Important pentru Chrome pe Android*

// Oprire dragging
const stopDragging = () => {
    isDragging = false;
};
document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchend', stopDragging);


const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const volumeControl = document.getElementById('volumeControl');

// Buton ON/OFF
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🔊 ON';
        musicToggle.style.background = '#4CAF50';
    } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇 OFF';
        musicToggle.style.background = '#f44336';
    }
});

// Control volum
volumeControl.addEventListener('input', () => {
    bgMusic.volume = volumeControl.value;
});

// Permite redarea la primul click pe pagină
document.addEventListener('click', () => {
    bgMusic.volume = 0.5;
}, { once: true });
