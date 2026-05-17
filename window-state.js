(function (window, document) {

     // Save window positions and visibility
     function saveWindowState() {
          console.log("Window state saved");
          const frames = document.querySelectorAll('.draggable.ui-frame');
          console.log("Frame count: ", frames.length);
          const storageKey = window.Sync.getStorageKey('windowState');
          const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
          
          frames.forEach(frame => {
               win = frame.querySelector('.ui-window');
               if (!win){
                    console.error ("Closest win not found for frame: " +frame.id);
                    return;
               }
               const computedStyle = window.getComputedStyle(frame);
               state[frame.id] = {
                    visible: !frame.classList.contains('hidden'),
                    collapsed: win.classList.contains('collapsed'),
                    x: frame.style.left || computedStyle.left,
                    y: frame.style.top || computedStyle.top
               };
          });
          localStorage.setItem(storageKey, JSON.stringify(state));
     }

// Restore window positions and visibility (single-user mode)
function restoreWindowState() {
    const storageKey = 'default_windowState';
    const state = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const frames = document.querySelectorAll('.draggable.ui-frame');
    console.log("restoring frame windows: " + frames.length);

    frames.forEach(frame => {
        const win = frame.querySelector('.ui-window');

        if (!win) {
            console.error("Closest win not found for frame: " + frame.id);
            return;
        }

        const frameState = state[frame.id];

        if (frameState) {
            // visibility
            frame.classList.toggle('hidden', !frameState.visible);

            // collapse state
            win.classList.toggle('collapsed', frameState.collapsed);

            if (frameState.collapsed === true) {
                console.log("collapsed: " + frame.id);

                const header = frame.querySelector('.h3h3');
                if (header) {
                    header.classList.remove('hidden');
                } else {
                    console.log("header not found in " + frame.id);
                }
            }

            // position restore
            if (frameState.x != null) frame.style.left = frameState.x;
            if (frameState.y != null) frame.style.top = frameState.y;

        } else {
            // No saved state → keep default visible instead of hiding
            frame.classList.remove('hidden');
            console.log("State not found for frame: " + frame.id);
        }

        // always interactive in single-user mode
        win.style.pointerEvents = 'auto';
        win.classList.remove('readonly-view');
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