// Save window positions and visibility
function saveWindowState() {
     const windows = document.querySelectorAll('.draggable.ui-window');
     const state = JSON.parse(localStorage.getItem('windowState') || '{}');
     windows.forEach(win => {
          state[win.id] = {
               visible: !win.classList.contains('hidden'),
               x: win.style.left || 0 + 'px',
               y: win.style.top || 0 + 'px'
          };
     });
     localStorage.setItem('windowState', JSON.stringify(state));
}

// Restore window positions and visibility
function restoreWindowState() {
     const state = JSON.parse(localStorage.getItem('windowState') || '{}');
     Object.keys(state).forEach(id => {
          const win = document.getElementById(id);
          if (win) {
               win.classList.toggle('hidden', !state[id].visible);
               win.style.left = state[id].x || win.style.left;
               win.style.top = state[id].y || win.style.top;
          }
     });
}

// Save state on drag or toggle
window.addEventListener('mouseup', saveWindowState);
document.addEventListener('DOMContentLoaded', restoreWindowState);

// Optionally expose for manual save
window.saveWindowState = saveWindowState;
window.restoreWindowState = restoreWindowState;