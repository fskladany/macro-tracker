(function(window, document) {
     function SetKeyboardEvents() {
          // Add event listener for Enter key on the addEntryWindow
          document.getElementById('addEntryWindow').addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
               window.MacroTracker.addEntry();
          }
          });
     }

     window.KeyboardPermission = {
          SetKeyboardEvents
               // ...add more exports as needed...
     };
}( window, document ));