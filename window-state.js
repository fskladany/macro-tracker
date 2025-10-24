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

     // Restore window positions and visibility
     function restoreWindowState(user = null) {
          const targetUser = user || window.Sync.getCurrentUser();
          const isViewingOther = user && user !== window.Sync.getCurrentUser();

          const storageKey = window.Sync.getStorageKey('windowState', targetUser);
          const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
          
          const frames =  document.querySelectorAll('.draggable.ui-frame');
          console.log("restoring frame windows: "+ frames.length);
          
          frames.forEach(frame => {
               win = frame.querySelector('.ui-window');
               if (!win){
                    console.error ("Closest win not found for frame: " +frame.id);
                    return;
               }


               if (state[frame.id]) {
                    frame.classList.toggle('hidden', !state[frame.id].visible);
                    win.classList.toggle('collapsed', state[frame.id].collapsed);
                    if (state[frame.id].collapsed == true){
                         console.log("not collapsed: " + frame.id);
                    
                         const header = frame.querySelector('.h3h3');
                         if (header){
                              header.classList.remove('hidden');
                         }
                         else{
                              console.log("header not found in "+ frame.id);
                         }
                    
                        
                         
                    }
                    frame.style.left = state[frame.id].x || frame.style.left;
                    frame.style.top = state[frame.id].y || frame.style.top;

               } else {
                    // Hide windows that don't have a state for the viewed user
                    frame.classList.add('hidden');
                    console.log("State not found for frame: "+frame.id);
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