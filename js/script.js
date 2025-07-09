const container = document.querySelector('.twentytwenty-container');
const before = container.querySelector('.twentytwenty-before');
const handle = container.querySelector('.twentytwenty-handle');

function updatePosition(clientX) {
  const rect = container.getBoundingClientRect();
  let x = clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  const percent = (x / rect.width) * 100;
  before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  handle.style.left = `${percent}%`;
}

let isDragging = false;

handle.addEventListener('mousedown', e => {
  isDragging = true;
  e.preventDefault();
});

handle.addEventListener('touchstart', e => {
  isDragging = true;
  e.preventDefault();
  updatePosition(e.touches[0].clientX);
});

document.addEventListener('mousemove', e => {
  if (isDragging) updatePosition(e.clientX);
});

// Permite pornirea audio la atingere pe mobil
document.addEventListener('touchend', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}, { once: true });

document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('touchend', () => isDragging = false);
