(function (window, document) {

     // Save window positions and visibility
     function saveWindowState() {
          const frames = document.querySelectorAll('.draggable.ui-frame');
          const storageKey = window.Sync.getStorageKey('windowState');
          const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
          frames.forEach(frame => {
               win = frame.querySelector('.ui-window');
               if (!win){
                    console.error ("Closest win not found for frame: " +frame.id);
                    return;
               }
               const computedStyle = window.getComputedStyle(win);
               state[frame.id] = {
                    visible: !win.classList.contains('hidden'),
                    x: frame.style.left || computedStyle.left,
                    y: frame.style.top || computedStyle.top
               };
          });
          localStorage.setItem(storageKey, JSON.stringify(state));
     }

     // Restore window positions and visibility
     function restoreWindowState(user = null) {
          const targetUser = user || window.Sync.getCurrentUser();
          const isViewingOther = user && user !== window.Sync.getCurrentUser();

          const storageKey = window.Sync.getStorageKey('windowState', targetUser);
          const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
          
          document.querySelectorAll('.draggable.ui-frame').forEach(frame => {
               win = frame.querySelector('.ui-window');
               if (!win){
                    console.error ("Closest win not found for frame: " +frame.id);
                    return;
               }
               if (state[win.id]) {
                    frame.classList.toggle('hidden', !state[win.id].visible);
                    frame.style.left = state[win.id].x || win.style.left;
                    frame.style.top = state[win.id].y || win.style.top;
               } else {
                    // Hide windows that don't have a state for the viewed user
                    frame.classList.add('hidden');
               }
               
               if (isViewingOther) {
                    win.style.pointerEvents = 'none';
                    win.classList.add('readonly-view');
               } else {
                    win.style.pointerEvents = 'auto';
                    win.classList.remove('readonly-view');
               }
          });
     }

     function demonstrateFlowPresence() {
          const storageKey = window.Sync.getStorageKey('flows');
          const stored = localStorage.getItem(storageKey);
          if (stored) {
               const arr = JSON.parse(stored);
               if (arr.length > 0) {
                    document.getElementById('demonstrateActiveFlowsId').classList.remove('hidden');
               } else {
                    document.getElementById('demonstrateActiveFlowsId').classList.add('hidden');
               }
          }
     }

     // Utility: Ensure window is always appended to top-level container
     function ensureWindowIsTopLevel(windowElement) {
          const topLevelContainer = document.querySelector('.window-container') || document.body;
          if (windowElement.parentElement !== topLevelContainer) {
               topLevelContainer.appendChild(windowElement);
          }
     }

     // Save state on drag or toggle
     window.addEventListener('mouseup', function () {
          document.querySelectorAll('.ui-frame').forEach(win => ensureWindowIsTopLevel(win));
          saveWindowState();
     });


     // Optionally expose for manual save
     window.saveWindowState = saveWindowState;
     window.restoreWindowState = restoreWindowState;
     window.demonstrateFlowPresence = demonstrateFlowPresence;

}(window, document));